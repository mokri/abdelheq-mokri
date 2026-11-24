/**
 * Initial portfolio content, ported from legacy/index.html.
 *
 * Used for two things:
 *  1. `npm run seed` upserts it into Supabase (stable ids → re-running is safe).
 *  2. When Supabase env vars are missing, the public site renders from it
 *     directly so the site still works locally / before the DB is set up.
 */
import type {
  Award,
  Certification,
  Experience,
  Post,
  Profile,
  Project,
  Publication,
  Skill,
  SkillGroup,
  Startup,
} from "@/lib/types";

/** Deterministic UUID: table prefix (1–9) + row number. */
const sid = (table: number, n: number) =>
  `00000000-0000-4000-800${table}-${String(n).padStart(12, "0")}`;

export const seedProfile: Profile = {
  id: 1,
  name_first: "Abdelheq",
  name_last: "Mokri",
  initials: "AM",
  hero_label: "Senior AI Engineer & PhD Researcher",
  typewriter_lines: [
    "Senior AI Engineer @ UST",
    "PhD Researcher in AI",
    "Agentic Systems Builder",
    "Relentless Builder × 11",
  ],
  hero_stats: [
    { value: "10+", label: "Years Building" },
    { value: "11", label: "Startup Attempts" },
    { value: "+$250K", label: "Cost Savings" },
    { value: "Stanford", label: "AI Lab Collab" },
  ],
  about_role: "// Senior AI Engineer · PhD Candidate",
  about_tags: ["AI", "Data Science", "Machine Learning", "AI Privacy"],
  about_stats: [
    { value: "2023", label: "PhD Started" },
    { value: "2026", label: "PhD Expected" },
    { value: "2", label: "Publications" },
    { value: "3×", label: "YC Applicant" },
  ],
  bio_md: `I'm a **Senior AI Engineer at UST** and a **PhD researcher** at Abou Bekr Belkaid University, working at the intersection of deep learning, differential privacy, and production agentic systems. My career has always blurred the line between research and shipping — I was building function-calling voice agents over bare WebSocket connections **before OpenAI released the feature**.

I've collaborated with **Stanford AI Lab** on NL2SQL agentic research, architected systems projected to save **$250K/year**, and applied to **Y Combinator three times**. Each failed startup taught me something a textbook couldn't. I believe the best AI systems are built by people who understand both the math and the market.

Currently pursuing a PhD in AI while working full-time — because curiosity doesn't wait for convenient timing.`,
  timeline: [
    { date: "OCT 2024 – PRESENT", role: "Senior AI Engineer", org: "UST · Aliso Viejo, CA (Remote)" },
    { date: "FEB 2023 – PRESENT", role: "PhD Researcher — Artificial Intelligence", org: "Abou Bekr Belkaid University" },
    { date: "JUN 2023 – OCT 2024", role: "AI Engineer", org: "Yobi · Los Gatos, CA (Remote)" },
    { date: "2022 – 2023", role: "Product Owner → Full-Stack Dev", org: "LemsaInnov · Algeria" },
    { date: "2018 – 2022", role: "Freelance ML & Software Engineer", org: "Independent · Algeria" },
  ],
  research_keywords: [
    "Differential Privacy", "Deep Learning", "Agentic AI", "Large Language Models",
    "RL Post-Training", "NL2SQL", "Privacy-Utility Trade-offs", "DP-SGD", "Medical AI",
    "Multi-Agent Systems", "RAG", "Attention Mechanisms", "Benchmarking", "Context Compression",
  ],
  startups_footnote:
    "**Why show the failures?** Because building before you know how to build is how you learn to build. Each attempt compressed years of insight. The voice agent, the NL2SQL framework, the agentic pipelines — none of them would exist without the discipline forged in those 11 bets.",
  contact_heading: "Let's build something\nthat matters.",
  contact_sub: "// open to roles, research collaborations, and ambitious ideas",
  contact_links: [
    { icon: "✉️", label: "Email", value: "abdelhakmokri\n@gmail.com", href: "mailto:abdelhakmokri@gmail.com" },
    { icon: "💼", label: "LinkedIn", value: "abdelheq-mokri", href: "https://linkedin.com/in/abdelheq-mokri-b55425160" },
    { icon: "🐙", label: "GitHub", value: "github.com/mokri", href: "https://github.com/mokri" },
    { icon: "🌐", label: "Portfolio", value: "mokri.github.io", href: "https://mokri.github.io/abdelheq-mokri/" },
    { icon: "📘", label: "Facebook", value: "ABDELHAKMOKRI", href: "https://www.facebook.com/ABDELHAKMOKRI/" },
    { icon: "📸", label: "Instagram", value: "@abdelhakmokri", href: "https://www.instagram.com/abdelhakmokri/" },
    { icon: "🐦", label: "Twitter / X", value: "@abdelhakmokri", href: "https://twitter.com/abdelhakmokri" },
  ],
  avatar_url: null,
  resume_url: "/resume/Abdelheq-Mokri-Resume.pdf",
  seo_title: "Abdelheq Mokri — AI Engineer & Researcher",
  seo_description:
    "Senior AI Engineer at UST and PhD researcher building agentic AI systems, NL2SQL agents, and privacy-preserving deep learning.",
};

