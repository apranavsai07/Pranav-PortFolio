import type { FeaturedProject } from '@/components/ui/featured-project-hero'
import { ProjectImagePlaceholder } from '@/components/project-previews'

const dataMindScreenshots = [
  '/Datamind/datamind1.png',
  '/Datamind/datamind2.png',
  '/Datamind/datamind3.png',
  '/Datamind/datamind4.png',
  '/Datamind/datamind5.png',
]
const behavioralScreenshots = [
  '/Behavioral/BB1.png',
  '/Behavioral/BB2.png',
  '/Behavioral/BB3.png',
  '/Behavioral/BB4.png',
]
const resumeMatchScreenshots = [
  '/ResumeMatch/RS1.png',
  '/ResumeMatch/RS2.png',
  '/ResumeMatch/RS3.png',
  '/ResumeMatch/RS4.png',
]

export const featuredProjects: readonly FeaturedProject[] = [
  {
    id: 'datamind',
    name: 'DataMind',
    category: 'Agentic AI / Data Analytics',
    year: 'Year not specified',
    summary:
      'An agentic data-analysis system that uses LLM reasoning and analytical tools to automate data analysis and reporting.',
    services: [
      'Python',
      'LangGraph',
      'LangChain',
      'Gemini',
      'FastAPI',
      'React',
      'Supabase / PostgreSQL',
    ],
    outcome:
      'A stateful AI workflow for natural-language analysis and automated reporting, implemented full stack with authentication and data persistence.',
    visualScreenshots: dataMindScreenshots,
    visual: (
      <ProjectImagePlaceholder
        projectName="DataMind"
        imagePaths={dataMindScreenshots}
        index="01"
      />
    ),
    visualDescription:
      'Slideshow of DataMind project screenshots.',
    caseStudy: [
      {
        heading: 'System focus',
        body:
          'The system combines LLM reasoning with analytical tools in a stateful workflow, allowing users to ask questions about data and automate reporting.',
      },
      {
        heading: 'Implementation',
        body:
          'The full-stack implementation uses Python, LangGraph, LangChain, Gemini, FastAPI, React, and Supabase / PostgreSQL, with authentication and persistent data.',
      },
    ],
    liveDemoUrl: 'https://datamind-ai-agent.vercel.app/',
    githubUrl:
      'https://github.com/apranavsai07/DataMind-Agentic-Intelligence-for-Data-Analysis',
  },
  {
    id: 'behavioral-biometrics',
    name: 'Continuous Behavioral Biometric Authentication',
    category: 'Machine Learning / Security',
    year: 'Year not specified',
    summary:
      'A behavioral biometric authentication system using engineered behavioral features and a Random Forest classifier.',
    services: [
      'Python',
      'Machine Learning',
      'Feature Engineering',
      'Random Forest',
      'scikit-learn',
    ],
    outcome:
      'ML Lead; engineered 30+ statistical features. Reported evaluation across 546 test pairs: 91.21% accuracy, 97.37% ROC-AUC, and 7.88% EER.',
    visualScreenshots: behavioralScreenshots,
    visual: (
      <ProjectImagePlaceholder
        projectName="Behavioral Biometrics"
        imagePaths={behavioralScreenshots}
        index="02"
      />
    ),
    visualDescription:
      'Slideshow of Behavioral Biometrics project screenshots.',
    caseStudy: [
      {
        heading: 'Technical contribution',
        body:
          'As ML Lead, engineered more than 30 statistical behavioral features and used a Random Forest classifier for continuous authentication.',
      },
      {
        heading: 'Reported evaluation',
        body:
          'Across 546 test pairs, the reported results are 91.21% accuracy, 97.37% ROC-AUC, and 7.88% equal error rate (EER).',
      },
    ],
    liveDemoUrl: 'https://behavioural-biometrics-zeta.vercel.app/',
    githubUrl: 'https://github.com/apranavsai07/neorunner-backend',
  },
  {
    id: 'resumematch',
    name: 'ResumeMatch',
    category: 'AI Application / Full-Stack Development',
    year: 'Year not specified',
    summary:
      'An AI-powered resume-to-job matching application that generates match scores and identifies skill gaps using resumes and job descriptions.',
    services: [
      'React',
      'FastAPI',
      'Semantic Search',
      'LLM APIs',
      'Rule-Based Matching',
    ],
    outcome:
      'A hybrid matching pipeline combines semantic matching beyond exact keyword overlap with deterministic rules to reduce unnecessary LLM calls.',
    visualScreenshots: resumeMatchScreenshots,
    visual: (
      <ProjectImagePlaceholder
        projectName="ResumeMatch"
        imagePaths={resumeMatchScreenshots}
        index="03"
      />
    ),
    visualDescription:
      'Slideshow of ResumeMatch project screenshots.',
    caseStudy: [
      {
        heading: 'Matching approach',
        body:
          'The application compares resumes with job descriptions using semantic matching, so matching can go beyond exact keyword overlap.',
      },
      {
        heading: 'Efficient pipeline',
        body:
          'Deterministic rules are used to reduce unnecessary LLM calls. The interface presents a match score and identifies skill gaps for the submitted documents.',
      },
    ],
    liveDemoUrl: 'https://resumematch-analyzer.vercel.app/',
    githubUrl: 'https://github.com/apranavsai07/ResumeMatch',
  },
]
