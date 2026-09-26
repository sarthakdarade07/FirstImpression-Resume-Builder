/**
 * Rich sample resume data for template preview and testing.
 * Conforms to the universal resume data schema.
 */
export const sampleResumeData = {
  personal: {
    name: "Alex Rivera",
    fullName: "Alex Rivera",
    title: "Senior Full Stack Engineer",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    city: "San Francisco",
    country: "USA",
    linkedin: "linkedin.com/in/alex-rivera-dev",
    github: "github.com/alexrivera",
    website: "alexrivera.dev",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=face"
  },
  summary: "Results-driven Senior Full Stack Engineer with 7+ years of experience designing, scaling, and deploying mission-critical distributed systems and intuitive user interfaces. Proven track record of spearheading cloud microservices architectures, reducing latency by 45%, and mentoring engineering teams. Passionate about developer tooling, performance engineering, and resilient system design.",
  experience: [
    {
      id: "exp-1",
      role: "Lead Software Architect",
      company: "Apex Cloud Technologies",
      location: "San Francisco, CA",
      startDate: "2022",
      endDate: "Present",
      current: true,
      description: "Direct architectural roadmap and engineering execution for the flagship multi-tenant SaaS analytics platform.",
      highlights: [
        "Architected real-time event streaming pipeline processing 15M+ events/day using Kafka, Java/Spring Boot, and Redis.",
        "Refactored monolith into decoupled microservices, shrinking deployment cycle times by 65% and boosting SLA to 99.99%.",
        "Mentored a team of 12 full-stack engineers and established best practices for automated testing and CI/CD pipelines."
      ]
    },
    {
      id: "exp-2",
      role: "Senior Full Stack Engineer",
      company: "Nexus Digital Labs",
      location: "Austin, TX",
      startDate: "2019",
      endDate: "2022",
      current: false,
      description: "Designed core modules for enterprise workflow automation and interactive client portals.",
      highlights: [
        "Constructed high-throughput REST and GraphQL APIs backed by PostgreSQL and Spring Boot.",
        "Built dynamic, accessible React web applications with Vite and Tailwind CSS, increasing user engagement by 35%.",
        "Automated Docker and Kubernetes deployments across AWS infrastructure with Terraform."
      ]
    },
    {
      id: "exp-3",
      role: "Software Engineer",
      company: "Catalyst Interactive",
      location: "Seattle, WA",
      startDate: "2017",
      endDate: "2019",
      current: false,
      description: "Full-stack development for rapid prototyping and client delivery.",
      highlights: [
        "Implemented secure JWT authentication and role-based access control across multiple client platforms.",
        "Reduced database query execution times by 40% through index optimization and query refactoring."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science",
      fieldOfStudy: "Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2013",
      endDate: "2017",
      gpa: "3.85 / 4.0",
      highlights: [
        "Dean's Honor List (6 consecutive semesters)",
        "Capstone: Distributed Consensus in Byzantine Environments"
      ]
    }
  ],
  skills: [
    {
      category: "Languages & Frameworks",
      items: ["Java", "Spring Boot", "TypeScript", "JavaScript", "React", "Node.js", "Python", "HTML5/CSS3"]
    },
    {
      category: "Cloud & DevOps",
      items: ["AWS (ECS, S3, RDS)", "Docker", "Kubernetes", "CI/CD (GitHub Actions)", "Terraform", "Linux"]
    },
    {
      category: "Databases & Storage",
      items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Kafka"]
    },
    {
      category: "Methodologies & Tools",
      items: ["Microservices", "RESTful APIs", "System Architecture", "Agile/Scrum", "Git", "Jest", "JUnit"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "CloudPulse Monitoring Suite",
      link: "https://github.com/alexrivera/cloudpulse",
      technologies: ["Go", "React", "Prometheus", "Docker"],
      description: "Open-source infrastructure health dashboard that visualizes cluster telemetry and alerts on anomaly thresholds.",
      highlights: [
        "Earned 1.2k+ GitHub stars and adopted by several development teams worldwide.",
        "Sub-100ms dashboard refresh with WebSocket telemetry feeds."
      ]
    },
    {
      id: "proj-2",
      name: "Resume Engine",
      link: "https://github.com/alexrivera/resume-engine",
      technologies: ["React", "Spring Boot", "CSS Grid"],
      description: "Generic dynamic resume builder engine using recursive tree rendering and scoped stylesheets."
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Professional",
      issuer: "Amazon Web Services",
      date: "2023",
      url: "https://aws.amazon.com/certification"
    },
    {
      id: "cert-2",
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation",
      date: "2022"
    }
  ],
  languages: [
    { name: "English", level: "Native / Bilingual" },
    { name: "Spanish", level: "Professional Working" },
    { name: "French", level: "Conversational" }
  ]
};

export default sampleResumeData;
