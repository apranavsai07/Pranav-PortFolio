import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import type { RefObject } from 'react'

const projectScrollStages = [0.12, 0.14, 0.3, 0.4, 0.5, 0.6, 0.7, 0.78, 0.82, 0.84] as const

function getProjectIndex(progress: number, projectCount: number) {
  if (projectCount < 2) return 0
  if (projectCount !== 3) {
    return Math.min(
      projectCount - 1,
      Math.max(0, Math.round(progress * (projectCount - 1))),
    )
  }
  return progress < 0.2 ? 0 : progress < 0.65 ? 1 : 2
}

function getProjectProgress(index: number, projectCount: number) {
  if (projectCount === 3) return [0.12, 0.3, 0.7][index]
  return index / Math.max(1, projectCount - 1)
}

function getProjectStage(index: number, projectCount: number) {
  if (projectCount === 3) return [0, 2, 6][index]
  return Math.round((index / Math.max(1, projectCount - 1)) * (projectScrollStages.length - 1))
}

export interface FeaturedProject {
  id: string
  name: string
  category: string
  year?: string
  summary: string
  services: readonly string[]
  outcome: string
  visual: ReactNode
  visualDescription: string
  visualScreenshots: readonly string[]
  caseStudy: readonly {
    heading: string
    body: string
  }[]
  githubUrl?: string
  liveDemoUrl?: string
}

type FeaturedProjectHeroProps = {
  id: string
  sectionRef: RefObject<HTMLElement | null>
  projects: readonly FeaturedProject[]
  onOpenProject: (project: FeaturedProject) => void
}