const base = (table: number, n: number) => ({ id: sid(table, n), sort_order: n, published: true });

export const LEMSA_ID = sid(1, 3);

export const seedExperiences: Experience[] = [
  {
    ...base(1, 1),
    company: "UST",
    dates: "Oct 2024 – Present",
    employment_type: "Full-time · Remote",
    role: "Senior AI Engineer (Lead I / Data Scientist)",
    description: `- Run delivery on an **AI-driven development lifecycle (AI-DLC)**: agents migrate legacy .NET 4 → .NET 8 and COBOL monoliths to React + Java Spring Boot, generating Nx monorepos from specs that land ~95% functional — **70% faster delivery at 60% of the cost**.
- Reimagining a **NextGen Reinsurance Platform** spec-first with SpecKit; the MVP is already working.
- Architected and lead **BSA DataMap**, agentic data profiling into BigQuery that saves **2 FTEs (~$250K/year)**.
- Architect and lead the **ETL Test Agent**, which automates the design, generation, execution and tracking of data-validation tests for ETL interfaces, with results checked by LLM-as-a-Judge — projected to cut manual testing effort by **~70%**.
- Architecting and leading **Contracts & Booklets**, agentic automation of IBC's manual contract and booklet creation from Front Office System (FOS) and Product Configurator (PC) data — projected to take turnaround from days to hours (**~80% less manual effort**).
- Delivered **RegView**, natural-language search over regulatory documents, and a **RAG-powered RFI/RFP engine** that cut proposal time by **60%**.
- Collaborating with **Dr. Tatsunori Hashimoto (Stanford AI Lab)** on Text-to-SQL research (ongoing).`,
    tags: ["Agentic AI", "AI-DLC", "SpecKit", "Google ADK", "LangGraph", "RAG", "LLM-as-a-Judge", "GCP / BigQuery", "AWS Bedrock", "Text-to-SQL"],
  },
  {
    ...base(1, 5),
    sort_order: 2,
    company: "Abou Bekr Belkaid University",
    dates: "Feb 2023 – Present",
    employment_type: "PhD research · Tlemcen",
    role: "PhD Researcher — Privacy-Preserving AI",
    description: `- Lead doctoral research at the intersection of **privacy-preserving deep learning, differential privacy (DP) and federated learning (FL)** — building trustworthy medical AI that keeps diagnostic performance while protecting patient data.
- Designed and evaluated a privacy-preserving framework for **diabetic retinopathy classification**, combining state-of-the-art vision architectures, DP and federated optimization across distributed medical-imaging datasets.
- Benchmarked large vision foundation models (**EVA-02 Giant, SwinV2-Huge**) as frozen feature extractors with downstream DenseNet classifiers on four retinal datasets: APTOS, IDRiD, Messidor-1200 and Messidor-2.
- Study the **privacy–utility trade-off**: how privacy mechanisms affect accuracy, generalization and robustness in centralized vs. distributed training.`,
    tags: ["Differential Privacy", "Federated Learning", "Medical AI", "EVA-02", "SwinV2", "DenseNet", "PyTorch"],
  },
  {
    ...base(1, 2),
    sort_order: 3,
    company: "Yobi",
    dates: "Jun 2023 – Oct 2024",
    employment_type: "Full-time · Remote (CA)",
    role: "AI Engineer",
    description:
      "Engineered real-time voice AI agents over WebSockets + Azure Cognitive Services — building function-calling architectures before the paradigm existed in mainstream LLM APIs. Developed sentiment analysis, multilingual translation, and automated transcription pipelines. Designed scalable conversational AI backend for global customer workflows with structured memory and human-escalation policies.",
    tags: ["Voice AI", "Azure Cognitive", "WebSockets", "Sentiment Analysis", "Real-time NLP", "Python"],
  },
  {
    ...base(1, 3),
    sort_order: 4,
    company: "LemsaInnov",
    dates: "Oct 2022 – Jun 2023",
    employment_type: "Full-time · Algeria",
    role: "Product Owner → Full-Stack Developer",
    description:
      "Led cross-functional product strategy and execution. Built cross-platform applications using Flutter, React Native, Next.js, and Vue.js. Transitioned from technical builder to product strategist, developing the business acumen that shapes how I now build AI products — with both user empathy and engineering discipline.",
    tags: ["Product Strategy", "Flutter", "Next.js", "React Native", "Vue.js"],
  },
  {
    ...base(1, 4),
    sort_order: 5,
    company: "Freelance",
    dates: "2018 – 2022",
    employment_type: "Independent · Algeria",
    role: "ML Engineer & Software Developer",
    description:
      "Built and deployed machine learning models for complex business problems. Developed desktop and web applications in C#, PyQt, PHP, and JavaScript. Four years of self-directed, client-facing engineering work — building the discipline to ship independently that now accelerates every team I join.",
    tags: ["Machine Learning", "Python", "C#", "PyQt", "Deep Learning", "PHP"],
  },
];

