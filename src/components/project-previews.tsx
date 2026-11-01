import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export function ProjectImagePlaceholder({
  projectName,
  imagePaths,
  index,
}: {
  projectName: string
  imagePaths: readonly string[]
  index: string
}) {
  const [activeImage, setActiveImage] = useState(0)
  const [failedImages, setFailedImages] = useState<ReadonlySet<string>>(
    () => new Set(),
  )
  const rotationTimer = useRef<number | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const reducedMotion = prefersReducedMotion === true
  const imagePath = imagePaths[activeImage]
  const imageFailed = imagePath ? failedImages.has(imagePath) : true

  useEffect(() => {
    if (reducedMotion || imagePaths.length < 2) return

    const timer = window.setInterval(
      () => setActiveImage((current) => (current + 1) % imagePaths.length),
      5200,
    )
    rotationTimer.current = timer
    return () => {
      window.clearInterval(timer)
      rotationTimer.current = null
    }
  }, [imagePaths.length, reducedMotion])

  const selectImage = (imageIndex: number) => {
    setActiveImage(imageIndex)
    if (rotationTimer.current !== null) {
      window.clearInterval(rotationTimer.current)
      rotationTimer.current = null
    }
    if (!reducedMotion && imagePaths.length > 1) {
      rotationTimer.current = window.setInterval(
        () => setActiveImage((current) => (current + 1) % imagePaths.length),
        5200,
      )
    }
  }

  return (
    <div className="project-image-placeholder">
      {imagePath && !imageFailed ? (
        <AnimatePresence initial={false} mode="sync">
          <motion.img
            key={imagePath}
            className="project-image-slide"
            src={imagePath}
            alt={`${projectName} project screenshot ${activeImage + 1}`}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={
              reducedMotion
                ? undefined
                : {
                    opacity: 0,
                    transition: { duration: 0.75, ease: 'easeOut' },
                  }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    opacity: { duration: 0.75, ease: 'easeOut' },
                  }
            }
            onError={() => {
              setFailedImages((current) => new Set(current).add(imagePath))
            }}
          />
        </AnimatePresence>
      ) : (
        <div className="project-image-fallback" role="status">
          <strong>{projectName}</strong>
          <span>
            {imagePath
              ? `Unable to load project screenshot: ${imagePath}`
              : 'No project screenshots available'}
          </span>
        </div>
      )}
      <span className="project-image-index" aria-hidden="true">
        / {index}
      </span>
      <span className="project-image-caption" aria-hidden="true">
        {projectName}
      </span>
      <div
        className="project-image-pagination"
        role="group"
        aria-label={`Choose a ${projectName} screenshot`}
      >
        {imagePaths.map((path, imageIndex) => (
          <button
            key={path}
            type="button"
            className={imageIndex === activeImage ? 'is-active' : undefined}
            aria-label={`Show ${projectName} screenshot ${imageIndex + 1}`}
            aria-pressed={imageIndex === activeImage}
            onClick={(event) => {
              event.stopPropagation()
              selectImage(imageIndex)
            }}
          />
        ))}
      </div>
    </div>
  )
}
