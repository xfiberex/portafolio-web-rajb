"use client"

import { useEffect, useState } from "react"

export const useScrollspy = (sections = [], { rootMargin = "0px 0px -60% 0px", threshold = 0.25 } = {}) => {
  const [activeId, setActiveId] = useState(sections[0] || "")

  useEffect(() => {
    const observers = []
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id")
          if (id) setActiveId(id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, { root: null, rootMargin, threshold })
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    observers.push(observer)

    return () => observers.forEach((o) => o.disconnect())
  }, [sections, rootMargin, threshold])

  return activeId
}

export default useScrollspy