const project = (
  n: number,
  p: Partial<Project> & Pick<Project, "title" | "slug" | "kind" | "description">,
): Project => ({
  ...base(2, n),
  experience_id: null,
  year: "",
  label: "",
  role: "",
  country: "",
  highlight: "",
  icon: "",
  cover_image: null,
  gallery: [],
  tags: [],
  url: null,
  ...p,
});

export const seedProjects: Project[] = [
  // ── Flagship ──
  project(1, {
    kind: "flagship", title: "DataMap Co-Pilot", slug: "datamap-co-pilot", label: "AGENTIC TOOL", icon: "🗺️",
    description: "Agentic AI tool that autonomously profiles enterprise data sources, infers semantic schemas, and generates BigQuery mapping configs — replacing manual BSA workflows entirely. Features tool-routing, structured cross-run memory, and confidence-gated human-in-the-loop escalation.",
    highlight: "Projected $250K annual savings · 2 FTE equivalent",
    tags: ["Google ADK", "GCP", "BigQuery", "Multi-step Agent", "Python"],
  }),
  project(2, {
    kind: "flagship", title: "NL2SQL Agentic Framework", slug: "nl2sql-agentic-framework", label: "RESEARCH COLLABORATION", icon: "🔬",
    description: "Co-designed with Stanford AI Lab — a Text-to-SQL agent with closed-loop self-correction: the agent generates SQL, executes it, detects semantic errors, and refines via chain-of-thought reasoning. Ran quantitative experiments comparing zero-shot, CoT, and self-refine strategies across multiple LLMs.",
    highlight: "Stanford AI Lab Collaboration · Benchmark Construction",
    tags: ["LLMs", "NL2SQL", "Self-Correction", "Eval Pipeline", "CoT"],
  }),
  project(3, {
    kind: "flagship", title: "CodeCrafter", slug: "codecrafter", label: "GENAI PIPELINE", icon: "⚙️",
    description: "GenAI-driven framework that decomposes legacy codebases into dependency graphs and auto-generates microservice migration plans. Migrated complex systems (.NET4 → .NET8, COBOL → React/Java). Engineered context-compression strategies to handle arbitrarily large codebases within LLM windows.",
    highlight: "Secured client contracts · Production-grade modernization",
    tags: ["GenAI", "LLMs", "Context Compression", ".NET / COBOL", "Microservices"],
  }),
  project(4, {
    kind: "flagship", title: "Speech-to-Speech Voice Agent", slug: "speech-to-speech-voice-agent", label: "REAL-TIME SYSTEM", icon: "🎙️",
    description: "Real-time voice AI agent over WebSockets + Azure Cognitive Services — built before OpenAI released function calling. Agent collects structured data across turns, maintains persistent session memory, and escalates to human operators via confidence thresholds. Deployed at scale for global customer workflows.",
    highlight: "Built before the paradigm existed · Global production scale",
    tags: ["Voice AI", "WebSockets", "Azure", "Structured Memory", "Real-time"],
  }),

  // ── Client work under LemsaInnov ──
  project(10, {
    kind: "client", experience_id: LEMSA_ID, title: "Evology.ai", slug: "evology-ai", year: "2022", country: "Slovenia",
    role: "AI Backend Engineer", icon: "🎨", cover_image: "/images/projects/evology.png",
    description: "Built the AI service on the backend that generates images with OpenAI's DALL·E — prompt handling, generation pipeline and delivery of the results to the product.",
    tags: ["OpenAI DALL·E", "Generative AI", "Backend", "API"],
  }),
  project(11, {
    kind: "client", experience_id: LEMSA_ID, title: "OPU — University Publications Office", slug: "opu", year: "2022", country: "Algeria",
    role: "Product Owner", icon: "📚", cover_image: "/images/projects/opu.png",
    description: "Product Owner for the University Publications Office platform. Managed a team of 2 full-stack developers and a QA engineer — backlog, specs, sprint planning and releases.",
    tags: ["Product Ownership", "Scrum", "Team Lead"],
  }),
  project(12, {
    kind: "client", experience_id: LEMSA_ID, title: "SellForms", slug: "sellforms", year: "2022", country: "USA",
    role: "Product Owner", icon: "📝", cover_image: "/images/projects/sellforms.png",
    description: "Product Owner for SellForms. Managed a team of 2 full-stack developers and a QA engineer, translating client requirements into a prioritized backlog and shipping releases.",
    tags: ["Product Ownership", "Scrum", "Team Lead"],
  }),
  project(13, {
    kind: "client", experience_id: LEMSA_ID, title: "&Arise", slug: "and-arise", year: "2022", country: "USA",
    role: "Product Owner", icon: "🌅", cover_image: "/images/projects/and-arise.png",
    description: "Product Owner for &Arise. Managed a team of 2 full-stack developers and a QA engineer from discovery through delivery.",
    tags: ["Product Ownership", "Scrum", "Team Lead"],
  }),
  project(14, {
    kind: "client", experience_id: LEMSA_ID, title: "Coordate", slug: "coordate", year: "2022", country: "France",
    role: "Full-Stack Mobile Developer", icon: "📱", cover_image: "/images/projects/coordate.png",
    description: "Built the Coordate mobile app end-to-end with Flutter, shipped on both Android and iOS.",
    tags: ["Flutter", "Dart", "Android", "iOS"],
  }),
  project(15, {
    kind: "client", experience_id: LEMSA_ID, title: "Primrecrut", slug: "primrecrut", year: "2022", country: "France",
    role: "Backend Developer", icon: "🧑‍💼", cover_image: "/images/projects/primrecrut.png",
    description: "Built the backend of the Primrecrut recruitment platform with Django.",
    tags: ["Django", "Python", "REST API", "PostgreSQL"],
  }),

  // ── Archive ──
  ...([
    ["2023", "🚚", "Reffiled — Delivery Platform", "A delivery solution connecting customers with local couriers. Cross-platform mobile app built with Flutter and Dart for Android, featuring real-time order tracking and courier matching.", ["Flutter", "Dart", "Android"]],
    ["2023", "👥", "Team Management Web App", "Data-driven management web app for tracking team performance and resources. Built with Streamlit and Python, backed by Pyrebase/Firebase for real-time data sync and collaborative workflows.", ["Streamlit", "Python", "Firebase", "Pyrebase"]],
    ["2022", "🏠", "Aladdine — Local Services Platform", "One-stop platform for finding and booking trusted local service providers for various household and personal tasks. An early marketplace idea connecting skilled workers with customers in Algeria.", ["Marketplace", "Platform", "Local Services"]],
    ["2022", "😷", "Face Match — Facial Recognition Auth", "Facial recognition authentication app built with Flutter for Android, leveraging Google ML Kit's face recognition APIs. Explored biometric authentication flows and on-device ML inference.", ["Flutter", "Android", "ML Kit", "Face Recognition"]],
    ["2022", "📐", "Project Management for Architects", "A project management solution tailored for architecture firms — tracking milestones, resources, and deliverables specific to architectural workflows and construction project lifecycles.", ["Project Management", "Web App", "Architecture"]],
    ["2021", "🔒", "Watermarking & Image Encryption", "Desktop server/client application to watermark and encrypt images using AES encryption, then transmit them securely from server to client where they can be decrypted. Built with Python and PyQt5.", ["Python", "PyQt5", "AES", "Cryptography"]],
    ["2021", "🖼️", "Image Enhancement & Feature Detection", "Image enhancement and feature detection pipeline using OpenCV and PyTorch with GANs. Interactive Streamlit app for applying super-resolution, edge detection, and feature extraction with real-time visualization.", ["Python", "Streamlit", "OpenCV", "PyTorch", "GANs"]],
    ["2021", "📈", "Stock Price Prediction Web App", "Streamlit web app predicting stock prices using scikit-learn regression models. Features interactive charts built with Plotly, Pandas data pipelines, and a user-selectable stock ticker interface.", ["Python", "Streamlit", "scikit-learn", "Plotly", "Pandas"]],
    ["2021", "💹", "Stock Price Prediction (CLI)", "Predicted next-day stock prices using polynomial regression on previous day's data. A focused experiment in time-series regression with scikit-learn — keeping it lean to understand the fundamentals.", ["Python", "scikit-learn", "Regression", "ML"]],
    ["2021", "✨", "Super Resolution GAN", "Generative Adversarial Network for image super-resolution, upscaling low-resolution images using a ResNet-based generator and VGG19 perceptual loss. Implemented from scratch in PyTorch with Torchvision and NumPy.", ["Python", "PyTorch", "GANs", "ResNet", "VGG19", "CNN"]],
    ["2020", "🤖", "ML Classification Web App", "Interactive machine learning web app for binary classification using Streamlit. Users can select different classification algorithms and tune hyperparameters in real time — zero coding required. Early work in making ML accessible.", ["Python", "Streamlit", "ML", "Classification"]],
    ["2020", "🧠", "Autoencoders with TensorFlow & Keras", "Neural network for encoding and decoding image data using TensorFlow and Keras. Explored autoencoders for feature compression and noise reduction — a deep dive into unsupervised representation learning.", ["Python", "TensorFlow", "Keras", "Autoencoders"]],
    ["2020", "🔬", "Autoencoders with PyTorch", "Reduced image resolution using convolutional autoencoders for prediction tasks in PyTorch. A companion to the Keras version — comparing frameworks and understanding CNN-based compression architectures.", ["Python", "PyTorch", "Autoencoders", "CNN", "Deep Learning"]],
    ["2020", "📉", "Dimensionality Reduction with Autoencoder", "Explored autoencoders vs PCA for dimensionality reduction. Generated high-dimensional dummy datasets, trained baseline PCA and scikit-learn autoencoder models, and evaluated with clustering strength metrics.", ["Python", "Autoencoders", "PCA", "scikit-learn"]],
    ["2019", "🏥", "Clinic Dashboard — Patient Management", "Full-stack patient management dashboard for educational institutions. Built with PHP and Laravel following MVC architecture — handling records, appointment scheduling, and administrative workflows.", ["PHP", "Laravel", "MVC", "HTML", "CSS"]],
    ["2019", "📱", "Instagram Auto Liker Bot", "Python automation bot for liking images on Instagram — one of the earliest automation experiments. Built with Python and shell scripting, this project planted the seeds for the agentic systems thinking that defines work today.", ["Python", "Shell", "Automation"]],
    ["2018", "✈️", "Travel App UI with Flutter", "Polished travel application UI built with Flutter and Dart for Android. An early exploration of cross-platform mobile development — smooth animations, card-based layouts, and thoughtful UX before AI was the focus.", ["Flutter", "Dart", "Android", "UI/UX"]],
  ] as const).map(([year, icon, title, description, tags], i) =>
    project(20 + i, {
      kind: "archive",
      year,
      icon,
      title,
      slug: title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description,
      tags: [...tags],
    }),
  ),
];

