"use client"

import { useEffect, useState } from "react"

export const useScrollspy = (sections = [], { rootMargin = "0px 0px -60% 0px", threshold = 0.25 } = {}) => {
  const [activeId, setActiveId] = useState(sections[0] || "")

  useEffect(() => {
    const observers = []
    const visibleSections = new Set()
    
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id")
        if (id) {
          if (entry.isIntersecting) {
            visibleSections.add(id)
          } else {
            visibleSections.delete(id)
          }
        }
      })

      // Find the topmost visible section
      if (visibleSections.size > 0) {
        const visibleArray = Array.from(visibleSections)
        const topSection = sections.find(section => visibleArray.includes(section))
        if (topSection) {
          setActiveId(topSection)
        }
      }
    }

    const observer = new IntersectionObserver(handleIntersect, { root: null, rootMargin, threshold })
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    observers.push(observer)

    // Fallback: detect active section by scroll position
    const handleScroll = () => {
      if (visibleSections.size === 0) {
        const scrollPosition = window.scrollY + 100 // Account for navbar height
        
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = document.getElementById(sections[i])
          if (section && section.offsetTop <= scrollPosition) {
            setActiveId(sections[i])
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observers.forEach((o) => o.disconnect())
      window.removeEventListener('scroll', handleScroll)
    }
  }, [sections, rootMargin, threshold])

  return activeId
}

export default useScrollspy
