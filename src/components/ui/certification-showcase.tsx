import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { Award } from 'lucide-react'
import type { Certification } from '@/data/certifications'

function CertificationListItem({
  index,
  scrollYProgress,
  reducedMotion,
  children,
}: {
  index: number
  scrollYProgress: MotionValue<number>
  reducedMotion: boolean
  children: ReactNode
}) {
  const start = 0.02 + index * 0.14
  const end = start + 0.24
  const opacity = useTransform(scrollYProgress, [start, end], [0.12, 1])
  const x = useTransform(
    scrollYProgress,
    [start, end],
    [index % 2 === 0 ? -128 : 128, 0],
  )
  const y = useTransform(scrollYProgress, [start, end], [14, 0])
  const scale = useTransform(scrollYProgress, [start, end], [0.96, 1])

  return (
    <motion.li
      className="certification-list-item"
      style={{
        opacity: reducedMotion ? 1 : opacity,
        x: reducedMotion ? 0 : x,
        y: reducedMotion ? 0 : y,
        scale: reducedMotion ? 1 : scale,
      }}
    >
      {children}
    </motion.li>
  )
}

type CertificationShowcaseProps = {
  certifications: readonly Certification[]
  contentOpacity: MotionValue<number> | number
  contentY: MotionValue<number> | number
  id?: string
}

function CertificatePreview({
  certification,
  index,
  compact = false,
}: {
  certification: Certification
  index: number
  compact?: boolean
}) {
  const [imageStatus, setImageStatus] = useState<
    'loading' | 'loaded' | 'error'
  >('loading')
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const image = imageRef.current
    if (!image?.complete) return
    setImageStatus(image.naturalWidth > 0 ? 'loaded' : 'error')
  }, [certification.imagePath])

  return (
    <div
      className={`certification-preview-card${compact ? ' is-compact' : ''}${certification.imageOrientation === 'portrait' ? ' is-portrait' : ''}`}
      aria-label={`Certificate preview: ${certification.name}`}
    >
      <div className="certification-preview-image">
        <div className="certification-preview-frame" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div
          className={`certification-image-placeholder${imageStatus === 'loaded' ? ' is-hidden' : ''}`}
          aria-hidden={imageStatus === 'loaded'}
        >
          <Award aria-hidden="true" strokeWidth={1.2} />
          <span className="certification-placeholder-index">
            CREDENTIAL / {String(index).padStart(2, '0')}
          </span>
          <strong>{certification.name}</strong>
          <span>
            {imageStatus === 'error'
              ? 'CERTIFICATE IMAGE UNAVAILABLE'
              : 'LOADING CERTIFICATE'}
          </span>
        </div>
        <img
          ref={imageRef}
          src={certification.imagePath}
          alt={`${certification.name} certificate`}
          className={imageStatus === 'loaded' ? 'is-loaded' : ''}
          loading="eager"
          decoding="async"
          fetchPriority={index === 1 ? 'high' : 'auto'}
          onLoad={() => setImageStatus('loaded')}
          onError={() => setImageStatus('error')}
        />
      </div>
      <div className="certification-preview-caption">
        <span>{certification.issuer}</span>
        <span aria-hidden="true">/</span>
        <span>{certification.date ?? 'Credential preview'}</span>
      </div>
    </div>
  )
}

