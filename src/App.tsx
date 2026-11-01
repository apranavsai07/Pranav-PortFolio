import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionStyle,
} from 'framer-motion'
import WavingPortfolioLanding from '@/components/ui/waving-portfolio-landing'
import {
  ContainerScroll,
  useContainerScrollProgress,
} from '@/components/ui/container-scroll-animation'
import AboutSection from '@/components/about-section'
import PortfolioNav from '@/components/portfolio-nav'
import ProjectsSection from '@/components/projects-section'
import CertificationShowcase from '@/components/ui/certification-showcase'
import BeyondCodeSection from '@/components/ui/beyond-code-section'
import ContactSection from '@/components/ui/contact-section'
import { certifications } from '@/data/certifications'

function App() {
  const transitionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const characterLayerRef = useRef<SVGSVGElement>(null)
  const aboutSectionRef = useRef<HTMLElement>(null)
  const projectsSectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const reducedMotion = prefersReducedMotion === true
  const scrollYProgress = useContainerScrollProgress(transitionRef)
  const { scrollYProgress: aboutProjectsProgress } = useScroll({
    target: aboutSectionRef,
    offset: ['start start', 'end end'],
  })

  const greetingBubbleOpacity = useTransform(
    scrollYProgress,
    [0, 0.12],
    [1, 0],
  )
  const navigationColor = useTransform(scrollYProgress, () => '#141414')
  const navigationSurface = useTransform(scrollYProgress, () => '#f6f4f0')
  const heroArtworkOpacity = useTransform(
    scrollYProgress,
    [0, 0.56, 0.8, 1],
    [1, 1, 0, 0],
  )
  const heroSceneY = useTransform(scrollYProgress, [0, 1], ['0%', '-100%'])
  const backgroundProgress = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '150%'],
  )
  const characterOpacity = useTransform(
    aboutProjectsProgress,
    [0.86, 1],
    [1, 0],
  )
  const aboutExitOpacityRaw = useTransform(
    aboutProjectsProgress,
    [0.84, 1],
    [1, 0],
  )
  const aboutExitHeadingXRaw = useTransform(
    aboutProjectsProgress,
    [0.84, 1],
    [0, -88],
  )
  const aboutExitCopyYRaw = useTransform(
    aboutProjectsProgress,
    [0.84, 1],
    [0, 88],
  )
  const aboutHeadingOpacityRaw = useTransform(
    scrollYProgress,
    [0.7, 0.93],
    [0, 1],
  )
  const aboutHeadingXRaw = useTransform(
    scrollYProgress,
    [0.7, 1],
    [-72, 0],
  )
  const aboutCopyOpacityRaw = useTransform(
    scrollYProgress,
    [0.76, 1],
    [0, 1],
  )
  const aboutCopyYRaw = useTransform(
    scrollYProgress,
    [0.79, 1],
    [72, 0],
  )
  const aboutHeadingXCombined = useTransform(
    () =>
      reducedMotion
        ? 0
        : aboutHeadingXRaw.get() + aboutExitHeadingXRaw.get(),
  )
  const aboutCopyYCombined = useTransform(
    () => (reducedMotion ? 0 : aboutCopyYRaw.get() + aboutExitCopyYRaw.get()),
  )
  const aboutHeadingOpacityCombined = useTransform(
    () =>
      aboutHeadingOpacityRaw.get() *
      (reducedMotion ? 1 : aboutExitOpacityRaw.get()),
  )
  const aboutCopyOpacityCombined = useTransform(
    () =>
      aboutCopyOpacityRaw.get() *
      (reducedMotion ? 1 : aboutExitOpacityRaw.get()),
  )
  const certificationsContentOpacity = 1
  const certificationsContentY = 0

  useLayoutEffect(() => {
    const navigation = performance.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming | undefined
    if (navigation?.type !== 'reload') return

    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}`,
    )
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const setCharacterOffset = useCallback(
    (progress: number) => {
      const scene = sceneRef.current
      const characterLayer = characterLayerRef.current
      const poster = scene?.querySelector<SVGSVGElement>('.wpl-poster')
      const character = characterLayer?.querySelector<SVGSVGElement>(
        '.wpl-par-char > svg',
      )
      if (!scene || !poster || !characterLayer || !character) return

      const posterBounds = poster.getBoundingClientRect()
      const sceneBounds = scene.getBoundingClientRect()
      const stageBounds = scene.parentElement?.getBoundingClientRect()
      const characterBounds = character.getBoundingClientRect()
      if (!stageBounds || !characterBounds.width || !characterBounds.height) return

      const movement = reducedMotion
        ? 0
        : Math.max(0, Math.min(1, progress))
      const easedMovement = movement * movement * (3 - 2 * movement)
      const characterShift =
        window.innerWidth <= 700
          ? window.innerWidth * 0.1375
          : Math.min(295, window.innerWidth * 0.184375)
      const characterDrop =
        window.innerWidth <= 700 ? 0 : Math.min(140, window.innerHeight * 0.14)
      characterLayer.style.left = `${posterBounds.left - characterShift * easedMovement}px`
      characterLayer.style.top = `${Math.max(0, stageBounds.top) + posterBounds.top - sceneBounds.top + characterDrop * easedMovement}px`
      characterLayer.style.width = `${posterBounds.width}px`
      characterLayer.style.height = `${posterBounds.height}px`
    },
    [reducedMotion],
  )

  useMotionValueEvent(scrollYProgress, 'change', setCharacterOffset)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => setCharacterOffset(scrollYProgress.get()))
    }

    measure()
    window.addEventListener('resize', measure)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
    }
  }, [scrollYProgress, setCharacterOffset])

  return (
    <main>
      <ContainerScroll
        id="transition"
        containerRef={transitionRef}
        reducedMotion={reducedMotion}
      >
          <motion.div
            ref={sceneRef}
            className="absolute inset-0"
            style={{
              y: reducedMotion ? 0 : heroSceneY,
              '--wpl-background-progress': reducedMotion ? '0%' : backgroundProgress,
              '--wpl-poster-opacity': 1,
            } as MotionStyle}
          >
            <WavingPortfolioLanding
              name="Pranav"
              year="2026"
              roles={['Software Engineer', 'AI/ML']}
              characterLayerRef={characterLayerRef}
              characterOpacity={reducedMotion ? 1 : characterOpacity}
              bubbleOpacity={reducedMotion ? 1 : greetingBubbleOpacity}
            />
          </motion.div>
      </ContainerScroll>
      <PortfolioNav
        color={navigationColor}
        surface={navigationSurface}
        cornerOpacity={reducedMotion ? 1 : heroArtworkOpacity}
      />
      <AboutSection
        id="about"
        sectionRef={aboutSectionRef}
        headingOpacity={reducedMotion ? 1 : aboutHeadingOpacityCombined}
        headingX={reducedMotion ? 0 : aboutHeadingXCombined}
        copyOpacity={reducedMotion ? 1 : aboutCopyOpacityCombined}
        copyY={reducedMotion ? 0 : aboutCopyYCombined}
        contentScale={1}
      />
      <div className="projects-certifications-stage" data-reduced-motion={reducedMotion}>
        <ProjectsSection
          sectionRef={projectsSectionRef}
        />
        <CertificationShowcase
          certifications={certifications}
          contentOpacity={certificationsContentOpacity}
          contentY={certificationsContentY}
        />
      </div>
      <BeyondCodeSection />
      <ContactSection />
    </main>
  )
}

export default App
