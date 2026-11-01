import {
  motion,
  useScroll,
  type MotionValue,
} from 'framer-motion'
import type { ReactNode, RefObject } from 'react'

type ContainerScrollProps = {
  id: string
  containerRef: RefObject<HTMLElement | null>
  reducedMotion: boolean
  children: ReactNode
}

export function useContainerScrollProgress(
  containerRef: RefObject<HTMLElement | null>,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return scrollYProgress
}

export function ContainerScroll({
  id,
  containerRef,
  reducedMotion,
  children,
}: ContainerScrollProps) {
  return (
    <section
      id={id}
      ref={containerRef}
      className="relative"
      data-reduced-motion={reducedMotion}
      style={{ height: reducedMotion ? '100svh' : '200svh' }}
    >
      <motion.div
        className={
          reducedMotion
            ? 'hero-transition-stage h-[100svh] overflow-hidden'
            : 'hero-transition-stage sticky top-0 h-[100svh] overflow-hidden'
        }
      >
        {children}
      </motion.div>
    </section>
  )
}
