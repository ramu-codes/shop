// GitHub Student Developer Pack Tools Information
// This controller provides information about tools available through GitHub Student Developer Pack

const getGitHubStudentTools = async (req, res) => {
  try {
    // Comprehensive list of tools available through GitHub Student Developer Pack
    const tools = [
      {
        id: 1,
        name: "GitHub Pro",
        category: "Development Platform",
        description: "Unlimited public and private repositories with advanced code review tools",
        benefits: [
          "Unlimited private repositories",
          "Advanced code review tools",
          "GitHub Pages and Wikis",
          "Protected branches",
          "GitHub Actions minutes"
        ],
        url: "https://github.com"
      },
      {
        id: 2,
        name: "Visual Studio Code",
        category: "IDE",
        description: "Free, powerful code editor with extensions and debugging support",
        benefits: [
          "IntelliSense code completion",
          "Built-in Git integration",
          "Debugging support",
          "Extensions marketplace",
          "Integrated terminal"
        ],
        url: "https://code.visualstudio.com"
      },
      {
        id: 3,
        name: "JetBrains IDE Pack",
        category: "IDE",
        description: "Professional IDEs for various programming languages",
        benefits: [
          "IntelliJ IDEA Ultimate",
          "PyCharm Professional",
          "WebStorm",
          "PhpStorm",
          "All JetBrains tools access"
        ],
        url: "https://www.jetbrains.com/student"
      },
      {
        id: 4,
        name: "Microsoft Azure",
        category: "Cloud Platform",
        description: "Cloud computing services with $100 annual credit",
        benefits: [
          "$100 in Azure credits annually",
          "25+ free services",
          "Virtual machines",
          "Databases",
          "App hosting"
        ],
        url: "https://azure.microsoft.com/en-us/free/students"
      },
      {
        id: 5,
        name: "DigitalOcean",
        category: "Cloud Platform",
        description: "Simple cloud hosting with $200 credit for 1 year",
        benefits: [
          "$200 in platform credit",
          "Easy-to-use droplets",
          "Kubernetes support",
          "Managed databases",
          "1-click app deployments"
        ],
        url: "https://www.digitalocean.com"
      },
      {
        id: 6,
        name: "Heroku",
        category: "Cloud Platform",
        description: "Platform as a Service for app deployment",
        benefits: [
          "Free dyno hours",
          "Easy deployment",
          "Multiple language support",
          "Add-ons marketplace",
          "CI/CD integration"
        ],
        url: "https://www.heroku.com"
      },
      {
        id: 7,
        name: "MongoDB",
        category: "Database",
        description: "NoSQL database with Atlas cloud hosting",
        benefits: [
          "MongoDB Atlas credits",
          "Shared cluster hosting",
          "Global distribution",
          "Automated backups",
          "Performance optimization tools"
        ],
        url: "https://www.mongodb.com/students"
      },
      {
        id: 8,
        name: "Bootstrap Studio",
        category: "Design Tool",
        description: "Desktop application for designing websites using Bootstrap",
        benefits: [
          "Free license while student",
          "Drag-and-drop interface",
          "Bootstrap components",
          "Live preview",
          "Export clean HTML"
        ],
        url: "https://bootstrapstudio.io"
      },
      {
        id: 9,
        name: "Canva Pro",
        category: "Design Tool",
        description: "Professional graphic design tool",
        benefits: [
          "Free Canva Pro subscription",
          "Premium templates",
          "Brand kit",
          "Background remover",
          "Collaboration tools"
        ],
        url: "https://www.canva.com/education"
      },
      {
        id: 10,
        name: "GitKraken",
        category: "Development Tool",
        description: "Git GUI client for better version control",
        benefits: [
          "Visual commit graph",
          "Merge conflict editor",
          "Built-in code editor",
          "Multiple profile support",
          "Integration with GitHub, GitLab, Bitbucket"
        ],
        url: "https://www.gitkraken.com/student-resources"
      },
      {
        id: 11,
        name: "Name.com",
        category: "Domain & Hosting",
        description: "Domain registration and SSL certificates",
        benefits: [
          "Free .me domain",
          "Free SSL certificate",
          "DNS management",
          "Domain privacy",
          "Email forwarding"
        ],
        url: "https://www.name.com"
      },
      {
        id: 12,
        name: "Namecheap",
        category: "Domain & Hosting",
        description: "Domain and hosting services",
        benefits: [
          "Free .me domain for 1 year",
          "SSL certificate",
          "Domain privacy protection",
          "DNS management",
          "Email services"
        ],
        url: "https://nc.me"
      },
      {
        id: 13,
        name: "Docker",
        category: "Development Tool",
        description: "Containerization platform",
        benefits: [
          "Docker Desktop Pro",
          "Unlimited public repositories",
          "Private repositories",
          "Image scanning",
          "Developer tools"
        ],
        url: "https://www.docker.com"
      },
      {
        id: 14,
        name: "Travis CI",
        category: "CI/CD",
        description: "Continuous integration and deployment",
        benefits: [
          "Free builds for open source",
          "Private builds credits",
          "Multiple platforms",
          "Easy GitHub integration",
          "Build matrices"
        ],
        url: "https://travis-ci.com"
      },
      {
        id: 15,
        name: "Sentry",
        category: "Monitoring",
        description: "Application monitoring and error tracking",
        benefits: [
          "Error tracking",
          "Performance monitoring",
          "Release tracking",
          "Alert notifications",
          "Integrations with tools"
        ],
        url: "https://sentry.io"
      },
      {
        id: 16,
        name: "DataDog",
        category: "Monitoring",
        description: "Infrastructure and application monitoring",
        benefits: [
          "Pro account for 2 years",
          "Infrastructure monitoring",
          "APM",
          "Log management",
          "Real-time dashboards"
        ],
        url: "https://www.datadoghq.com"
      },
      {
        id: 17,
        name: "Termius",
        category: "Development Tool",
        description: "SSH client for developers",
        benefits: [
          "Premium features",
          "Multiple device sync",
          "Encrypted vaults",
          "Port forwarding",
          "SFTP support"
        ],
        url: "https://termius.com"
      },
      {
        id: 18,
        name: "Stripe",
        category: "Payment Processing",
        description: "Payment processing platform",
        benefits: [
          "Waived transaction fees",
          "Payment APIs",
          "Billing management",
          "Subscription support",
          "Developer tools"
        ],
        url: "https://stripe.com"
      },
      {
        id: 19,
        name: "Twilio",
        category: "Communication API",
        description: "SMS, voice, and video APIs",
        benefits: [
          "Free credits",
          "SMS API",
          "Voice API",
          "Video API",
          "WhatsApp API"
        ],
        url: "https://www.twilio.com"
      },
      {
        id: 20,
        name: "SendGrid",
        category: "Email Service",
        description: "Email delivery service",
        benefits: [
          "Free emails monthly",
          "Email API",
          "Email validation",
          "Template engine",
          "Analytics"
        ],
        url: "https://sendgrid.com"
      },
      {
        id: 21,
        name: "Educative",
        category: "Learning Platform",
        description: "Interactive learning platform for developers",
        benefits: [
          "6 months free access",
          "Interactive courses",
          "Coding environments",
          "Interview prep",
          "Certificates"
        ],
        url: "https://www.educative.io"
      },
      {
        id: 22,
        name: "Datacamp",
        category: "Learning Platform",
        description: "Data science and analytics learning",
        benefits: [
          "Free access for 3 months",
          "Data science courses",
          "Interactive exercises",
          "Skill assessments",
          "Career tracks"
        ],
        url: "https://www.datacamp.com"
      },
      {
        id: 23,
        name: "Frontend Masters",
        category: "Learning Platform",
        description: "Advanced frontend development courses",
        benefits: [
          "6 months free subscription",
          "Expert instructors",
          "Live workshops",
          "Course transcripts",
          "Practice projects"
        ],
        url: "https://frontendmasters.com"
      },
      {
        id: 24,
        name: "Algolia",
        category: "Search API",
        description: "Powerful search and discovery API",
        benefits: [
          "100k search requests/month",
          "Fast search API",
          "Typo tolerance",
          "Instant results",
          "Analytics"
        ],
        url: "https://www.algolia.com"
      },
      {
        id: 25,
        name: "Mailgun",
        category: "Email Service",
        description: "Email automation service",
        benefits: [
          "Free emails monthly",
          "Email validation",
          "Routing",
          "Analytics",
          "Template engine"
        ],
        url: "https://www.mailgun.com"
      }
    ];

    // Get query parameters for filtering
    const { category, search } = req.query;

    let filteredTools = tools;

    // Filter by category if provided
    if (category) {
      filteredTools = filteredTools.filter(
        tool => tool.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search by name or description if search query provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTools = filteredTools.filter(
        tool =>
          tool.name.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.category.toLowerCase().includes(searchLower)
      );
    }

    res.status(200).json({
      success: true,
      count: filteredTools.length,
      totalTools: tools.length,
      data: filteredTools
    });
  } catch (error) {
    console.error("Error fetching GitHub Student Tools:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching GitHub Student Developer Pack tools",
      error: error.message
    });
  }
};

