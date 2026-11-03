import { useEffect, useState } from 'react'
import {
  motion,
  useReducedMotion,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion'
import { portfolioSections } from '@/data/portfolio-sections'

const dicePips: Record<number, readonly (readonly [number, number])[]> = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
}

function PortfolioNav({
  color,
  surface,
  cornerOpacity,
}: {
  color: MotionValue<string>
  surface: MotionValue<string>
  cornerOpacity: MotionValue<number> | number
}) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [introComplete, setIntroComplete] = useState(false)
  const [dice, setDice] = useState<[number, number]>([2, 1])
  const prefersReducedMotion = useReducedMotion()
  useEffect(() => {
    const intro = document.querySelector('.wpl-root')
    if (!(intro instanceof HTMLElement)) return

    const updateIntroState = () => {
      setIntroComplete(intro.dataset.intro === 'done')
    }

    updateIntroState()
    const introObserver = new MutationObserver(updateIntroState)
    introObserver.observe(intro, {
      attributes: true,
      attributeFilter: ['data-intro'],
    })

    let frame = 0

    const updateActiveSection = () => {
      frame = 0
      const marker = window.innerHeight * 0.4
      const visibleSections = portfolioSections
        .map(([, id], order) => ({
          id,
          order,
          element: document.getElementById(id),
        }))
        .filter(
          (section): section is typeof section & { element: HTMLElement } =>
            section.element instanceof HTMLElement,
        )
        .map((section) => ({
          ...section,
          bounds: section.element.getBoundingClientRect(),
        }))

      const current = visibleSections
        .filter(({ bounds }) => bounds.top <= marker && bounds.bottom > marker)
        .at(-1)
      const upcoming = visibleSections
        .filter(({ bounds }) => bounds.top > marker)
        .sort((a, b) => a.bounds.top - b.bounds.top)[0]

      setActiveSection(
        window.scrollY === 0 ? null : current?.id ?? upcoming?.id ?? null,
      )
    }

    const scheduleUpdate = () => {
      if (frame === 0) frame = window.requestAnimationFrame(updateActiveSection)
    }

    const observer = new MutationObserver(scheduleUpdate)
    observer.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    scheduleUpdate()

    return () => {
      introObserver.disconnect()
      observer.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const corners = [
      document.querySelector<HTMLElement>('.wpl-corner-l'),
      document.querySelector<HTMLElement>('.wpl-corner-r'),
    ]
    const updateDice = () => {
      const readValue = (corner: HTMLElement | null, fallback: number) => {
        const value = corner?.getAttribute('aria-label')?.match(/showing (\d+)/)?.[1]
        return value ? Number(value) : fallback
      }

      setDice([readValue(corners[0], 2), readValue(corners[1], 1)])
    }

    updateDice()
    const observer = new MutationObserver(updateDice)
    corners.forEach((corner) => {
      if (corner) {
        observer.observe(corner, {
          attributes: true,
          attributeFilter: ['aria-label'],
        })
      }
    })
    return () => observer.disconnect()
  }, [])

  return (
    <motion.nav
      className={`portfolio-nav${introComplete ? ' is-ready' : ''}`}
      aria-label="Portfolio sections"
      style={
        {
          color: activeSection
             ? '#141414'
             : color,
         '--accent': '#e5262c',
         '--portfolio-nav-surface':
             activeSection
               ? activeSection === 'projects'
                ? '#f6f4f0'
                 : '#f6f4f0'
               : surface,
          '--portfolio-nav-corner-opacity': cornerOpacity,
        } as MotionStyle
      }
    >
      <div className="portfolio-nav-corners" aria-hidden="true">
        {(['left', 'right'] as const).map((side, index) => (
          <svg
            key={side}
            className={`portfolio-nav-corner portfolio-nav-corner-${side}`}
            viewBox="0 0 170 170"
          >
            <path
              d="M 0 108 L 108 108 L 108 0 M 0 124 L 124 124 L 124 0 M 0 140 L 140 140 L 140 0"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
            />
            <rect width="92" height="92" fill="var(--accent)" />
            {(dicePips[dice[index]] ?? []).map(([x, y], pipIndex) => (
              <circle
                key={`${dice[index]}-${pipIndex}`}
                cx={48 + x * 20}
                cy={46 + y * 20}
                r="7.5"
                fill="var(--paper)"
              />
            ))}
          </svg>
        ))}
      </div>
      <ul className="portfolio-nav-list">
        {portfolioSections.map(([label, section]) => (
          <li key={section}>
            <a
              href={`#${section}`}
              aria-current={activeSection === section ? 'location' : undefined}
              onClick={(event) => {
                if (prefersReducedMotion || !event.currentTarget.hash) return
                const target = document.getElementById(section)
                if (!target) return

                event.preventDefault()
                if (section === 'projects') {
                  const targetTop = target.getBoundingClientRect().top + window.scrollY
                  const scrollDistance = Math.max(
                    0,
                    target.offsetHeight - window.innerHeight,
                  )
                  window.scrollTo({
                    top: targetTop + scrollDistance * 0.02,
                    behavior: 'smooth',
                  })
                } else {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                window.history.pushState(null, '', `#${section}`)
              }}
            >
              <span className="portfolio-nav-dot" aria-hidden="true" />
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  )
}

export default PortfolioNav
