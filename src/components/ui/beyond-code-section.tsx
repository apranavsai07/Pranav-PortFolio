import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'

type EventEntry = {
  title: string
  description: string
}

type Milestone = {
  number: string
  category: string
  subtitle: string
  visualTitle: string
  imagePaths: readonly string[]
  imageLabels: readonly string[]
  entries: readonly EventEntry[]
}

const milestones: readonly Milestone[] = [
  {
    number: '01',
    category: 'Leadership & Community Impact',
    subtitle: 'DevCatalyst — Vice President · 2026',
    visualTitle: 'DevCatalyst activities',
    imagePaths: ['/Leadership/l2.jpg', '/Leadership/L3.jpeg'],
    imageLabels: ['DevCatalyst team collaborating', 'DevCatalyst community event'],
    entries: [
      {
        title: 'Appointed Vice President — DevCatalyst (2026)',
        description:
          "Appointed Vice President of DevCatalyst, taking on a leadership role in planning initiatives, coordinating teams, and driving the club's technical activities.",
      },
      {
        title: 'Smart India Hackathon (SIH)',
        description:
          "Helped organize the internal hackathon, coordinating 100 teams across 7 evaluation panels and managing the event's execution.",
      },
      {
        title: 'AWS Community Day',
        description:
          'Led the organization of AWS Community Day, bringing together students and the cloud community through a large-scale technical event.',
      },
    ],
  },
  {
    number: '02',
    category: 'Hosting & Stage Engagement',
    subtitle: 'Event Hosting · Student Engagement',
    visualTitle: 'Hosting moments',
    imagePaths: ['/Hosting/H1.jpeg', '/Hosting/H2.jpeg'],
    imageLabels: ['Hosting an event on stage', 'Hosting at the podium'],
    entries: [
      {
        title: 'Freshgradprep — Career Awareness Event',
        description:
          'Hosted an event focused on helping students understand the job market, industry expectations, and the transition from college to professional careers.',
      },
      {
        title: 'AISEC Hackathon',
        description:
          'Hosted the AISEC Hackathon, guiding the event proceedings, engaging participants, and helping maintain a smooth experience throughout the event.',
      },
    ],
  },
  {
    number: '03',
    category: 'Event Management & Technical Contributions',
    subtitle: 'Event Operations · Technical Execution',
    visualTitle: 'Events in motion',
    imagePaths: [
      '/Events/WhatsApp%20Image%202026-11-01%20at%206.24.30%20PM.jpeg',
      '/Events/E2.jpeg',
      '/Events/E3.jpeg',
    ],
    imageLabels: [
      'Event presentation with students',
      'Students attending a technical event',
      'AWS community event group photo',
    ],
    entries: [
      {
        title: 'Event Operations & Logistics',
        description:
          'Coordinated event planning and on-ground logistics, handling arrangements and execution to ensure activities ran smoothly.',
      },
      {
        title: 'Catalyst Days 2026 — Logo Guesser',
        description:
          'Developed Logo Guesser, an interactive tech game for Catalyst Days 2026, contributing a hands-on activity to the event experience.',
      },
      {
        title: 'Beacon Technologies Hackathon — IIT Hyderabad',
        description:
          'Helped organize the hackathon in collaboration with Beacon Technologies at IIT Hyderabad, contributing to the coordination and execution of the event.',
      },
    ],
  },
  {
    number: '04',
    category: 'Technical Experience',
    subtitle: '6-Week Internship · 1 May – 15 June 2026',
    visualTitle: 'Blackbucks Education',
    imagePaths: ['/certificates/Blackbucks%20Education%20Internship.png'],
    imageLabels: ['Blackbucks Education internship certificate'],
    entries: [
      {
        title: 'Blackbucks Education — Generative AI Engineer Intern',
        description:
          'Completed a six-week internship focused on Generative AI through structured training, hands-on assignments, and project-based learning.',
      },
      {
        title: 'Technical Training',
        description: 'Gained practical exposure to Generative AI concepts.',
      },
      {
        title: 'Hands-on Learning',
        description:
          'Applied concepts through assignments and project-based activities.',
      },
    ],
  },
]

