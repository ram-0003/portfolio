import { Project, Service, Skill, BlogPost, CaseStudy, SiteSettings } from "../types";

export const defaultSiteSettings: SiteSettings = {
  name: "Ramachandran S",
  title: "Building Web Applications & Automations That Replace Manual Work",
  subtitle: "I help businesses streamline operations through custom web applications, AI-powered solutions, and workflow automations that save time and eliminate repetitive tasks.",
  bio: "Experienced full-stack developer and solution architect specialized in identifying manual operational bottlenecks and replacing them with high-reliability automated pipelines, bespoke web tools, and cutting-edge artificial intelligence agents.",
  email: "ramachandran85966@gmail.com",
  phone: "+91 9080347710",
  whatsapp: "+91 9080347710",
  linkedin: "https://www.linkedin.com/in/ramchandrans/",
  github: "https://github.com/ramachandran-s",
  role: "Automation & Web Systems Architect",
  completedProjects: "45+",
  processesAutomated: "110+",
  techStackModules: "24+",
  hoursShaved: "340h"
};

export const defaultServices: Service[] = [
  {
    title: "Web Development",
    icon: "Globe",
    description: "Design and build fast, secure, responsive web applications modeled on modern design principles of Linear, Stripe and Vercel. Engineered to solve actual business operations.",
    benefits: [
      "Custom layouts tailored for target business client conversions",
      "Robust state management and real-time database synchronicities",
      "Interactive data visualizations, dark-theme modern aesthetic panels",
      "Lighthouse scores optimized for 95+ performance metrics"
    ],
    techStack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Next.js", "Express"],
    useCases: ["Custom CMS systems", "Customer relationship managers (CRM)", "SaaS dashboards", "Professional booking portals"],
    order: 1
  },
  {
    title: "Flutter App Development",
    icon: "Smartphone",
    description: "Build robust, high-performance, cross-platform mobile experiences utilizing Flutter, optimizing touch targets, offline state persistence, and beautiful UI/UX.",
    benefits: [
      "Intuitive navigation matching modern Google Material standards",
      "Background local storage sync for low-connectivity offline usability",
      "Immediate mobile capabilities push notification flows",
      "Lightweight package bundlings tailored for speed"
    ],
    techStack: ["Flutter", "Dart", "Firebase", "SQLite", "Riverpod"],
    useCases: ["Local offline survey collections", "On-the-go utility calculation apps", "Custom business inventory scanners"],
    order: 2
  },
  {
    title: "API Development",
    icon: "Cpu",
    description: "Integrate complex systems together using custom-engineered APIs, RESTful principles, secure tokens, and microservices backend routing.",
    benefits: [
      "High reliability and sub-100ms response times",
      "Extremely robust input validation guards and safety middlewares",
      "Integration-ready documentation structures",
      "Secure API token proxy management hiding secret credentials"
    ],
    techStack: ["Node.js", "Express", "PostgreSQL", "Firebase Admin", "Vercel Serverless"],
    useCases: ["Secure third-party Stripe integration proxies", "Data aggregation pipelines", "Bespoke webhook listeners"],
    order: 3
  },
  {
    title: "AI Integrations",
    icon: "Sparkles",
    description: "Supercharge your business software platforms with Gemini and OpenAI AI models. Automate classification, summary generation, and interactive intelligence tasks.",
    benefits: [
      "Automatic email response recommendations matching client tone",
      "Structured data extraction from messy invoices or attachments",
      "Preloaded prompt template chains for maximum relevance",
      "Cost-optimized token budgets using caching"
    ],
    techStack: ["Gemini Pro SDK", "OpenAI API", "Langchain", "Function Calling Agent pipelines"],
    useCases: ["Invoice document data extractors", "Automated customer inquiry classification", "Smart content drafts in CMS"],
    order: 4
  },
  {
    title: "n8n Automation",
    icon: "Workflow",
    description: "Establish robust, visual, self-hosted workflow node chains with n8n to pipe data effortlessly, connect custom webhooks, and trigger on complex schedules.",
    benefits: [
      "Complex conditionals and loop mechanisms",
      "No-code visual simplicity coupled with direct JS/Python formatting blocks",
      "Ultra-low operational overhead compared to custom coded microservices",
      "Webhook-triggered instant operational execution"
    ],
    techStack: ["n8n", "Webhooks", "JSON Web Tokens", "Node JS scripting"],
    useCases: ["Syncing Shopify checkouts to CRM", "Automating social media draft cross-posts", "Scheduled weekly customer report aggregates"],
    order: 5
  },
  {
    title: "Make.com Automation",
    icon: "Gauge",
    description: "Rapidly automate cross-cloud integrations using Make.com scenarios. Coordinate SaaS pipelines, Google Workspace APIs, and AI nodes to save hours each day.",
    benefits: [
      "Native integrations across 1000+ SaaS platforms",
      "Visual error handler routes for zero silent pipeline breaks",
      "Parallel module processing routes",
      "Budget friendly and scalable automation paths"
    ],
    techStack: ["Make.com (Integromat)", "SaaS REST APIs", "Google Sheets API", "Mailgun / SendGrid"],
    useCases: ["Drafting contracts from Google Form entries", "Pushing WhatsApp transactional alerts from Excel", "Syncing active calendar schedules from email confirmations"],
    order: 6
  },
  {
    title: "UI/UX Design",
    icon: "Palette",
    description: "Architect gorgeous, functional, dark-inspired software layout grids. Visual aesthetics heavily influenced by industry giants like Linear, Vercel, and Stripe.",
    benefits: [
      "Uncompromising visual hierarchies and strict aesthetic discipline",
      "Fluid typography scales emphasizing content readability",
      "Zero clutter layouts emphasizing raw function over flashy noise",
      "Reusable component design libraries for engineering scalability"
    ],
    techStack: ["Figma", "Tailwind", "Framer Motion", "Google Fonts / Space Grotesk"],
    useCases: ["Interactive dashboard prototypes", "SaaS landing page mockups", "Custom design systems for web portals"],
    order: 7
  }
];