export function FeaturedProjectHero({
  id,
  sectionRef,
  projects,
  onOpenProject,
}: FeaturedProjectHeroProps) {
  const uid = useId()
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedIndexRef = useRef(0)
  const [direction, setDirection] = useState(1)
  const pendingIndex = useRef<number | null>(null)
  const pendingTimeout = useRef<number | null>(null)
  const scrollStage = useRef(0)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const projectContentOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.86, 1],
    [0, 1, 1, 0],
  )
  const projectVisualX = useTransform(
    scrollYProgress,
    [0, 0.12, 0.84, 1],
    [-112, 0, 0, -112],
  )
  const projectInfoX = useTransform(
    scrollYProgress,
    [0, 0.12, 0.84, 1],
    [112, 0, 0, 112],
  )
  const project = projects[selectedIndex]
  const panelId = `${uid}-panel`

  const updateSelectedIndex = (nextIndex: number) => {
    const currentIndex = selectedIndexRef.current
    if (currentIndex === nextIndex) return
    setDirection(nextIndex > currentIndex ? 1 : -1)
    selectedIndexRef.current = nextIndex
    setSelectedIndex(nextIndex)
  }

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (projects.length < 2) return
    const nextIndex = getProjectIndex(progress, projects.length)
    if (pendingIndex.current !== null) {
      const targetProgress = getProjectProgress(
        pendingIndex.current,
        projects.length,
      )
      if (Math.abs(progress - targetProgress) > 0.04) return
      pendingIndex.current = null
      if (pendingTimeout.current !== null) {
        window.clearTimeout(pendingTimeout.current)
        pendingTimeout.current = null
      }
    }
    updateSelectedIndex(nextIndex)
  })

  useEffect(() => {
    const finishPendingSelection = () => {
      if (pendingIndex.current === null) return
      pendingIndex.current = null
      if (pendingTimeout.current !== null) {
        window.clearTimeout(pendingTimeout.current)
        pendingTimeout.current = null
      }
      const progress = scrollYProgress.get()
      const nextIndex = getProjectIndex(progress, projects.length)
      const currentIndex = selectedIndexRef.current
      if (currentIndex === nextIndex) return
      setDirection(nextIndex > currentIndex ? 1 : -1)
      selectedIndexRef.current = nextIndex
      setSelectedIndex(nextIndex)
    }

    window.addEventListener('scrollend', finishPendingSelection)
    return () => {
      window.removeEventListener('scrollend', finishPendingSelection)
      if (pendingTimeout.current !== null) {
        window.clearTimeout(pendingTimeout.current)
      }
    }
  }, [projects.length, scrollYProgress])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let wheelLockedUntil = 0
    let touchStartY: number | null = null
    let touchMoved = false

    const isPinned = () => {
      const bounds = section.getBoundingClientRect()
      return bounds.top <= 1 && bounds.bottom > window.innerHeight + 1
    }

    const getNextStage = (direction: number) =>
      Math.max(
        0,
        Math.min(
          projectScrollStages.length - 1,
          scrollStage.current + direction,
        ),
      )

    const moveStage = (direction: number) => {
      const nextStage = getNextStage(direction)
      if (nextStage === scrollStage.current) return false

      scrollStage.current = nextStage
      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      const scrollDistance = Math.max(0, section.offsetHeight - window.innerHeight)
      window.scrollTo({
        top: sectionTop + scrollDistance * projectScrollStages[nextStage],
        behavior: reducedMotion ? 'instant' : 'smooth',
      })
      return true
    }

    const handleWheel = (event: WheelEvent) => {
      if (
        !isPinned() ||
        event.deltaY === 0 ||
        (event.target instanceof Element && event.target.closest('dialog[open]'))
      ) {
        return
      }
      const direction = Math.sign(event.deltaY)
      if (getNextStage(direction) === scrollStage.current) return

      event.preventDefault()
      const now = performance.now()
      if (now < wheelLockedUntil) return
      wheelLockedUntil = now + 450
      moveStage(direction)
    }

    const handleTouchStart = (event: TouchEvent) => {
      const target = event.target
      if (
        !isPinned() ||
        (target instanceof Element &&
          target.closest('a, button, input, select, textarea, dialog[open]'))
      ) {
        touchStartY = null
        touchMoved = false
        return
      }
      touchStartY = event.touches[0]?.clientY ?? null
      touchMoved = false
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartY === null || !isPinned()) return
      const currentY = event.touches[0]?.clientY
      if (currentY === undefined || Math.abs(touchStartY - currentY) < 12) return
      const direction = Math.sign(touchStartY - currentY)
      if (getNextStage(direction) === scrollStage.current) return
      event.preventDefault()
      touchMoved = true
    }

    const handleTouchEnd = (event: TouchEvent) => {
      const endY = event.changedTouches[0]?.clientY
      if (touchStartY !== null && touchMoved && endY !== undefined) {
        const distance = touchStartY - endY
        if (Math.abs(distance) >= 35) moveStage(Math.sign(distance))
      }
      touchStartY = null
      touchMoved = false
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [projects.length, reducedMotion, sectionRef])

  const selectProject = (index: number) => {
    if (index < 0 || index >= projects.length) return
    updateSelectedIndex(index)
    if (projects.length < 2 || !sectionRef.current) return

    pendingIndex.current = index
    scrollStage.current = getProjectStage(index, projects.length)
    if (pendingTimeout.current !== null) {
      window.clearTimeout(pendingTimeout.current)
    }
    const section = sectionRef.current
    const sectionTop = section.getBoundingClientRect().top + window.scrollY
    const scrollDistance = Math.max(0, section.offsetHeight - window.innerHeight)
    const projectProgress = getProjectProgress(index, projects.length)
    const targetScroll = sectionTop + scrollDistance * projectProgress
    window.scrollTo({
      top: targetScroll,
      behavior: reducedMotion ? 'instant' : 'smooth',
    })
    pendingTimeout.current = window.setTimeout(() => {
      pendingIndex.current = null
      pendingTimeout.current = null
      const progress = scrollYProgress.get()
      updateSelectedIndex(getProjectIndex(progress, projects.length))
    }, 2000)
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const focusedIndex = tabs.current.findIndex((tab) => tab === event.currentTarget)
    const currentIndex = focusedIndex >= 0 ? focusedIndex : selectedIndex
    let nextIndex = currentIndex
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % projects.length
    else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + projects.length) % projects.length
    } else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = projects.length - 1
    else return

    event.preventDefault()
    selectProject(nextIndex)
    tabs.current[nextIndex]?.focus()
  }

  if (!project) return null

  return (
    <section
      ref={sectionRef}
      id={id}
      className="projects-section"
      aria-labelledby={`${uid}-title`}
    >
      <div className="projects-shell">
        <header className="projects-header">
          <h2 id={`${uid}-title`} className="projects-title">
            Projects
          </h2>
        </header>

        <div className="projects-tabs" role="tablist" aria-label="Featured projects">
          {projects.map((item, index) => {
            const selected = index === selectedIndex
            return (
              <button
                key={item.id}
                ref={(element) => {
                  tabs.current[index] = element
                }}
                id={`${uid}-tab-${item.id}`}
                className="projects-tab"
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectProject(index)}
                onKeyDown={handleTabKeyDown}
              >
                <span className="projects-tab-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item.name === 'Continuous Behavioral Biometric Authentication'
                  ? 'Behavioral Biometrics'
                  : item.name}</span>
              </button>
            )
          })}
        </div>

        <article
          id={panelId}
          className="projects-panel"
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${project.id}`}
          tabIndex={0}
        >
          <motion.div
            className="projects-visual"
            role="img"
            aria-label={project.visualDescription}
            style={{
              opacity: reducedMotion ? 1 : projectContentOpacity,
              x: reducedMotion ? 0 : projectVisualX,
            }}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={project.id}
                className="projects-visual-content"
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.55, ease: 'easeOut' }}
              >
                {project.visual}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="projects-info-viewport"
            style={{
              opacity: reducedMotion ? 1 : projectContentOpacity,
              x: reducedMotion ? 0 : projectInfoX,
            }}
          >
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={project.id}
                className="projects-info"
                custom={direction}
                variants={{
                  enter: (travelDirection: number) => ({
                        opacity: 0,
                        y: travelDirection > 0 ? 56 : -56,
                        scale: 0.985,
                  }),
                  center: { opacity: 1, y: 0, scale: 1 },
                  exit: (travelDirection: number) => ({
                        opacity: 0,
                        y: travelDirection > 0 ? -56 : 56,
                        scale: 0.99,
                  }),
                }}
                initial={reducedMotion ? false : 'enter'}
                animate="center"
                exit="exit"
                transition={{ duration: reducedMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="projects-meta">
                  <span>{project.category}</span>
                  {project.year && (
                    <>
                      <span aria-hidden="true">/</span>
                      <span>{project.year}</span>
                    </>
                  )}
                </div>
                <h3 className="projects-name">{project.name}</h3>
                <p className="projects-summary">{project.summary}</p>

                <ul className="projects-technologies" aria-label="Technologies">
                  {project.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>

                <div className="projects-outcome">
                  <span className="projects-outcome-label">
                    Technical contribution
                  </span>
                  <p>{project.outcome}</p>
                </div>

                <div className="projects-actions">
                  <nav className="projects-link-bars" aria-label="Project links">
                    {[
                      {
                        label: 'Live project',
                        url: project.liveDemoUrl,
                        placeholder: 'Add live project URL',
                      },
                      {
                        label: 'GitHub repo',
                        url: project.githubUrl,
                        placeholder: 'Add repository URL',
                      },
                    ].map(({ label, url, placeholder }) =>
                      url ? (
                        <a
                          key={label}
                          className="projects-link-bar"
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>{label}</span>
                        </a>
                      ) : (
                        <button
                          key={label}
                          className="projects-link-bar is-unconfigured"
                          type="button"
                          disabled
                          aria-label={`${label}: ${placeholder}`}
                        >
                          <span>{label}</span>
                          <small>{placeholder}</small>
                        </button>
                      ),
                    )}
                  </nav>
                  <button
                    className="projects-case-action"
                    type="button"
                    onClick={() => onOpenProject(project)}
                  >
                    Read technical notes
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </article>
      </div>
    </section>
  )
}

export default FeaturedProjectHero