type RouteSize = {
  width: number
  height: number
  path: string
  markerY: number[]
}

function MilestoneVisual({
  milestone,
}: {
  milestone: Milestone
}) {
  return (
    <figure
      className={`beyond-visual beyond-visual--${milestone.number}${milestone.number === '04' ? ' beyond-visual--credential' : ''}`}
      aria-label={milestone.visualTitle}
    >
      <div className={`beyond-gallery beyond-gallery--${milestone.imagePaths.length}`}>
        {milestone.imagePaths.map((imagePath, imageIndex) => (
          <img
            key={imagePath}
            src={imagePath}
            alt={milestone.imageLabels[imageIndex]}
            loading="lazy"
          />
        ))}
      </div>
      <figcaption className="beyond-visual-caption">
        <strong>{milestone.visualTitle}</strong>
        <span>{milestone.category}</span>
      </figcaption>
    </figure>
  )
}

function MilestoneRow({
  milestone,
  index,
  registerMarker,
  reducedMotion,
}: {
  milestone: Milestone
  index: number
  registerMarker: (index: number, element: HTMLSpanElement | null) => void
  reducedMotion: boolean
}) {
  const rowRef = useRef<HTMLElement>(null)
  const isInView = useInView(rowRef, {
    amount: 0.15,
    margin: '0px 0px -10% 0px',
  })
  const visible = reducedMotion || isInView
  const contentSide = index % 2 === 0 ? 'left' : 'right'

  return (
    <article
      ref={rowRef}
      className={`beyond-milestone${index % 2 === 1 ? ' beyond-milestone--reverse' : ''}`}
      data-active={visible}
      aria-labelledby={`beyond-category-${milestone.number}`}
    >
      <span
        ref={(element) => registerMarker(index, element)}
        className={`beyond-route-marker beyond-route-marker--${contentSide}`}
        data-active={visible}
        aria-hidden="true"
      />
      <motion.div
        className="beyond-category"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.45 }}
      >
        <span className="beyond-category-number-mask">
          <motion.span
            className="beyond-category-number"
            initial={reducedMotion ? false : { y: 18, opacity: 0 }}
            animate={visible ? { y: 0, opacity: 1 } : { y: 18, opacity: 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {milestone.number}
          </motion.span>
        </span>
        <span className="beyond-category-title-mask">
          <motion.h3
            id={`beyond-category-${milestone.number}`}
            initial={reducedMotion ? false : { y: '110%' }}
            animate={visible ? { y: '0%' } : { y: '110%' }}
            transition={{
              duration: reducedMotion ? 0 : 0.72,
              delay: reducedMotion ? 0 : 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {milestone.category}
          </motion.h3>
        </span>
        <motion.p
          className="beyond-category-subtitle"
          initial={
            reducedMotion
              ? false
              : { opacity: 0, x: index % 2 === 0 ? 20 : -20 }
          }
          animate={
            visible
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: index % 2 === 0 ? 20 : -20 }
          }
          transition={{
            duration: reducedMotion ? 0 : 0.5,
            delay: reducedMotion ? 0 : 0.18,
          }}
        >
          {milestone.subtitle}
        </motion.p>
      </motion.div>

      <motion.div
        className="beyond-events"
        initial={
          reducedMotion
            ? false
            : { opacity: 0, x: contentSide === 'left' ? -28 : 28 }
        }
        animate={
          visible
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: contentSide === 'left' ? -28 : 28 }
        }
        transition={{
          duration: reducedMotion ? 0 : 0.65,
          delay: reducedMotion ? 0 : 0.12,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <MilestoneVisual milestone={milestone} />
        <ol className="beyond-event-list">
          {milestone.entries.map((entry) => (
            <li className="beyond-event" key={entry.title}>
              <h4>{entry.title}</h4>
              <p>{entry.description}</p>
            </li>
          ))}
        </ol>
      </motion.div>
    </article>
  )
}

export default function BeyondCodeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const markerRefs = useRef<Array<HTMLSpanElement | null>>([])
  const routePathRef = useRef<SVGPathElement>(null)
  const [routeSize, setRouteSize] = useState<RouteSize>({
    width: 1,
    height: 1,
    path: '',
    markerY: [],
  })
  const [routeStops, setRouteStops] = useState<number[]>([])
  const prefersReducedMotion = useReducedMotion()
  const reducedMotion = prefersReducedMotion === true
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  })
  const markerProgress = useMemo(
    () =>
      routeSize.markerY.map(
        (markerY) => markerY / Math.max(1, routeSize.height),
      ),
    [routeSize.height, routeSize.markerY],
  )
  const routeInputRange = useMemo(
    () => [0, ...markerProgress, 1],
    [markerProgress],
  )
  const routeOutputRange = useMemo(
    () => [1, ...routeStops.map((stop) => 1 - stop), 0],
    [routeStops],
  )
  const routeOffset = useTransform(
    scrollYProgress,
    routeInputRange,
    routeOutputRange,
  )
  const registerMarker = useCallback(
    (index: number, element: HTMLSpanElement | null) => {
      markerRefs.current[index] = element
    },
    [],
  )

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let frame = 0
    const measure = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const bounds = section.getBoundingClientRect()
        const points = markerRefs.current.map((marker) => {
          if (!marker) return null
          const markerBounds = marker.getBoundingClientRect()
          return {
            x: markerBounds.left + markerBounds.width / 2 - bounds.left,
            y: markerBounds.top + markerBounds.height / 2 - bounds.top,
          }
        })

        if (points.some((point) => point === null)) return

        const measuredPoints = points.filter(
          (point): point is { x: number; y: number } => point !== null,
        )
        if (measuredPoints.length !== milestones.length) return

        const path = measuredPoints.reduce((commands, point, index) => {
          if (index === 0) return `M ${point.x} ${point.y}`
          const previous = measuredPoints[index - 1]
          const deltaY = point.y - previous.y
          const firstControlY = previous.y + deltaY * 0.42
          const secondControlY = previous.y + deltaY * 0.58
          return `${commands} C ${previous.x} ${firstControlY}, ${point.x} ${secondControlY}, ${point.x} ${point.y}`
        }, '')

        setRouteSize({
          width: Math.max(1, bounds.width),
          height: Math.max(1, bounds.height),
          path,
          markerY: measuredPoints.map((point) => point.y),
        })
      })
    }

    const observer = new ResizeObserver(measure)
    observer.observe(section)
    markerRefs.current.forEach((marker) => {
      if (marker) observer.observe(marker)
    })
    window.addEventListener('resize', measure)
    measure()

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  useEffect(() => {
    const path = routePathRef.current
    if (!path || routeSize.markerY.length !== milestones.length) return

    const totalLength = path.getTotalLength()
    let previousLength = 0
    const stops = routeSize.markerY.map((targetY) => {
      let low = previousLength
      let high = totalLength

      for (let iteration = 0; iteration < 24; iteration += 1) {
        const middle = (low + high) / 2
        if (path.getPointAtLength(middle).y < targetY) {
          low = middle
        } else {
          high = middle
        }
      }

      previousLength = (low + high) / 2
      return previousLength / totalLength
    })

    setRouteStops(stops)
  }, [routeSize.markerY, routeSize.path])

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="beyond-section"
      aria-labelledby="beyond-title"
    >
      <svg
        className="beyond-route"
        viewBox={`0 0 ${routeSize.width} ${routeSize.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          ref={routePathRef}
          className="beyond-route-draw"
          d={routeSize.path}
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={reducedMotion ? 0 : routeOffset}
        />
      </svg>

      <div className="beyond-shell">
        <header className="beyond-header">
          <motion.h2
            id="beyond-title"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{
              duration: reducedMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            BEYOND CODE.
          </motion.h2>
          <p>
            A journey through leadership, hosting, event operations and
            technical experience.
          </p>
        </header>

        <div className="beyond-journey">
          {milestones.map((milestone, index) => (
            <MilestoneRow
              key={milestone.number}
              milestone={milestone}
              index={index}
              registerMarker={registerMarker}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