export const defaultProjects: Project[] = [
  {
    title: "WriteJadhag",
    type: "Web Application",
    description: "WriteJadhag is a professional-grade web application designed specifically for astrologers. It automates complex horoscope and astrological calculations that are traditionally performed manually, helping astrologers save hours per client, eliminate calculation errors, and drastically improve service efficiency.",
    content: "### The Astrologist's Bottleneck\nTraditionally, astrologers spend 30 to 45 minutes manually refering to almanac charts (Panchanga data), drawing mathematical calculations, and drawing birth boards. This manual process is highly prone to human error, which directly compromises astrological readings. WriteJadhag was built to digitize and automate this entire operation, compiling complex astrological algorithms into a 2-second automated generation cycle.\n\n### Core System Architecture\nThe platform operates with a highly precise astronomical engine. By feeding in raw coordinates like birth location, time (UTC offset), and date, the software calculates planetary positions, houses, and planetary aspects instantly. Features also include dynamic multi-language horoscope reporting, local storage client saving, and PDF printing capabilities designed with crisp visual aesthetics.",
    features: [
      "Instant planetary position & coordinate calculations",
      "Automated birth chart (Kundali) layout generator",
      "Multi-panel client profiles database and search index",
      "Custom printable PDF report generator branded for individual astrologers",
      "Offline capabilities supporting consultations in low-connectivity areas"
    ],
    challenges: "The primary challenge was translating centuries-old, highly complex Sanskrit astronomical formulas and coordinate correction models (Ayanamsa calculations) into pixel-perfect precision code. Even a 1-degree coordinate variance produces an incorrect horoscope. Resolving this required meticulous debugging against traditional almanac charts and integrating robust mathematical solvers.",
    results: "Over 50+ independent astrologers use the system, shaving client preparation times down from 45 minutes to just under 3 seconds. Calculation errors have plummeted to 0%, resulting in higher accuracy consultations and streamlined business workflows.",
    demoUrl: "https://writejadhag-demo.example.com",
    githubUrl: "https://github.com/ramachandran-s/writejadhag",
    images: [
      "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop"
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Local Storage", "Sanskrit Astro Formula Solvers"],
    category: "Workflow Automation",
    featured: true,
    createdAt: "2026-01-15T12:00:00Z",
    updatedAt: "2026-01-20T12:00:00Z"
  }
];

export const defaultCaseStudies: CaseStudy[] = [
  {
    title: "Replacing Manual Spreadsheet Logs for a Logistics Center",
    slug: "logistics-spreadsheet-replacement",
    client: "ExpressCargo Logistics",
    description: "How a custom n8n workflow and Express dashboard replaced 4 hours of daily manual data entry, unifying Shopify, WhatsApp notifications, and Google Sheets APIs.",
    problem: "ExpressCargo manual agents spent hours copy-pasting order details across three different tools, causing frequent transcription slips, delayed shipping notifications, and massive customer service overhead.",
    solution: "Designed a serverless custom dashboard integrated with highly precise n8n workflow scenarios. Incoming Shopify checkouts automatically trigger custom webhooks that pipe raw JSON data to a secure database, validate addresses instantly, and push beautiful personalized SMS/WhatsApp tracking messages directly to customers.",
    process: "Mapped raw pipeline bottleneck points of warehouse workers. Created custom webhooks listening to order state changes. Configured a central dark-themed Express logistics monitor to track dispatch progress. Integrated n8n error-handling branches to alerts on invalid addresses.",
    results: "Manual data entering reduced from 4 hours daily to 0. Order fulfillment speed surged by 34%, and system transparency practically eliminated shipping transcription and notification delays.",
    lessons: "Complex, buggy operations are best solved not by throwing more human labor at it, but by establishing tightly integrated node flows that automate API communication directly.",
    coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
    images: [],
    techStack: ["n8n.io", "Express API", "Shopify Webhooks", "WhatsApp Business API", "PostgreSQL"],
    createdAt: "2026-03-10T12:00:00Z"
  }
];

export const defaultBlogPosts: BlogPost[] = [
  {
    title: "How to Build n8n Workflows That Scale Without Breaking",
    slug: "how-to-scale-n8n-workflows",
    summary: "A masterclass in organizing robust automation pipelines, setting up sub-workflows, configuring visual error routers, and keeping memory usage optimized.",
    content: "### The Growth of Business Automation\nAutomating business operations via tools like n8n can feel like magic. You connect nodes, drag webhooks, and watch data flow. However, as business scale increases and you handle hundreds of workflows every day, simple node connections tend to break. Unhandled exceptions, rate limits, and nested loops can log-jam the entire operational pipeline.\n\n### 1. Build Autonomous Sub-Workflows\nNever build a singular 'mega-workflow' that executes more than 20 separate actions. Instead, use the 'Execute Workflow' node to build composable micro-pipelines. For example, have a master 'Order Received' webhook that simply routes dispatch tasks to independent 'Send WhatsApp Notification', 'Write to Spreadsheet', and 'Update Inventory' sub-workflows.\n\nThis isolation makes debugging incredibly simple. If a spreadsheet API rate-limit halts, the notifications and inventory updates still complete perfectly.\n\n### 2. Configure Visual Error Router Branches\nEvery active SaaS production pipeline needs a safety net. In n8n, configure the 'Error Trigger' node. When any step fails, this node will redirect the exception payload to a designated Slack or Discord developer channel with detailed log states.\n\nThis turns silent failures into active notifications, allowing you to patch API token adjustments before client operations suffer.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    category: "Workflow Automation",
    tags: ["n8n", "Webhooks", "DevOps", "Automation"],
    readingTime: "4 min read",
    status: "published",
    createdAt: "2026-05-18T12:00:00Z",
    updatedAt: "2026-05-18T12:00:00Z"
  }
];

export const defaultSkills: Skill[] = [
  // Web Development
  { name: "React", category: "Web Development", level: 95, order: 1 },
  { name: "TypeScript", category: "Web Development", level: 90, order: 2 },
  { name: "Vite & SPA Architecture", category: "Web Development", level: 92, order: 3 },
  { name: "Next.js", category: "Web Development", level: 85, order: 4 },
  { name: "Tailwind CSS", category: "Web Development", level: 98, order: 5 },
  // Mobile app Development
  { name: "React Native", category: "Mobile App Development", level: 80, order: 6 },
  { name: "Flutter (Dart)", category: "Mobile App Development", level: 90, order: 7 },
  // API Development
  { name: "Node.js (Express)", category: "API / Backend", level: 90, order: 8 },
  { name: "PostgreSQL", category: "API / Backend", level: 82, order: 9 },
  { name: "Firestore (Firebase Auth)", category: "API / Backend", level: 88, order: 10 },
  // AI Integrations
  { name: "Gemini SDK API", category: "AI / Smart Integrations", level: 85, order: 11 },
  { name: "OpenAI API", category: "AI / Smart Integrations", level: 88, order: 12 },
  { name: "Structured Data Extraction (JSON Schema)", category: "AI / Smart Integrations", level: 90, order: 13 },
  // Workflow Automation
  { name: "n8n.io", category: "Workflow Automation", level: 95, order: 14 },
  { name: "Make.com (Integromat)", category: "Workflow Automation", level: 92, order: 15 },
  { name: "Webhook & API Brokerage", category: "Workflow Automation", level: 96, order: 16 }
];
