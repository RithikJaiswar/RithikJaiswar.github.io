/**
 * Single source of truth for all project content.
 * Update this file to add / edit projects — the UI is fully data-driven.
 *
 * NOTE: `github` points at the profile URL; swap in direct repository
 * URLs as soon as the repos are public.
 */

export type Accent = 'blue' | 'cyan' | 'violet'

export type ProjectVisualKind = 'dashboard' | 'metrics' | 'stock' | 'agent' | 'pipeline'

export type Metric = { label: string; value: string; sub?: string }

export type Project = {
  id: string
  index: string
  title: string
  headline: string
  problem: string
  solution: string
  tech: string[]
  features: string[]
  results: Metric[]
  github: string
  live?: string
  visual: ProjectVisualKind
  accent: Accent
  architecture: string[]
  workflow: { title: string; text: string }[]
  disclaimer?: string
}

export const projects: Project[] = [
  {
    id: 'retail-churn',
    index: '01',
    title: 'Retail Sales & Customer Churn Analysis',
    headline: 'SQL + Power BI analysis of revenue trends, repeat purchases and churn.',
    problem:
      'Retail teams often cannot see which customers drive revenue, which are drifting away, and why — sales data sits in tables with no shared view of customer behaviour.',
    solution:
      'Built a SQL analytics pipeline (joins, CTEs, window functions) over the transaction dataset, then presented revenue, repeat-purchase, segmentation and churn views in an interactive Power BI dashboard.',
    tech: ['Python', 'Pandas', 'SQL', 'Power BI'],
    features: [
      'SQL joins across transaction, customer and product tables',
      'CTEs and window functions for running revenue and rank analysis',
      'Revenue trend analysis by period and category',
      'Repeat purchase and retention analysis',
      'Customer segmentation by purchase behaviour',
      'Churn pattern analysis on lapsed customers',
      'Interactive Power BI dashboard',
    ],
    results: [
      { label: 'Dataset', value: '12K+', sub: 'transaction records analysed' },
      { label: 'Views', value: '4', sub: 'revenue • churn • repeat • segments' },
      { label: 'Stack', value: 'SQL', sub: 'CTEs + window functions' },
    ],
    github: 'https://github.com/rithikjaiswar',
    visual: 'dashboard',
    accent: 'cyan',
    architecture: [
      'Source data — retail transactions, customers and products',
      'SQL layer — joins, CTEs and window functions for derived metrics',
      'Python (Pandas) — cleaning, feature preparation and validation',
      'Power BI model — star schema with measures for revenue, churn, repeat rate',
      'Dashboard — interactive filters by period, category and customer segment',
    ],
    workflow: [
      { title: 'Profile the data', text: 'Map tables, keys, grain and data quality issues.' },
      { title: 'Clean & transform', text: 'Dedupe, fix types, handle missing values in pandas.' },
      { title: 'Metric definitions', text: 'Define revenue, repeat purchase, segment and churn rules.' },
      { title: 'SQL analysis', text: 'Joins, CTEs and window functions compute every metric.' },
      { title: 'Dashboard', text: 'Build Power BI visuals with drill-through and filters.' },
      { title: 'Communicate', text: 'Summarise trends and churn risk for decision makers.' },
    ],
  },
  {
    id: 'heart-disease',
    index: '02',
    title: 'Heart Disease Prediction',
    headline: 'Five classification models compared on patient features, validated honestly.',
    problem:
      'Heart disease risk is hard to assess from raw clinical features by hand — the goal was to test whether standard ML classifiers could predict diagnosis reliably and compare them fairly.',
    solution:
      'Preprocessed the patient dataset, trained five classifiers with cross-validation, and compared them on accuracy and F1 to select the most reliable model.',
    tech: ['Python', 'Pandas', 'NumPy', 'Scikit-learn'],
    features: [
      'Logistic Regression, Decision Tree, SVM, KNN and Naive Bayes',
      'Feature scaling and preparation with scikit-learn pipelines',
      'Train/test split with cross-validation',
      'Accuracy and F1 evaluation with confusion matrix analysis',
      'Model comparison to select the best performer',
    ],
    results: [
      { label: 'Accuracy', value: '86.41%', sub: 'Logistic Regression' },
      { label: 'F1 Score', value: '0.88', sub: 'Logistic Regression' },
      { label: 'Models', value: '5', sub: 'classification algorithms compared' },
    ],
    github: 'https://github.com/rithikjaiswar',
    visual: 'metrics',
    accent: 'blue',
    architecture: [
      'Dataset — patient clinical features with labelled outcomes',
      'Preprocessing — imputation, scaling and encoding in a pipeline',
      'Training — five classifiers fitted on the training split',
      'Validation — k-fold cross-validation to check stability',
      'Evaluation — accuracy, F1 and confusion matrix comparison',
      'Selection — Logistic Regression chosen as the best model',
    ],
    workflow: [
      { title: 'Understand', text: 'Frame the task as binary classification with F1 as a key metric.' },
      { title: 'Prepare', text: 'Clean data, scale features and encode categorical fields.' },
      { title: 'Baseline', text: 'Start with logistic regression as the interpretable baseline.' },
      { title: 'Compare', text: 'Train Decision Tree, SVM, KNN and Naive Bayes.' },
      { title: 'Evaluate', text: 'Cross-validate and compare accuracy + F1 side by side.' },
      { title: 'Conclude', text: 'Report the best model and where it still makes errors.' },
    ],
    disclaimer:
      'Educational project on a public dataset — not a medical device and not for clinical use.',
  },
  {
    id: 'stock-trend',
    index: '03',
    title: 'Stock Trend Predictor',
    headline: 'Traditional ML vs LSTM sequences for forecasting directional price movement.',
    problem:
      'Stock data is noisy and sequential — does a sequence model actually learn anything a simple lagged-feature model cannot?',
    solution:
      'Explored historical price data, built a preprocessing pipeline (lags, scaling, train/test split in time order), and compared a traditional ML model against an LSTM-based approach.',
    tech: ['Python', 'Scikit-learn', 'LSTM', 'Matplotlib'],
    features: [
      'Historical price collection and visual exploration with Matplotlib',
      'Time-aware preprocessing pipeline (no look-ahead leakage)',
      'Lagged feature engineering for traditional models',
      'LSTM sequence model for trend prediction',
      'Side-by-side model comparison and error analysis',
    ],
    results: [
      { label: 'Approaches', value: '2', sub: 'traditional ML vs LSTM' },
      { label: 'Data', value: 'Time series', sub: 'chronological train/test split' },
      { label: 'Output', value: 'Trend', sub: 'direction, not a price target' },
    ],
    github: 'https://github.com/rithikjaiswar',
    visual: 'stock',
    accent: 'violet',
    architecture: [
      'Data — historical OHLC price series',
      'Preprocessing — chronological split, scaling, lag features and sequences',
      'Model A — scikit-learn classifier on lagged features',
      'Model B — LSTM on windowed sequences',
      'Evaluation — trend accuracy and error analysis over time',
      'Visualisation — Matplotlib plots of actual vs predicted movement',
    ],
    workflow: [
      { title: 'Collect', text: 'Pull historical price data and plot the long-run trend.' },
      { title: 'Clean', text: 'Handle gaps, adjust splits and align the index.' },
      { title: 'Feature', text: 'Build lag features and rolling windows without leakage.' },
      { title: 'Model', text: 'Train a baseline ML model and an LSTM sequence model.' },
      { title: 'Compare', text: 'Evaluate both on a strictly chronological test window.' },
      { title: 'Interpret', text: 'Discuss where sequence models help — and where they do not.' },
    ],
    disclaimer: 'For educational purposes only — not financial advice.',
  },
  {
    id: 'multi-agent',
    index: '04',
    title: 'Multi AI Research Agent',
    headline: 'A multi-agent loop that searches, extracts and critiques before answering.',
    problem:
      'A single LLM prompt gives shallow, unverified answers to research questions — no fresh sources and no quality control on the output.',
    solution:
      'Built a multi-agent workflow where a research agent plans searches, a retrieval step pulls live web results, an extraction step parses the pages, and a critic agent reviews the draft before the final answer is produced.',
    tech: ['Python', 'LangChain', 'Mistral', 'Tavily', 'BeautifulSoup'],
    features: [
      'Research agent that plans and issues targeted searches',
      'Live web search through the Tavily API',
      'HTML extraction and cleaning with BeautifulSoup',
      'Critic / reviewer stage that scores and rewrites the draft',
      'Final synthesised answer with source attribution',
    ],
    results: [
      { label: 'Agents', value: '3', sub: 'research • extract • critique' },
      { label: 'Sources', value: 'Live', sub: 'fresh web results per query' },
      { label: 'Loop', value: 'Review', sub: 'critic pass before final answer' },
    ],
    github: 'https://github.com/rithikjaiswar',
    visual: 'agent',
    accent: 'violet',
    architecture: [
      'User query — the research question enters the graph',
      'Research agent — decomposes the question and plans searches (LangChain + Mistral)',
      'Web search — Tavily returns fresh, ranked sources',
      'Extraction — BeautifulSoup parses pages into clean text chunks',
      'Critic / reviewer — checks coverage, evidence and contradictions, requests revisions',
      'Final answer — synthesised summary with citations',
    ],
    workflow: [
      { title: 'Query', text: 'The question is parsed into sub-topics and required evidence.' },
      { title: 'Research', text: 'The research agent issues targeted Tavily searches.' },
      { title: 'Extract', text: 'BeautifulSoup turns raw HTML into clean, usable text.' },
      { title: 'Critique', text: 'The reviewer scores coverage and flags weak claims.' },
      { title: 'Revise', text: 'Gaps trigger another search round before approval.' },
      { title: 'Answer', text: 'A structured, cited final answer is returned to the user.' },
    ],
  },
  {
    id: 'video-summarizer',
    index: '05',
    title: 'AI Video Summarizer',
    headline: 'RAG pipeline that turns long video/audio content into grounded summaries.',
    problem:
      'Long lectures, talks and videos take hours to review, and asking a raw LLM about a video risks hallucinated answers with no grounding in the actual content.',
    solution:
      'Built a retrieval-based pipeline: extract audio, transcribe, chunk, embed into a vector store, retrieve relevant passages and generate a summary grounded in the transcript.',
    tech: ['Python', 'LangChain', 'RAG', 'Vector Store', 'yt-dlp'],
    features: [
      'Video/audio download with yt-dlp',
      'Audio extraction and speech-to-text transcription',
      'Intelligent chunking of the transcript',
      'Embeddings stored in a vector database',
      'RAG retrieval feeding the LLM with relevant passages',
      'Structured, citable summary output',
    ],
    results: [
      { label: 'Stages', value: '8', sub: 'video → grounded summary' },
      { label: 'Method', value: 'RAG', sub: 'retrieval-grounded generation' },
      { label: 'Store', value: 'Vectors', sub: 'semantic transcript search' },
    ],
    github: 'https://github.com/rithikjaiswar',
    visual: 'pipeline',
    accent: 'blue',
    architecture: [
      'Input — video or audio URL handled by yt-dlp',
      'Audio extraction — media converted to a transcription-ready stream',
      'Transcription — speech converted to raw text',
      'Chunking — transcript split into overlapping, meaningful passages',
      'Embeddings — each chunk vectorised',
      'Vector store — embeddings indexed for similarity search',
      'RAG — top-k passages retrieved per question',
      'AI summary — grounded answer generated from retrieved context only',
    ],
    workflow: [
      { title: 'Ingest', text: 'yt-dlp pulls the video and audio is extracted.' },
      { title: 'Transcribe', text: 'Audio becomes a full text transcript.' },
      { title: 'Chunk', text: 'Transcript is split into overlapping passages.' },
      { title: 'Embed', text: 'Passages become vectors in the store.' },
      { title: 'Retrieve', text: 'Relevant chunks are found for the request.' },
      { title: 'Summarise', text: 'LLM writes a summary strictly from retrieved text.' },
    ],
  },
]