export const seedPublications: Publication[] = [
  {
    ...base(3, 1),
    venue: "IC2SDA 2025 · First-authored",
    title: "Comprehensive Empirical Study on Privacy-Utility Trade-offs in Deep Learning Architectures",
    abstract: "Systematic comparison of neural network architectures under differential privacy constraints (DP-SGD) across multiple privacy budgets and datasets. Analyzes convergence stability, gradient behavior, and utility preservation across CNNs, ResNets, and attention-based models.",
    authors: "Abdelheq Mokri et al.",
    year: "2025",
    pdf_url: null,
    doi_url: null,
  },
  {
    ...base(3, 2),
    venue: "ISPR 2025",
    title: "A Squeeze and Excitation Network for Dementia Grades Prediction",
    abstract: "Attention-based deep learning model for multi-class cognitive health assessment from medical imaging. Leverages channel-wise feature recalibration via Squeeze-and-Excitation blocks to improve diagnostic accuracy for dementia severity grading.",
    authors: "Abdelheq Mokri et al.",
    year: "2025",
    pdf_url: null,
    doi_url: null,
  },
];

export const seedStartups: Startup[] = (
  [
    ["2014", "🚬", "Cessation Lip Balm", "HealthTech", "Nicotine-degrading balm (1mg → 0mg) to quit smoking naturally. Chemistry meets behavioral psychology.", ""],
    ["2016", "🌲", "Forest Fire Swarm", "IoT · Climate", "IoT sensor swarm for early fire detection and prediction in forests. Climate tech before it was fashionable.", ""],
    ["2018", "⚡", "Energy Speed Bumps", "Clean Energy", "Piezo-electric speed bumps harvesting kinetic energy from passing vehicles. Roads as power plants.", ""],
    ["2019", "🎓", "Student–Company Platform", "EdTech", "Connecting companies with students through practical certification courses. Closing the gap between academia and industry.", ""],
    ["2020", "🔧", "TaskRabbit Algeria", "Marketplace", "Localized marketplace for services and manual labor in Algeria. Bringing the gig economy to North Africa.", ""],
    ["2021", "🏃", "SportCom", "Social · Sports", "Social app for athletes to find partners and organize local tournaments. Community-first sports networking.", ""],
    ["2022", "🤖", "TaskGPT", "AI Agents · LLM", "AI Product Owner that generates task lists and acceptance criteria from specs. The first agent I shipped — before \"agent\" was the word.", ""],
    ["2023", "🌾", "Parallel Cable Ag-Robot", "AgriTech · Robotics", "Precision agriculture robot using parallel cable systems for autonomous field traversal. Robotics meets farming.", ""],
    ["2024", "📊", "Datix", "Data · AI", "Instant AI-powered data apps from CSV/Excel uploads. No-code data analysis for non-technical users.", ""],
    ["2024", "📜", "Arabic Doc Platform", "NLP · Arabic", "NLP platform for parsing and extracting structured data from complex Arabic documents. Underserved language, real market need.", ""],
    ["2025", "🏙️", "Agentic Real Estate", "AI Agents · PropTech", "AI agents searching 24/7 for Dubai real estate opportunities. Persistent autonomous agents doing work while you sleep.", "Current Focus"],
  ] as const
).map(([year, emoji, name, domain, description, note], i) => ({
  ...base(4, i + 1),
  year,
  emoji,
  name,
  domain,
  description,
  note,
}));