export function CertificationShowcase({
  certifications,
  contentOpacity,
  contentY,
  id = 'certifications',
}: CertificationShowcaseProps) {
  const selectedCertification = certifications[0]
  const [selectedId, setSelectedId] = useState(selectedCertification?.id ?? '')
  const [finePointer, setFinePointer] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const animationFrame = useRef(0)
  const preloadedImages = useRef(new Map<string, HTMLImageElement>())
  const prefersReducedMotion = useReducedMotion()
  const reducedMotion = prefersReducedMotion === true
  const activeCertification =
    certifications.find((certification) => certification.id === selectedId) ??
    selectedCertification
  const activeIndex =
    certifications.findIndex(
      (certification) => certification.id === activeCertification?.id,
    ) + 1
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    const pointerQuery = window.matchMedia(
      '(min-width: 761px) and (hover: hover) and (pointer: fine)',
    )
    const updatePointerType = () => setFinePointer(pointerQuery.matches)
    updatePointerType()
    pointerQuery.addEventListener('change', updatePointerType)
    return () => pointerQuery.removeEventListener('change', updatePointerType)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const preloadCertificates = () => {
      certifications.forEach(({ imagePath }) => {
        if (preloadedImages.current.has(imagePath)) return

        const image = new Image()
        image.decoding = 'async'
        image.src = imagePath
        preloadedImages.current.set(imagePath, image)
      })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        preloadCertificates()
        observer.disconnect()
      },
      { rootMargin: '1200px 0px' },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [certifications])

  useEffect(
    () => () => {
      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current)
      }
    },
    [],
  )

  const updatePreviewPosition = (x: number, y: number) => {
    if (animationFrame.current) return

    animationFrame.current = window.requestAnimationFrame(() => {
      animationFrame.current = 0
      const preview = previewRef.current
      if (!preview) return

      const bounds = preview.getBoundingClientRect()
      const gap = 22
      const left =
        x + bounds.width + gap <= window.innerWidth - 12
          ? x + gap
          : x - bounds.width - gap
      const maxTop = Math.max(12, window.innerHeight - bounds.height - 12)
      const top = Math.min(Math.max(12, y + gap), maxTop)
      preview.style.transform = `translate3d(${Math.max(12, left)}px, ${top}px, 0)`
    })
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!finePointer || event.pointerType === 'touch') return
    updatePreviewPosition(event.clientX, event.clientY)
  }

  const selectCertification = (certification: Certification) => {
    setSelectedId(certification.id)
  }

  const showPreviewForFocus = (
    certification: Certification,
    element: HTMLButtonElement,
  ) => {
    selectCertification(certification)
    if (!finePointer) return
    const bounds = element.getBoundingClientRect()
    updatePreviewPosition(bounds.right, bounds.top + bounds.height / 2)
    setPreviewVisible(true)
  }

  if (!activeCertification) return null

  return (
    <section
      ref={sectionRef}
      id={id}
      className="certifications-section"
      data-reduced-motion={reducedMotion}
      aria-labelledby={`${id}-heading`}
    >
      <motion.div
        className="certifications-shell"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <header className="certifications-header">
          <h2
            id={`${id}-heading`}
            className="certifications-title"
          >
            Certifications
          </h2>
          <p className="certifications-intro">
            Selected credentials and learning experiences across artificial
            intelligence, machine learning, and cloud engineering.
          </p>
        </header>

        <div
          className="certifications-content"
          onPointerMove={handlePointerMove}
          onPointerEnter={(event) => {
            if (finePointer && event.pointerType !== 'touch') {
              setPreviewVisible(true)
            }
          }}
          onPointerLeave={(event) => {
            if (event.pointerType !== 'touch') setPreviewVisible(false)
          }}
          onBlur={(event) => {
            if (
              !(event.relatedTarget instanceof Node) ||
              !event.currentTarget.contains(event.relatedTarget)
            ) {
              setPreviewVisible(false)
            }
          }}
        >
          <ol className="certification-list">
            {certifications.map((certification, index) => {
              const selected = certification.id === activeCertification.id
              return (
                <CertificationListItem
                  key={certification.id}
                  index={index}
                  scrollYProgress={scrollYProgress}
                  reducedMotion={reducedMotion || !finePointer}
                >
                  <div
                    className={`certification-row${selected ? ' is-selected' : ''}`}
                    onPointerEnter={(event) => {
                      if (event.pointerType === 'touch') return
                      selectCertification(certification)
                      setPreviewVisible(finePointer)
                    }}
                  >
                    <button
                      className="certification-select"
                      type="button"
                      aria-pressed={selected}
                      onFocus={(event) =>
                        showPreviewForFocus(certification, event.currentTarget)
                      }
                      onClick={() => selectCertification(certification)}
                    >
                      <span className="certification-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="certification-row-copy">
                        <span className="certification-name">
                          {certification.name}
                        </span>
                        <span className="certification-issuer">
                          {certification.issuer}
                          {certification.date && (
                            <>
                              <span aria-hidden="true"> · </span>
                              {certification.date}
                            </>
                          )}
                        </span>
                      </span>
                    </button>
                    {certification.verificationUrl && (
                      <a
                        className="certification-row-action"
                        href={certification.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View credential
                      </a>
                    )}
                  </div>
                </CertificationListItem>
              )
            })}
          </ol>
          <div
            className={`certification-inline-preview${activeCertification.imageOrientation === 'portrait' ? ' is-portrait' : ''}`}
          >
            <CertificatePreview
              key={activeCertification.id}
              certification={activeCertification}
              index={activeIndex}
              compact
            />
          </div>
        </div>
      </motion.div>

      {finePointer && (
        <div
          ref={previewRef}
          className={`certification-cursor-preview${previewVisible ? ' is-visible' : ''}${activeCertification.imageOrientation === 'portrait' ? ' is-portrait' : ''}`}
          aria-hidden="true"
          style={{
            transitionDuration: prefersReducedMotion ? '0ms' : undefined,
          }}
        >
          <CertificatePreview
            key={activeCertification.id}
            certification={activeCertification}
            index={activeIndex}
          />
        </div>
      )}
    </section>
  )
}

export default CertificationShowcase
