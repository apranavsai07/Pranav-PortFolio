export type Certification = {
  id: string
  name: string
  issuer: string
  imagePath: string
  imageOrientation?: 'landscape' | 'portrait'
  verificationUrl: string | null
  date?: string
  isPlaceholder?: boolean
}

export const certifications: readonly Certification[] = [
  {
    id: 'oracle-agentic-ai-foundations',
    name: 'Oracle Agentic AI Foundations Associate',
    issuer: 'Oracle',
    imagePath: '/certificates/OracleAgentic%20AI.png',
    date: '2026',
    verificationUrl:
      'https://catalog-education.oracle.com/ords/certview/sharebadge?id=73BACFB696ED140FF394128339EBB2E58FF16EB30E558C4587A9DC9D98559DC3',
  },
  {
    id: 'oracle-generative-ai-professional',
    name: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
    issuer: 'Oracle',
    imagePath: '/certificates/OracleAI.png',
    verificationUrl:
      'https://catalog-education.oracle.com/ords/certview/sharebadge?id=3CDA78B3EDFA72F7A6EA18132C66F6AC6AB2B51671A309B7DB5DC2A852F0272C',
  },
  {
    id: 'ai-powered-cloud-engineer-internship',
    name: 'AI-Powered Cloud Engineer Virtual Internship',
    issuer: 'AICTE, EduSkills, AWS Educate',
    imagePath: '/certificates/AIPOWRWEDCLOUD.png',
    imageOrientation: 'portrait',
    date: '2026',
    verificationUrl:
      'https://certificate.eduskillsfoundation.org/verify/492394eee16f8b365ef6/492394eee16f8b365ef6',
  },
  {
    id: 'google-ai-ml-internship',
    name: 'Google AI/ML Virtual Internship',
    issuer: 'Google / Virtual Internship',
    imagePath: '/certificates/GoogleAIML.png',
    imageOrientation: 'portrait',
    date: '2025',
    verificationUrl:
      'https://drive.google.com/file/d/16R4pTWdvU1I9hCt6QPsfB68rdXOSKNKU/view',
  },
  {
    id: 'blackbucks-generative-ai-engineer-internship',
    name: 'Generative AI Engineer Internship',
    issuer: 'Blackbucks Education Pvt. Ltd.',
    imagePath: '/certificates/Blackbucks%20Education%20Internship.png',
    date: '2026',
    verificationUrl:
      'https://drive.google.com/file/d/18sk_6zOVFunsSF9Rz5J8pzzfvYFUlj50/view',
  },
]
