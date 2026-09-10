/**
 * Convierte a WebP las capturas de proyectos.
 * ─────────────────────────────────────────────────────────────
 * Se ejecuta a mano al añadir o reemplazar una captura, NO en cada
 * build: las imágenes cambian un par de veces al año y el resultado
 * se commitea, así que el build y el CI no pagan la conversión.
 *
 *   npm run images:webp            # convierte y deja los PNG
 *   npm run images:webp -- --clean # convierte y borra los PNG de origen
 *
 * Por qué sharp y no vite-imagetools: ver CONTEXT.md (T2-01).
 */
import { readdir, stat, unlink } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const DIR = "public/projects";

/* 85 sale de medir sobre una captura real (1919×918): 80 % menos que el
   PNG, y el texto de las capturas sigue nítido. Por debajo de 80 empiezan
   a verse artefactos en los bordes del texto de las UI. */
const QUALITY = 85;

const kb = (n) => `${(n / 1024).toFixed(0)} kB`;

const main = async () => {
  const clean = process.argv.includes("--clean");
  const files = (await readdir(DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f));

  if (files.length === 0) {
    console.log(`No hay PNG ni JPEG en ${DIR}/ — nada que hacer.`);
    return;
  }

  let antes = 0;
  let despues = 0;
  let borrados = 0;
  const conservados = [];

  for (const file of files) {
    const src = join(DIR, file);
    const dest = join(DIR, `${parse(file).name}.webp`);

    const { size: origen } = await stat(src);
    const { width, height } = await sharp(src).metadata();
    await sharp(src).webp({ quality: QUALITY, effort: 6 }).toFile(dest);
    const { size: salida } = await stat(dest);

    antes += origen;
    despues += salida;

    const ahorro = ((1 - salida / origen) * 100).toFixed(0);
    console.log(`${file.padEnd(38)} ${String(width)}×${height}  ${kb(origen)} → ${kb(salida)}  (-${ahorro} %)`);

    /* `--clean` borra el original y eso no tiene vuelta atrás, así que se
       exige que la conversión haya salido bien de verdad: un archivo con
       contenido y más pequeño que el origen. Si el WebP saliera mayor —pasa
       con capturas de pocos colores o ya muy optimizadas— el PNG es la
       versión buena y borrarlo sería perder calidad y espacio a la vez. */
    if (clean) {
      if (salida > 0 && salida < origen) {
        await unlink(src);
        borrados += 1;
      } else {
        conservados.push(file);
      }
    }
  }

  console.log("");
  console.log(`TOTAL: ${kb(antes)} → ${kb(despues)}  (-${((1 - despues / antes) * 100).toFixed(0)} %)`);

  if (clean) {
    console.log(`Originales borrados: ${borrados} de ${files.length}.`);
    if (conservados.length > 0) {
      console.log(`CONSERVADOS por seguridad (el WebP no salió más pequeño): ${conservados.join(", ")}`);
      process.exitCode = 1;
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