/* ------------------------------------------------------------------ *
 * Demo series for the animated visuals.
 * Shapes are illustrative samples of the dashboard output; the only
 * published numeric results are the heart-disease model metrics.
 * ------------------------------------------------------------------ */
export const demoCharts = {
  revenueTrend: [
    { period: 'Jan', value: 62 },
    { period: 'Feb', value: 58 },
    { period: 'Mar', value: 71 },
    { period: 'Apr', value: 68 },
    { period: 'May', value: 82 },
    { period: 'Jun', value: 79 },
    { period: 'Jul', value: 94 },
    { period: 'Aug', value: 89 },
    { period: 'Sep', value: 103 },
    { period: 'Oct', value: 98 },
    { period: 'Nov', value: 116 },
    { period: 'Dec', value: 124 },
  ],
  churn: [
    { label: 'Retained', value: 74 },
    { label: 'Churned', value: 26 },
  ],
  repeatRate: [
    { period: 'Q1', value: 41 },
    { period: 'Q2', value: 46 },
    { period: 'Q3', value: 52 },
    { period: 'Q4', value: 57 },
  ],
  segments: [
    { label: 'Loyal', value: 28 },
    { label: 'Regular', value: 34 },
    { label: 'Occasional', value: 24 },
    { label: 'At risk', value: 14 },
  ],
  // Illustrative price path + prediction for the stock visual
  stock: [
    118, 121, 119, 124, 127, 125, 130, 134, 132, 137, 141, 138, 143, 147, 145, 150, 154, 152, 149,
    153, 157, 161, 158, 163, 167, 165, 170, 174, 172, 176, 181, 178, 183, 187, 185, 190, 194, 192,
    197, 201,
  ],
  stockPredicted: [
    118, 120, 120, 123, 126, 126, 129, 133, 133, 136, 140, 140, 143, 146, 146, 149, 153, 153, 151,
    153, 156, 160, 159, 162, 166, 166, 169, 173, 173, 176, 180, 179, 182, 186, 186, 189, 193, 193,
    196, 200,
  ],
} as const

