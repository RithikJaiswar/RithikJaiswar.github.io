export const profile = {
  name: 'Rithik Jaiswar',
  firstName: 'Rithik',
  roles: ['Data Analyst', 'Data Scientist', 'AI/ML & GenAI Enthusiast'],
  tagline: 'Turning data into insights, models, and intelligent applications.',
  summaryLong:
    'Fresher with a foundation in Python, SQL, statistics, machine learning, data analytics, visualization, and Generative AI. I enjoy solving practical problems by combining data, machine learning, and modern AI technologies.',
  location: 'India',
  status: 'Open to Data & AI Opportunities',
} as const

export const contact = {
  email: 'rithikjaiswar21@gmail.com',
  github: 'https://github.com/rithikjaiswar',
  linkedin: 'https://www.linkedin.com/in/rithikjaiswar',
  resume: '/resume/Rithik-Jaiswar-Resume.pdf',
} as const

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const

export const education = [
  {
    degree: 'Master of Computer Application',
    school: 'D Y Patil University',
    period: '2023 — 2025',
    start: 2023,
    end: 2025,
    focus: 'Machine learning, data science, statistical modelling and applied AI.',
  },
  {
    degree: 'Bachelor of Computer Application',
    school: 'Dr. D Y Patil ACS College',
    period: '2020 — 2023',
    start: 2020,
    end: 2023,
    focus: 'Programming fundamentals, databases, software development and mathematics.',
  },
] as const

/**
 * Hero floating data panel — figures taken from real project work.
 * 12K+ records analysed in the retail sales dataset,
 * 86.41% best model accuracy in the heart disease project.
 */
export const heroStats = [
  { label: 'DATA', value: '12K+', unit: 'Records', prefix: '' },
  { label: 'MODEL', value: '86.4', unit: '% Accuracy', suffix: '%' },
  { label: 'ANALYTICS', value: 'SQL', unit: 'Python • Power BI' },
] as const

export const processSteps = [
  {
    id: '01',
    title: 'Understand',
    text: 'Translate a business question into a measurable data problem and define success criteria.',
  },
  {
    id: '02',
    title: 'Collect',
    text: 'Gather data from SQL tables, CSV sources and APIs — and document every assumption.',
  },
  {
    id: '03',
    title: 'Clean',
    text: 'Handle missing values, duplicates and outliers so the analysis rests on trustworthy data.',
  },
  {
    id: '04',
    title: 'Analyze',
    text: 'Explore with pandas, NumPy and SQL window functions to surface trends and segments.',
  },
  {
    id: '05',
    title: 'Model',
    text: 'Build baselines first, then compare algorithms with proper feature engineering.',
  },
  {
    id: '06',
    title: 'Evaluate',
    text: 'Validate with cross-validation and the right metrics — accuracy, F1, and error analysis.',
  },
  {
    id: '07',
    title: 'Communicate',
    text: 'Package findings into dashboards, visuals and concise stories stakeholders can act on.',
  },
] as const