export const seedAwards: Award[] = [
  {
    ...base(9, 1),
    icon: "🥈",
    title: "2nd Place — Fix It Forward with Claude",
    issuer: "UST D3",
    year: "2026",
    description: "Placed second in UST D3's “Fix It Forward with Claude” challenge.",
    url: "https://www.d3.ust.com/fix-it-forward-with-claude",
  },
  {
    ...base(9, 2),
    icon: "📰",
    title: "Featured in Handprints of UST — “The View from Above”",
    issuer: "UST",
    year: "2026",
    description:
      "Profiled in Handprints of UST, a collection of associate stories built around the five tenets of the UST Handprint framework — from the farms of Tlemcen to AI research with the Stanford AI Lab.",
    url: "https://www.ust.com/en/handprints-of-ust/the-view-from-above",
  },
  {
    ...base(9, 3),
    icon: "🏆",
    title: "Best Presentation — Deep Learning & AI Safety",
    issuer: "University of Tlemcen · Faculty of Sciences",
    year: "2025",
    description:
      "Won best presentation in the Computer Science department, then at the Faculty of Sciences — representing the faculty across the University of Tlemcen.",
    url: null,
  },
  {
    ...base(9, 4),
    icon: "🏅",
    title: "Best Poster Presentation",
    issuer: "University of Tlemcen · Computer Science Department",
    year: "2024",
    description: "Represented the Computer Science department in the finals.",
    url: null,
  },
];

