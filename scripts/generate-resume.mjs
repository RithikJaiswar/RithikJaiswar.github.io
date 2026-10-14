/**
 * Generates public/resume/Rithik-Jaiswar-Resume.pdf
 * A dependency-free, valid single-page PDF so the "Download Resume"
 * button never 404s. Replace the file with a designed export any time.
 *
 * Run: node scripts/generate-resume.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = resolve(__dirname, '../public/resume/Rithik-Jaiswar-Resume.pdf')

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

let y = 792
const ops = []
const text = (str, { size = 10, font = 'F1', color = '0.13 0.15 0.18 rg', gap = 16, x = 60 } = {}) => {
  ops.push('BT', color, `/${font} ${size} Tf`, `${x} ${y} Td`, `(${esc(str)}) Tj`, 'ET')
  y -= gap
}
const rule = (color = '0.55 0.62 0.75 RG') => {
  ops.push(color, '0.8 w', `60 ${y + 6} m 535 ${y + 6} l S`)
  y -= 8
}
const gap = (n) => {
  y -= n
}
const bullet = (str) => text(`•  ${str}`, { x: 70, gap: 14 })

/* ------------------------------ content ------------------------------ */
text('Rithik Jaiswar', { size: 24, font: 'F2', color: '0.06 0.09 0.16 rg', gap: 22 })
text('Data Analyst | Data Scientist | AI/ML & GenAI Enthusiast', {
  size: 11,
  color: '0.20 0.42 0.85 rg',
  gap: 15,
})
text('rithikjaiswar@gmail.com  •  github.com/rithikjaiswar  •  linkedin.com/in/rithikjaiswar', {
  size: 9,
  color: '0.35 0.39 0.47 rg',
  gap: 8,
})
rule('0.20 0.42 0.85 RG')

text('PROFILE', { size: 12, font: 'F2', color: '0.20 0.42 0.85 rg', gap: 18 })
text(
  'Fresher with a foundation in Python, SQL, statistics, machine learning, data analytics,',
  { gap: 14 },
)
text('visualization, and Generative AI. I enjoy solving practical problems by combining data,')
text('machine learning, and modern AI technologies.')
gap(6)

text('EDUCATION', { size: 12, font: 'F2', color: '0.20 0.42 0.85 rg', gap: 18 })
text('Master of Computer Application — D Y Patil University', { font: 'F2', gap: 15 })
text('2023 — 2025  •  Machine learning, data science, statistical modelling, applied AI', {
  size: 9,
  gap: 16,
})
text('Bachelor of Computer Application — Dr. D Y Patil ACS College', { font: 'F2', gap: 15 })
text('2020 — 2023  •  Programming, databases, software development, mathematics', {
  size: 9,
  gap: 18,
})

text('SKILLS', { size: 12, font: 'F2', color: '0.20 0.42 0.85 rg', gap: 18 })
text('Programming:      Python, SQL', { gap: 15 })
text('Data Analytics:   Pandas, NumPy, Excel, Power BI, Data Cleaning, EDA, Data Visualization', {
  gap: 15,
})
text('Machine Learning: Scikit-learn, Regression, Classification, Feature Engineering,', { gap: 14 })
text('                  Model Evaluation, Cross Validation', { gap: 15 })
text('AI / GenAI:       LLMs, LangChain, LangGraph, RAG, Vector Databases,', { gap: 14 })
text('                  Prompt Engineering, AI Agents', { gap: 15 })
text('Development:      Streamlit, Git, GitHub, REST APIs', { gap: 18 })

text('PROJECTS', { size: 12, font: 'F2', color: '0.20 0.42 0.85 rg', gap: 18 })

text('Retail Sales & Customer Churn Analysis', { font: 'F2', gap: 14 })
text('Python • Pandas • SQL • Power BI', { size: 9, color: '0.35 0.39 0.47 rg', gap: 14 })
bullet('Analysed 12K+ retail records for revenue trends, repeat purchases and churn patterns.')
bullet('SQL joins, CTEs and window functions; interactive Power BI dashboard with segments.')
gap(4)

text('Heart Disease Prediction', { font: 'F2', gap: 14 })
text('Python • Pandas • NumPy • Scikit-learn', { size: 9, color: '0.35 0.39 0.47 rg', gap: 14 })
bullet('Compared 5 classifiers (Logistic Regression, Decision Tree, SVM, KNN, Naive Bayes).')
bullet('Logistic Regression: 86.41% accuracy, 0.88 F1 with cross-validation.')
gap(4)

text('Stock Trend Predictor', { font: 'F2', gap: 14 })
text('Python • Scikit-learn • LSTM • Matplotlib', { size: 9, color: '0.35 0.39 0.47 rg', gap: 14 })
bullet('Compared traditional ML with LSTM approaches on historical price data.')
bullet('Time-aware preprocessing pipeline with no look-ahead leakage. Educational only.')
gap(4)

text('Multi AI Research Agent', { font: 'F2', gap: 14 })
text('Python • LangChain • Mistral • Tavily • BeautifulSoup', {
  size: 9,
  color: '0.35 0.39 0.47 rg',
  gap: 14,
})
bullet('Multi-agent workflow: search, extraction and a critic/review stage before answering.')
gap(4)

text('AI Video Summarizer', { font: 'F2', gap: 14 })
text('Python • LangChain • RAG • Vector Store • yt-dlp', {
  size: 9,
  color: '0.35 0.39 0.47 rg',
  gap: 14,
})
bullet('RAG pipeline: transcribe, chunk, embed and summarise video/audio content.')

const contentStream = ops.join('\n')

/* ------------------------------ PDF assembly ------------------------------ */
const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
  `<< /Length ${Buffer.byteLength(contentStream, 'latin1')} >>\nstream\n${contentStream}\nendstream`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
]

let pdf = '%PDF-1.4\n'
const offsets = []
objects.forEach((obj, i) => {
  offsets.push(Buffer.byteLength(pdf, 'latin1'))
  pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`
})

const xrefPos = Buffer.byteLength(pdf, 'latin1')
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
offsets.forEach((off) => {
  pdf += `${String(off).padStart(10, '0')} 00000 n \n`
})
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, Buffer.from(pdf, 'latin1'))
console.log(`wrote ${out}`)
