import {
  Code2,
  BarChart3,
  BrainCircuit,
  Sparkles,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export type Skill = { name: string; hint: string }

export type SkillCategory = {
  id: string
  title: string
  icon: LucideIcon
  accent: 'blue' | 'cyan' | 'violet'
  blurb: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'programming',
    title: 'Programming',
    icon: Code2,
    accent: 'blue',
    blurb: 'The core languages I use to move from raw data to working solutions.',
    skills: [
      { name: 'Python', hint: 'Primary language for analysis, modelling and AI apps.' },
      { name: 'SQL', hint: 'Joins, CTEs, window functions and reporting queries.' },
    ],
  },
  {
    id: 'analytics',
    title: 'Data Analytics',
    icon: BarChart3,
    accent: 'cyan',
    blurb: 'Cleaning, exploring and visualising data to answer real business questions.',
    skills: [
      { name: 'Pandas', hint: 'Wrangling, grouping and time-series analysis at scale.' },
      { name: 'NumPy', hint: 'Vectorised computation for statistics and features.' },
      { name: 'Excel', hint: 'Lookups, pivot tables and stakeholder-ready reports.' },
      { name: 'Power BI', hint: 'Interactive dashboards with DAX measures and models.' },
      { name: 'Data Cleaning', hint: 'Missing values, duplicates, outliers, type fixes.' },
      { name: 'Exploratory Data Analysis', hint: 'Distributions, correlations, segment discovery.' },
      { name: 'Data Visualization', hint: 'Charts chosen to make the insight obvious.' },
    ],
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    icon: BrainCircuit,
    accent: 'violet',
    blurb: 'Classical ML done properly: baselines, validation and honest evaluation.',
    skills: [
      { name: 'Scikit-learn', hint: 'Pipelines, transformers and estimators end to end.' },
      { name: 'Regression', hint: 'Linear and regularised models for numeric targets.' },
      { name: 'Classification', hint: 'Logistic regression, trees, SVM, KNN, Naive Bayes.' },
      { name: 'Feature Engineering', hint: 'Encoding, scaling and creating signal from raw fields.' },
      { name: 'Model Evaluation', hint: 'Accuracy, precision, recall, F1 and confusion matrices.' },
      { name: 'Cross Validation', hint: 'k-fold validation to check results actually hold up.' },
    ],
  },
  {
    id: 'ai',
    title: 'AI / GenAI',
    icon: Sparkles,
    accent: 'blue',
    blurb: 'Building practical LLM applications — retrieval, agents and workflows.',
    skills: [
      { name: 'LLMs', hint: 'Prompting and integrating large language models.' },
      { name: 'LangChain', hint: 'Chains, loaders, output parsing and tooling.' },
      { name: 'LangGraph', hint: 'Stateful multi-step agent workflows.' },
      { name: 'RAG', hint: 'Retrieval-augmented generation over my own documents.' },
      { name: 'Vector Databases', hint: 'Embeddings, similarity search and chunking strategy.' },
      { name: 'Prompt Engineering', hint: 'Structured, testable prompts with clear contracts.' },
      { name: 'AI Agents', hint: 'Search → extract → critique multi-agent loops.' },
    ],
  },
  {
    id: 'dev',
    title: 'Development',
    icon: Wrench,
    accent: 'cyan',
    blurb: 'Shipping data work as usable tools, not just notebooks.',
    skills: [
      { name: 'Streamlit', hint: 'Fast, shareable data apps and model demos.' },
      { name: 'Git', hint: 'Version control with clear, small commits.' },
      { name: 'GitHub', hint: 'Repos, READMEs and collaboration workflow.' },
      { name: 'REST APIs', hint: 'Consuming and wrapping services for data pipelines.' },
    ],
  },
]
