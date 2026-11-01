import { useEffect, useState } from 'react'
import {
  ArrowUp,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  CodeXml,
  Copy,
} from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { portfolioSections } from '@/data/portfolio-sections'
import { PortfolioCharacterArt } from '@/components/ui/waving-portfolio-landing'

const EMAIL = 'apranavsai07@gmail.com'
const LINKEDIN_URL =
  'https://www.linkedin.com/in/pranav-sai-sreekanta-ajjarapu-89236032a/'
const GITHUB_URL = 'https://github.com/apranavsai07'

const socialProfiles = [
  {
    name: 'LinkedIn',
    href: LINKEDIN_URL,
    Icon: BriefcaseBusiness,
    target: '_blank',
  },
  {
    name: 'GitHub',
    href: GITHUB_URL,
    Icon: CodeXml,
    target: '_blank',
  },
] as const

function ContactFooter() {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }

  return (
    <footer className="contact-footer">
      <a
        className="contact-footer-mark"
        href="#transition"
        aria-label="Pranav, back to top"
      >
        PRANAV<span>.</span>
      </a>
      <nav className="contact-footer-nav" aria-label="Footer navigation">
        {portfolioSections.map(([label, section]) => (
          <a key={section} href={`#${section}`}>
            {label}
          </a>
        ))}
      </nav>
      <div className="contact-footer-socials">
        {socialProfiles.map(({ name, href, Icon, target }) => (
          <a
            key={name}
            href={href}
            target={target}
            rel="noopener noreferrer"
            aria-label={`${name} profile`}
          >
            <Icon aria-hidden="true" size={17} strokeWidth={1.7} />
          </a>
        ))}
      </div>
      <span className="contact-copyright">© 2026 Pranav</span>
      <button
        className="contact-back-to-top"
        type="button"
        onClick={handleBackToTop}
      >
        Back to top <ArrowUp aria-hidden="true" size={15} />
      </button>
    </footer>
  )
}

export default function ContactSection() {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'unavailable'>(
    'idle',
  )
  const reducedMotion = useReducedMotion() === true

  useEffect(() => {
    if (copyStatus === 'idle') return
    const timeout = window.setTimeout(() => setCopyStatus('idle'), 1800)
    return () => window.clearTimeout(timeout)
  }, [copyStatus])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('unavailable')
    }
  }

  return (
    <section
      id="contact"
      className="contact-section"
      aria-labelledby="contact-title"
    >
      <div className="contact-shell">
        <motion.header
          className="contact-header"
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: reducedMotion ? 0 : 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="contact-eyebrow">GET IN TOUCH</p>
          <h2 id="contact-title">
            LET&apos;S CONNECT &amp;
            <span>BUILD SOMETHING MEANINGFUL.</span>
          </h2>
          <p className="contact-intro">
            I&apos;m a fourth-year Computer Science student exploring the
            intersection of AI/ML, Web Development, and Python. I&apos;m
            currently open to internship opportunities, entry-level roles,
            collaborations, and opportunities to learn, contribute, and grow.
          </p>
        </motion.header>

        <div className="contact-content">
          <motion.div
            className="contact-details"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: reducedMotion ? 0 : 0.55,
              delay: reducedMotion ? 0 : 0.08,
            }}
          >
            <div className="contact-availability">
              <span className="contact-availability-dot" aria-hidden="true" />
              <div>
                <p className="contact-overline">OPEN TO OPPORTUNITIES</p>
                <p className="contact-availability-copy">
                  Internships · Entry-Level Roles · Collaborations · Learning
                  Opportunities
                </p>
              </div>
            </div>
            <div className="contact-interest">
              <span className="contact-overline">AREAS OF INTEREST</span>
              <ul aria-label="Areas of interest">
                <li>AI/ML</li>
                <li>Web Development</li>
                <li>Python</li>
                <li>Software Engineer</li>
              </ul>
            </div>
            <div className="contact-actions">
              <a className="contact-talk-link" href={`mailto:${EMAIL}`}>
                LET&apos;S TALK <ArrowUpRight aria-hidden="true" size={20} />
              </a>
              <span className="contact-copy-status" aria-live="polite">
                {copyStatus === 'copied'
                  ? 'Copied!'
                  : copyStatus === 'unavailable'
                    ? 'Copy unavailable'
                    : ''}
              </span>
              <button
                className="contact-copy-email"
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
              >
                {copyStatus === 'copied' ? (
                  <Check aria-hidden="true" size={17} />
                ) : (
                  <Copy aria-hidden="true" size={17} />
                )}
              </button>
            </div>
            <div className="contact-links">
              {socialProfiles.map(({ name, href, Icon, target }) => (
                <a
                  key={name}
                  className="contact-profile-link"
                  href={href}
                  target={target}
                  rel="noopener noreferrer"
                >
                  <Icon aria-hidden="true" size={18} strokeWidth={1.7} />
                  <span>{name}</span>
                  <ArrowUpRight aria-hidden="true" size={15} />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="contact-character-column"
            initial={reducedMotion ? false : { opacity: 0, x: '35%' }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: reducedMotion ? 0 : 0.75,
              delay: reducedMotion ? 0 : 0.12,
            }}
          >
            <div className="contact-character-stage">
              <PortfolioCharacterArt />
            </div>
          </motion.div>
        </div>

        <ContactFooter />
      </div>
    </section>
  )
}
