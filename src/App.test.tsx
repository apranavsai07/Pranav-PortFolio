import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'
import { certifications } from './data/certifications'
import { featuredProjects } from './data/featured-projects'

describe('portfolio landing and About page', () => {
  it('renders the landing and the scroll transition before the About section', () => {
    const markup = renderToStaticMarkup(createElement(App))
    const transitionIndex = markup.indexOf('id="transition"')
    const aboutIndex = markup.indexOf('id="about"')
    const navIndex = markup.indexOf('aria-label="Portfolio sections"')
    const transitionEnd = markup.indexOf('</section>', transitionIndex)

    expect(transitionIndex).toBeGreaterThanOrEqual(0)
    expect(aboutIndex).toBeGreaterThan(transitionIndex)
    expect(navIndex).toBeGreaterThan(transitionEnd)
    expect(navIndex).toBeLessThan(aboutIndex)
    expect(markup.match(/aria-label="Portfolio sections"/g)).toHaveLength(1)
    expect(markup).toContain('Pranav, Software Engineer and AI/ML, 2026')
  })

  it('renders navigation links that target the existing scroll-driven sections', () => {
    const markup = renderToStaticMarkup(createElement(App))

    expect(markup).toContain('href="#about"')
    expect(markup).toContain('href="#projects"')
    expect(markup).toContain('href="#certifications"')
    expect(markup).toContain('href="#experience"')
    expect(markup).not.toContain('href="#skills"')
  })

  it('renders the four Beyond Code milestones and connected route', () => {
    const markup = renderToStaticMarkup(createElement(App))
    const experienceMarkup = markup.slice(markup.indexOf('id="experience"'))

    expect(experienceMarkup).toContain('BEYOND CODE.')
    expect(experienceMarkup).toContain('Leadership &amp; Community Impact')
    expect(experienceMarkup).toContain('DevCatalyst — Vice President · 2026')
    expect(experienceMarkup).toContain('Hosting &amp; Stage Engagement')
    expect(experienceMarkup).toContain('Event Hosting · Student Engagement')
    expect(experienceMarkup).toContain('Event Management &amp; Technical Contributions')
    expect(experienceMarkup).toContain('Event Operations · Technical Execution')
    expect(experienceMarkup).toContain('Technical Experience')
    expect(experienceMarkup).toContain('Appointed Vice President — DevCatalyst (2026)')
    expect(experienceMarkup).toContain('planning initiatives, coordinating teams, and driving the club&#x27;s technical activities')
    expect(experienceMarkup).toContain('Smart India Hackathon (SIH)')
    expect(experienceMarkup).toContain('coordinating 100 teams across 7 evaluation panels')
    expect(experienceMarkup).toContain('AWS Community Day')
    expect(experienceMarkup).toContain('students and the cloud community')
    expect(experienceMarkup).toContain('Freshgradprep — Career Awareness Event')
    expect(experienceMarkup).toContain('the transition from college to professional careers')
    expect(experienceMarkup).toContain('AISEC Hackathon')
    expect(experienceMarkup).toContain('guiding the event proceedings, engaging participants')
    expect(experienceMarkup).toContain('Event Operations &amp; Logistics')
    expect(experienceMarkup).toContain('on-ground logistics')
    expect(experienceMarkup).toContain('Catalyst Days 2026 — Logo Guesser')
    expect(experienceMarkup).toContain('interactive tech game for Catalyst Days 2026')
    expect(experienceMarkup).toContain('Beacon Technologies Hackathon — IIT Hyderabad')
    expect(experienceMarkup).toContain('in collaboration with Beacon Technologies at IIT Hyderabad')
    expect(experienceMarkup).toContain('6-Week Internship · 1 May – 15 June 2026')
    expect(experienceMarkup).toContain('Blackbucks Education — Generative AI Engineer Intern')
    expect(experienceMarkup).toContain('six-week internship focused on Generative AI')
    expect(experienceMarkup).toContain('Technical Training')
    expect(experienceMarkup).toContain('practical exposure to Generative AI concepts')
    expect(experienceMarkup).toContain('Hands-on Learning')
    expect(experienceMarkup).toContain('assignments and project-based activities')
    expect(experienceMarkup).toContain('alt="Blackbucks Education internship certificate"')
    expect(experienceMarkup.match(/class="beyond-milestone/g)).toHaveLength(4)
    expect(experienceMarkup.match(/class="beyond-route-marker/g)).toHaveLength(4)
    expect(experienceMarkup.match(/class="beyond-visual beyond-visual--/g)).toHaveLength(4)
    expect(experienceMarkup).toContain('beyond-route-draw')
    expect(experienceMarkup).toContain('beyond-route-marker')
    expect(experienceMarkup).not.toContain('Dates not provided')
    expect(experienceMarkup).toContain('src="/Leadership/l2.jpg"')
    expect(experienceMarkup).toContain('src="/Leadership/L3.jpeg"')
    expect(experienceMarkup).toContain('src="/Hosting/H1.jpeg"')
    expect(experienceMarkup).toContain('src="/Hosting/H2.jpeg"')
    expect(experienceMarkup.indexOf('src="/Hosting/H1.jpeg"')).toBeLessThan(
      experienceMarkup.indexOf('src="/Hosting/H2.jpeg"'),
    )
    expect(experienceMarkup).toContain('src="/Events/WhatsApp%20Image%202026-11-01%20at%206.24.30%20PM.jpeg"')
    expect(experienceMarkup).toContain('src="/Events/E2.jpeg"')
    expect(experienceMarkup).toContain('src="/Events/E3.jpeg"')
  })

  it('renders all certifications with their images and verification links', () => {
    const markup = renderToStaticMarkup(createElement(App))

    expect(markup).toContain('id="certifications"')
    expect(markup).toContain('Oracle Cloud Infrastructure 2025 Certified Generative AI Professional')
    expect(markup).toContain('Oracle Agentic AI Foundations Associate')
    expect(markup).toContain('Google AI/ML Virtual Internship')
    expect(markup).toContain('AI-Powered Cloud Engineer Virtual Internship')
    expect(markup).toContain('Generative AI Engineer Internship')
    expect(markup).toContain('View credential')
    expect(markup).not.toContain('CREDENTIALS / LEARNING')
    expect(markup).not.toContain('certification-row-arrow')
    expect(markup).toContain('LOADING CERTIFICATE')
    expect(certifications).toHaveLength(5)
    expect(certifications.map(({ verificationUrl }) => verificationUrl)).toEqual([
      'https://catalog-education.oracle.com/ords/certview/sharebadge?id=73BACFB696ED140FF394128339EBB2E58FF16EB30E558C4587A9DC9D98559DC3',
      'https://catalog-education.oracle.com/ords/certview/sharebadge?id=3CDA78B3EDFA72F7A6EA18132C66F6AC6AB2B51671A309B7DB5DC2A852F0272C',
      'https://certificate.eduskillsfoundation.org/verify/492394eee16f8b365ef6/492394eee16f8b365ef6',
      'https://drive.google.com/file/d/16R4pTWdvU1I9hCt6QPsfB68rdXOSKNKU/view',
      'https://drive.google.com/file/d/18sk_6zOVFunsSF9Rz5J8pzzfvYFUlj50/view',
    ])
    expect(certifications.map(({ id }) => id)).toEqual([
      'oracle-agentic-ai-foundations',
      'oracle-generative-ai-professional',
      'ai-powered-cloud-engineer-internship',
      'google-ai-ml-internship',
      'blackbucks-generative-ai-engineer-internship',
    ])
    expect(certifications.map(({ imagePath }) => imagePath)).toEqual([
      '/certificates/OracleAgentic%20AI.png',
      '/certificates/OracleAI.png',
      '/certificates/AIPOWRWEDCLOUD.png',
      '/certificates/GoogleAIML.png',
      '/certificates/Blackbucks%20Education%20Internship.png',
    ])
    certifications.forEach(({ verificationUrl }) => {
      expect(markup).toContain(`href="${verificationUrl}"`)
    })
    expect(markup).toContain('target="_blank"')
    expect(markup).toContain('rel="noopener noreferrer"')
  })

  it('renders the About introduction without the projects call-to-action', () => {
    const markup = renderToStaticMarkup(createElement(App))

    expect(markup).toContain('class="about-heading-filled">ABOUT</span>')
    expect(markup).toContain('class="about-heading-outline">ME</span>')
    expect(markup).toContain('final-year Computer Science student based in Hyderabad')
    expect(markup).toContain('machine learning pipelines and agentic AI workflows')
    expect(markup).not.toContain('about-work-button')
    expect(markup).not.toContain('See my work')
  })

  it('keeps one shared character without an About position anchor', () => {
    const markup = renderToStaticMarkup(createElement(App))

    expect(markup).not.toContain('class="about-character"')
    expect(markup).not.toContain('wpl-character-art')
    expect(markup).not.toContain('shrug-person-78902957.figma.site')
  })

  it('renders the resume and configured profile links', () => {
    const markup = renderToStaticMarkup(createElement(App))

    expect(markup).toContain('RESUME')
    expect(markup).toContain('href="/resume.pdf"')
    expect(markup).toContain('target="_blank"')
    expect(markup).toContain(
      'href="/resume.pdf" target="_blank" rel="noopener noreferrer" data-link-placeholder="resume"',
    )
    expect(markup).not.toContain('download="Pranav-Resume.pdf"')
    expect(markup).toContain('GITHUB')
    expect(markup).toContain('https://github.com/apranavsai07')
    expect(markup).toContain('LINKEDIN')
    expect(markup).toContain('https://www.linkedin.com/in/pranav-sai-sreekanta-ajjarapu-89236032a/')
    expect(markup).toContain('rel="noopener noreferrer"')
  })

  it('renders the Contact section after Beyond Code with real profile links and no form', () => {
    const markup = renderToStaticMarkup(createElement(App))
    const experienceIndex = markup.indexOf('id="experience"')
    const contactIndex = markup.indexOf('id="contact"')
    const contactMarkup = markup.slice(contactIndex)

    expect(contactIndex).toBeGreaterThan(experienceIndex)
    expect(contactMarkup).toContain('GET IN TOUCH')
    expect(contactMarkup).toContain('LET&#x27;S CONNECT &amp;')
    expect(contactMarkup).toContain('BUILD SOMETHING MEANINGFUL.')
    expect(contactMarkup).toContain('fourth-year Computer Science student')
    expect(contactMarkup).toContain('OPEN TO OPPORTUNITIES')
    expect(contactMarkup).toContain('AI/ML')
    expect(contactMarkup).toContain('Web Development')
    expect(contactMarkup).toContain('Python')
    expect(contactMarkup).toContain('Software Engineer')
    expect(contactMarkup).toContain('LET&#x27;S TALK')
    expect(contactMarkup).toContain('Internships · Entry-Level Roles')
    expect(contactMarkup).toContain('href="mailto:apranavsai07@gmail.com"')
    expect(contactMarkup).toContain('https://github.com/apranavsai07')
    expect(contactMarkup).toContain(
      'https://www.linkedin.com/in/pranav-sai-sreekanta-ajjarapu-89236032a/',
    )
    expect(contactMarkup).not.toContain('Resume')
    expect(contactMarkup).not.toContain('download="Pranav-Resume.pdf"')
    expect(contactMarkup).toContain('aria-label="Copy email address"')
    expect(contactMarkup).toContain('Pranav character waving')
    expect(contactMarkup).toContain('LET&#x27;S CONNECT')
    expect(contactMarkup).not.toContain('SOFTWARE · AI/ML')
    expect(contactMarkup).not.toContain('SAY HELLO')
    expect(contactMarkup).toContain('href="#experience">Experience</a>')
    expect(contactMarkup).not.toContain('<form')
    expect(contactMarkup).not.toContain('contact-globe')
    expect(contactMarkup).not.toContain('contact@yoursaas.ai')
  })

  it('renders the project selector and configured project destinations', () => {
    const markup = renderToStaticMarkup(createElement(App))

    expect(markup).toContain('DataMind')
    expect(markup).toContain('Behavioral Biometrics')
    expect(markup).toContain('ResumeMatch')
    expect(markup).toContain('src="/Datamind/datamind1.png"')
    expect(markup).toContain('Live project')
    expect(markup).toContain('GitHub repo')
    expect(markup).not.toContain('Selected work / Engineering')
    expect(markup).not.toContain('Selected AI/ML and software engineering work')
    expect(markup).not.toContain('Northstar')
    expect(markup).not.toContain('Folio')
    expect(markup).not.toContain('Relay')
    const projectsIndex = markup.indexOf('id="projects"')
    const projectsMarkup = markup.slice(projectsIndex)
    expect(projectsMarkup).toContain('href="https://datamind-ai-agent.vercel.app/"')
    expect(projectsMarkup).toContain('href="https://github.com/apranavsai07/DataMind-Agentic-Intelligence-for-Data-Analysis"')
  })

  it('keeps all supplied project descriptions, technologies, and results in project data', () => {
    expect(featuredProjects).toHaveLength(3)
    expect(featuredProjects.map(({ visualScreenshots }) => visualScreenshots)).toEqual([
      [
        '/Datamind/datamind1.png',
        '/Datamind/datamind2.png',
        '/Datamind/datamind3.png',
        '/Datamind/datamind4.png',
        '/Datamind/datamind5.png',
      ],
      [
        '/Behavioral/BB1.png',
        '/Behavioral/BB2.png',
        '/Behavioral/BB3.png',
        '/Behavioral/BB4.png',
      ],
      [
        '/ResumeMatch/RS1.png',
        '/ResumeMatch/RS2.png',
        '/ResumeMatch/RS3.png',
        '/ResumeMatch/RS4.png',
      ],
    ])
    expect(featuredProjects.map(({ liveDemoUrl, githubUrl }) => [liveDemoUrl, githubUrl])).toEqual([
      [
        'https://datamind-ai-agent.vercel.app/',
        'https://github.com/apranavsai07/DataMind-Agentic-Intelligence-for-Data-Analysis',
      ],
      [
        'https://behavioural-biometrics-zeta.vercel.app/',
        'https://github.com/apranavsai07/neorunner-backend',
      ],
      [
        'https://resumematch-analyzer.vercel.app/',
        'https://github.com/apranavsai07/ResumeMatch',
      ],
    ])
    expect(featuredProjects[0].services).toContain('LangGraph')
    expect(featuredProjects[0].outcome).toContain('authentication and data persistence')
    expect(featuredProjects[1].name).toBe(
      'Continuous Behavioral Biometric Authentication',
    )
    expect(featuredProjects[1].outcome).toContain('91.21% accuracy')
    expect(featuredProjects[1].outcome).toContain('97.37% ROC-AUC')
    expect(featuredProjects[1].outcome).toContain('7.88% EER')
    expect(featuredProjects[1].outcome).toContain('546 test pairs')
    expect(featuredProjects[2].outcome).toContain('reduce unnecessary LLM calls')
  })
})
