import { motion, type MotionValue } from 'framer-motion'
import type { RefObject } from 'react'

const introduction =
  "I’m a final-year Computer Science student in Hyderabad, building intelligent systems through AI/ML and full-stack development. I like taking ideas from concept to implementation, from machine learning pipelines and agentic AI workflows to the APIs and interfaces behind them. My work includes a behavioural biometric authentication system and an AI-powered platform for automated data analysis. I’m also the Vice President of DevCatalyst Tech Club, leading technical initiatives, workshops, and large-scale events. Away from the screen, I play cricket and I’m a big Dhoni fan. The game taught me to control my emotions in tough situations, back myself, and decide under pressure, and I draw on those moments in how I approach my academics, projects, and leadership."
type AboutSectionProps = {
  id: string
  sectionRef: RefObject<HTMLElement | null>
  headingOpacity: MotionValue<number> | number
  headingX: MotionValue<number> | number
  copyOpacity: MotionValue<number> | number
  copyY: MotionValue<number> | number
  contentScale: MotionValue<number> | number
}

function AboutSection({
  id,
  sectionRef,
  headingOpacity,
  headingX,
  copyOpacity,
  copyY,
  contentScale,
}: AboutSectionProps) {
  return (
    <motion.section
      ref={sectionRef}
      id={id}
      className="about-scene"
      aria-labelledby={`${id}-heading`}
    >
      <motion.div
        className="about-layout"
        style={{ scale: contentScale }}
      >
        <motion.header
          className="about-heading-block"
          style={{ opacity: headingOpacity, x: headingX }}
        >
          <h2 id={`${id}-heading`} className="about-heading">
            <span className="about-heading-filled">ABOUT</span>
            {' '}
            <span className="about-heading-outline">ME</span>
          </h2>
        </motion.header>

        <motion.article
          className="about-copy-block"
          style={{ opacity: copyOpacity, y: copyY }}
        >
          <div className="about-copy-card-top">
            <span>01 / ABOUT</span>
            <span>PRANAV · AI / ENGINEERING</span>
          </div>
          <span className="about-copy-rule" aria-hidden="true" />
          <p className="about-copy">{introduction}</p>
        </motion.article>
      </motion.div>
    </motion.section>
  )
}

export default AboutSection