export const seedSkillGroups: SkillGroup[] = [
  { ...base(5, 1), title: "AI & Research" },
  { ...base(5, 2), title: "Engineering" },
  { ...base(5, 3), title: "Platforms & Tools" },
];

export const seedSkills: Skill[] = (
  [
    [1, "LLMs / Agentic Systems", "Fluent", 95],
    [1, "PyTorch / Deep Learning", "Advanced", 90],
    [1, "RAG Systems", "Fluent", 90],
    [1, "Differential Privacy", "Advanced", 85],
    [1, "LangGraph / LangChain", "Advanced", 85],
    [1, "RL / RLHF", "Proficient", 75],
    [2, "Python", "Fluent", 95],
    [2, "Next.js / React", "Advanced", 85],
    [2, "Docker / Kubernetes", "Advanced", 80],
    [2, "PostgreSQL / BigQuery", "Advanced", 80],
    [2, "Flutter / Mobile", "Proficient", 75],
    [2, "WebSockets / Real-time", "Advanced", 85],
    [3, "AWS (Bedrock, Textract)", "Advanced", 85],
    [3, "Google Cloud Platform", "Advanced", 85],
    [3, "Google ADK", "Fluent", 90],
    [3, "Azure Cognitive Services", "Advanced", 80],
    [3, "JAX / Hugging Face", "Proficient", 75],
    [3, "n8n / Workflow Automation", "Advanced", 80],
  ] as const
).map(([g, name, level_label, percent], i) => ({
  ...base(6, i + 1),
  group_id: sid(5, g),
  name,
  level_label,
  percent,
}));