/** Multi-agent 3D graph nodes — title + responsibility shown on hover. */
export const agentNodes = [
  {
    id: 'query',
    label: 'User Query',
    role: 'Takes the research question and defines what a good answer must include.',
  },
  {
    id: 'research',
    label: 'Research Agent',
    role: 'Breaks the question into sub-topics and plans the searches needed.',
  },
  {
    id: 'search',
    label: 'Web Search',
    role: 'Tavily returns fresh, ranked sources for each planned query.',
  },
  {
    id: 'extract',
    label: 'Data Extraction',
    role: 'BeautifulSoup parses the pages and keeps only the useful text.',
  },
  {
    id: 'critic',
    label: 'Critic / Reviewer',
    role: 'Checks coverage, evidence and contradictions — and requests revisions.',
  },
  {
    id: 'answer',
    label: 'Final Answer',
    role: 'Synthesises a structured, cited research summary for the user.',
  },
] as const

/** RAG pipeline stages for the AI Video Summarizer visual. */
export const pipelineSteps = [
  { id: 'video', label: 'Video', role: 'Source media from a URL via yt-dlp' },
  { id: 'audio', label: 'Audio Extraction', role: 'Media converted to a clean audio stream' },
  { id: 'transcript', label: 'Transcription', role: 'Speech converted into raw text' },
  { id: 'chunk', label: 'Chunking', role: 'Transcript split into overlapping passages' },
  { id: 'embed', label: 'Embeddings', role: 'Each chunk mapped to a dense vector' },
  { id: 'store', label: 'Vector Store', role: 'Vectors indexed for similarity search' },
  { id: 'rag', label: 'RAG', role: 'Top-k relevant passages retrieved per query' },
  { id: 'summary', label: 'AI Summary', role: 'Grounded summary written from retrieved context' },
] as const