// Get all available categories
const getCategories = async (req, res) => {
  try {
    const categories = [
      "Development Platform",
      "IDE",
      "Cloud Platform",
      "Database",
      "Design Tool",
      "Development Tool",
      "CI/CD",
      "Monitoring",
      "Payment Processing",
      "Communication API",
      "Email Service",
      "Learning Platform",
      "Search API",
      "Domain & Hosting"
    ];

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message
    });
  }
};

// Get information about how to access the pack
const getAccessInfo = async (req, res) => {
  try {
    const accessInfo = {
      title: "How to Access GitHub Student Developer Pack",
      steps: [
        "Go to education.github.com/pack",
        "Sign in with your GitHub account",
        "Verify your student status with a valid school email or student ID",
        "Once verified, you'll get access to all the tools and benefits",
        "Visit individual tool pages to claim your student benefits"
      ],
      eligibility: [
        "Must be 13 years or older",
        "Must have a GitHub account",
        "Must be currently enrolled in a degree or diploma granting course",
        "Must have a verifiable school-issued email address or school documents",
        "Must not have previously received a GitHub Student Developer Pack"
      ],
      duration: "Benefits are available while you remain a student",
      renewalInfo: "You'll need to reverify your student status periodically",
      officialUrl: "https://education.github.com/pack"
    };

    res.status(200).json({
      success: true,
      data: accessInfo
    });
  } catch (error) {
    console.error("Error fetching access info:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching access information",
      error: error.message
    });
  }
};

export { getGitHubStudentTools, getCategories, getAccessInfo };