const CERT = "https://abdelhakmokri.pythonanywhere.com/media/certificates/";

export const seedCertifications: Certification[] = (
  [
    ["Johns Hopkins University", "Calculus through Data & Modeling", "Applications-oriented study of mathematical topics for single and multivariable calculus. Focus on modeling and analysis of data using polynomial, exponential, logarithmic, and trigonometric functions.", "Dec 2021", "Calculus_through_Data__Modeling.pdf"],
    ["University of Washington", "Machine Learning Foundations: A Case Study Approach", "Hands-on ML case studies: predicting house prices, sentiment analysis, document retrieval, product recommendation, and image search — applying ML methods across diverse domains.", "May 2020", "Machine_Learning_Fou_ndations.pdf"],
    ["Coursera", "Machine Learning: Regression", "Regularized linear regression for prediction and feature selection. Covers handling large feature sets, outlier impact on models, and optimization algorithms that scale to large datasets.", "Jul 2020", "Machine_Learning_Regression.pdf"],
    ["Coursera", "Dimensionality Reduction using an Autoencoder in Python", "Generating high-dimensional datasets, training autoencoders vs PCA baselines, extracting the encoder for dimensionality reduction, and applying clustering strength metrics.", "May 2020", "D_imensionality_Redu_ction_u_sing_an_Au_toencoder.pdf"],
    ["Coursera", "Tweet Emotion Recognition with TensorFlow", "Built a recurrent neural network trained on a 6-class tweet emotion dataset — a multi-class NLP classification problem using TensorFlow as the ML framework.", "Nov 2021", "Tw_eet_Emotion_Recognition.pdf"],
    ["Coursera", "Build a Data Science Web App with Streamlit and Python", "Loading, exploring, visualizing, and interacting with data; generating interactive dashboards in under 100 lines of Python code using Streamlit.", "Jul 2020", "Builda_Data_Science_Web_App_with_Streamlit.pdf"],
    ["Coursera", "Build a Machine Learning Web App with Streamlit and Python", "Interactive ML web app allowing users to choose classification algorithms and set hyperparameters dynamically — zero web dev experience required. Full pipeline from data to model to UI.", "May 2020", "Bu_ild_a_Machine_Learning_Web_App_w_ith_Streamlit.pdf"],
    ["Coursera", "PyCaret: Anatomy of Regression", "Setting up PyCaret environments, creating and comparing multiple models, tuning without exhaustive search, creating model visuals, and interpreting models with SHAP — in just a few lines of code.", "Nov 2021", "PyCaret_Anatomy_of_Regression.pdf"],
    ["Coursera", "Predicting House Prices with Regression using TensorFlow", "Keras + TensorFlow fundamentals applied to a regression task — creating, training, and evaluating a neural network for house price prediction with high accuracy.", "May 2020", "Predicting_Hou_se_Prices_w_ith_Regression_u_sing_TensorFlow.pdf"],
    ["Coursera", "Linear Regression with NumPy and Python", "Implementing gradient descent and linear regression from scratch — no scikit-learn or statsmodels — to develop a deep understanding of the fundamentals of learning algorithms.", "May 2020", "Linear_Regression_w_ith_Nu_mPy_and_Python.pdf"],
    ["Coursera", "Stock Price Prediction using Facebook Prophet: Tesla Case Study", "Built a Facebook Prophet model to forecast Tesla's stock price 30 days ahead. Visualized historical performance with Plotly, evaluated against real Google Finance data, and explored key financial metrics.", "Oct 2021", "Tesla_Stock_Price_Prediction_u_sing_Facebook_Prophet.pdf"],
    ["Coursera / OpenCV", "Computer Vision — Image Basics with OpenCV and Python", "Foundational computer vision: image representation, pixel manipulation, color spaces, and core OpenCV operations in Python — the entry point to visual AI.", "2020", null],
  ] as const
).map(([issuer, title, description, date_label, file], i) => ({
  ...base(7, i + 1),
  issuer,
  title,
  description,
  date_label,
  pdf_url: file ? CERT + file : null,
}));

