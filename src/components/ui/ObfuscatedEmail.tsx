import { useState, useCallback, useMemo } from 'react'

interface ObfuscatedEmailProps {
  /** Email dividido en partes para ofuscación: ['usuario', 'dominio', 'tld'] */
  emailParts: [string, string, string]
  className?: string
  children?: (email: string, handleClick: () => void) => React.ReactNode
}

const ObfuscatedEmail = ({ emailParts, className = '', children }: ObfuscatedEmailProps) => {
  const [isRevealed, setIsRevealed] = useState(false)

  // Construir el email solo cuando se necesite (en memoria, no en DOM)
  const email = useMemo(() => {
    const [user, domain, tld] = emailParts
    return `${user}@${domain}.${tld}`
  }, [emailParts])

  // Texto ofuscado para mostrar antes de revelar
  const obfuscatedDisplay = useMemo(() => {
    const [user, domain, tld] = emailParts
    return `${user}[at]${domain}[dot]${tld}`
  }, [emailParts])

  const handleClick = useCallback(() => {
    setIsRevealed(true)
    // Abrir cliente de email
    window.location.href = `mailto:${email}`
  }, [email])

  // Si se proporciona un render prop, usarlo
  if (children) {
    return <>{children(email, handleClick)}</>
  }

  // Render por defecto
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`cursor-pointer hover:underline ${className}`}
      aria-label="Enviar email"
    >
      {isRevealed ? email : obfuscatedDisplay}
    </button>
  )
}

export default ObfuscatedEmail
