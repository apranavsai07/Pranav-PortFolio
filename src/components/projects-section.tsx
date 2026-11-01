import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import FeaturedProjectHero, {
  type FeaturedProject,
} from '@/components/ui/featured-project-hero'
import { featuredProjects } from '@/data/featured-projects'

type ProjectsSectionProps = {
  sectionRef: RefObject<HTMLElement | null>
}

function ProjectsSection({
  sectionRef,
}: ProjectsSectionProps) {
  const [openProject, setOpenProject] = useState<FeaturedProject | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !openProject || dialog.open) return
    dialog.showModal()
  }, [openProject])

  const closeDialog = () => dialogRef.current?.close()

  return (
    <>
      <FeaturedProjectHero
        id="projects"
        sectionRef={sectionRef}
        projects={featuredProjects}
        onOpenProject={setOpenProject}
      />
      {openProject && (
        <dialog
          ref={dialogRef}
          className="projects-dialog"
          aria-labelledby="projects-dialog-title"
          aria-describedby="projects-dialog-summary"
          onCancel={(event) => {
            event.preventDefault()
            closeDialog()
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              closeDialog()
            }
          }}
          onClose={() => setOpenProject(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDialog()
          }}
        >
          <div className="projects-dialog-body">
            <div className="projects-dialog-top">
              <span>Project details / {openProject.category}</span>
              <button
                className="projects-dialog-close"
                type="button"
                aria-label="Close project details"
                onClick={closeDialog}
                autoFocus
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="m5 5 10 10M15 5 5 15" />
                </svg>
              </button>
            </div>
            <h2 id="projects-dialog-title">{openProject.name}</h2>
            <p id="projects-dialog-summary" className="projects-dialog-summary">
              {openProject.summary}
            </p>
            {openProject.caseStudy.map((section) => (
              <section className="projects-dialog-section" key={section.heading}>
                <h3>{section.heading}</h3>
                <p>{section.body}</p>
              </section>
            ))}
          </div>
        </dialog>
      )}
    </>
  )
}

export default ProjectsSection