export const seedPosts: Post[] = [
  {
    id: sid(8, 1),
    title: "Hello, world — why this blog exists",
    slug: "hello-world",
    excerpt: "Notes from building agentic systems in production while doing a PhD on privacy-preserving deep learning.",
    content_md: `I've spent the last few years shipping agentic AI systems while doing a PhD on **differential privacy**. This blog is where I'll write down what I learn along the way.

## What to expect

- Field notes on building **multi-agent systems** that survive production
- Paper summaries from my research on privacy-utility trade-offs
- Post-mortems from the 11 startups I've tried

## A tiny example

\`\`\`python
def dp_sgd_step(grads, clip_norm, noise_multiplier):
    clipped = [g / max(1, g.norm() / clip_norm) for g in grads]
    noise = torch.randn_like(clipped[0]) * noise_multiplier * clip_norm
    return sum(clipped) / len(clipped) + noise / len(clipped)
\`\`\`

The privacy guarantee is $(\\varepsilon, \\delta)$-DP, where smaller $\\varepsilon$ means stronger privacy.
`,
    cover_image: null,
    tags: ["meta", "agents", "privacy"],
    status: "published",
    published_at: "2026-11-23T00:00:00.000Z",
    reading_minutes: 1,
    created_at: "2026-11-23T00:00:00.000Z",
    updated_at: "2026-11-23T00:00:00.000Z",
  },
];
