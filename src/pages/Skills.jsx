import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";

const AVAILABLE_SKILLS = [
  // Frontend Frameworks & Libraries
  "React",
  "Vue.js",
  "Angular",
  "Svelte",
  "Next.js",
  "Nuxt.js",
  "Gatsby",
  "Astro",
  "Solid.js",
  "Remix",
  "Alpine.js",
  "Lit",
  "Stencil",

  // Programming Languages
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "C",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Dart",
  "Scala",
  "Elixir",
  "Haskell",
  "Clojure",
  "F#",
  "Perl",
  "Lua",
  "R",
  "Julia",
  "Zig",

  // Backend & Server
  "Node.js",
  "Express.js",
  "Django",
  "Flask",
  "FastAPI",
  "Spring Boot",
  "ASP.NET",
  ".NET",
  "Laravel",
  "Symfony",
  "Rails",
  "Sinatra",
  "Gin",
  "Echo",
  "Actix",
  "Rocket",
  "Fiber",
  "Nest.js",
  "Koa.js",
  "Hapi.js",

  // Mobile Development
  "React Native",
  "Flutter",
  "Ionic",
  "Xamarin",
  "Cordova",
  "NativeScript",
  "SwiftUI",
  "UIKit",
  "Android",
  "Jetpack Compose",

  // Databases
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "SQLite",
  "Redis",
  "Cassandra",
  "DynamoDB",
  "Firebase",
  "Supabase",
  "PlanetScale",
  "Neo4j",
  "InfluxDB",
  "ElasticSearch",
  "CouchDB",
  "MariaDB",
  "Oracle",
  "SQL Server",

  // Cloud & DevOps
  "AWS",
  "Google Cloud",
  "Azure",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Ansible",
  "Jenkins",
  "GitHub Actions",
  "GitLab CI",
  "CircleCI",
  "Vercel",
  "Netlify",
  "Heroku",
  "Railway",
  "Fly.io",

  // Data Science & AI
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "Jupyter",
  "Apache Spark",
  "Airflow",
  "MLflow",
  "Hugging Face",
  "OpenCV",
  "NLTK",
  "spaCy",
  "Matplotlib",
  "Seaborn",

  // Game Development
  "Unity",
  "Unreal Engine",
  "Godot",
  "Phaser",
  "Three.js",
  "Babylon.js",
  "GameMaker",
  "Construct",
  "Defold",
  "Cocos2d",
  "LibGDX",
  "MonoGame",

  // Web Technologies
  "HTML5",
  "CSS3",
  "Sass/SCSS",
  "Less",
  "Stylus",
  "PostCSS",
  "Tailwind CSS",
  "Bootstrap",
  "Bulma",
  "Material-UI",
  "Ant Design",
  "Chakra UI",
  "Mantine",
  "WebAssembly",
  "PWA",
  "WebGL",
  "WebRTC",
  "GraphQL",
  "REST API",
  "gRPC",

  // Testing
  "Jest",
  "Cypress",
  "Playwright",
  "Selenium",
  "Mocha",
  "Chai",
  "Jasmine",
  "Testing Library",
  "Enzyme",
  "Vitest",
  "Puppeteer",
  "Storybook",

  // Build Tools & Bundlers
  "Webpack",
  "Vite",
  "Parcel",
  "Rollup",
  "esbuild",
  "Turbopack",
  "SWC",
  "Babel",
  "ESLint",
  "Prettier",
  "Husky",
  "Lint-staged",

  // Desktop Development
  "Electron",
  "Tauri",
  "Qt",
  "GTK",
  "WPF",
  "WinUI",
  "JavaFX",
  "Swing",
  "Tkinter",
  "PyQt",
  "Dear ImGui",
  "FLTK",
  "wxWidgets",

  // Blockchain & Web3
  "Solidity",
  "Web3.js",
  "Ethers.js",
  "Hardhat",
  "Truffle",
  "Foundry",
  "Smart Contracts",
  "DeFi",
  "NFT",
  "IPFS",
  "Metamask",
  "Wallet Connect",

  // Other Technologies
  "Socket.io",
  "WebSockets",
  "Microservices",
  "Serverless",
  "JAMstack",
  "Headless CMS",
  "Strapi",
  "Contentful",
  "Sanity",
  "Apache Kafka",
  "RabbitMQ",
  "NGINX",
  "Apache",
  "Cloudflare",

  // Version Control & Collaboration
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Mercurial",
  "SVN",
  "Jira",
  "Confluence",
  "Notion",
  "Slack",
  "Discord",
  "Teams",
];

function Skills() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.skills) {
      setSelectedSkills(user.skills);
    }
  }, []);

  const filteredSkills = AVAILABLE_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearAllSkills = () => {
    setSelectedSkills([]);
  };

  const selectPopularSkills = () => {
    const popularSkills = [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "TypeScript",
      "Docker",
      "AWS",
    ];
    setSelectedSkills(popularSkills);
  };

  const handleSave = async () => {
    if (selectedSkills.length === 0) {
      alert("Please select at least one skill");
      return;
    }

    setLoading(true);
    try {
      await userAPI.updateSkills(selectedSkills);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.skills = selectedSkills;
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error) {
      alert("Failed to save skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="text-center mb-4">
        <h2 className="mb-2">Select Your Skills</h2>
        <p style={{ fontSize: "16px", color: "#666" }}>
          Choose the technologies you're interested in or have experience with
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-4">
        <div className="flex-responsive mb-3">
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ flex: 1, minWidth: "200px" }}
          />
          <button
            onClick={selectPopularSkills}
            className="btn"
            style={{
              backgroundColor: "#17a2b8",
              color: "white",
              width: "auto",
            }}
          >
            Select Popular
          </button>
          <button
            onClick={clearAllSkills}
            className="btn"
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              width: "auto",
            }}
          >
            Clear All
          </button>
        </div>

        <div
          className="text-center"
          style={{ fontSize: "14px", color: "#666" }}
        >
          {selectedSkills.length} skills selected
          {searchTerm && ` • ${filteredSkills.length} skills shown`}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid-responsive cols-6 mb-4">
        {filteredSkills.map((skill) => (
          <label
            key={skill}
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px",
              border: "2px solid",
              borderColor: selectedSkills.includes(skill) ? "#007bff" : "#ddd",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: selectedSkills.includes(skill)
                ? "#e3f2fd"
                : "white",
              transition: "all 0.2s ease",
              fontSize: "14px",
              margin: 0,
              minHeight: "44px",
            }}
          >
            <input
              type="checkbox"
              checked={selectedSkills.includes(skill)}
              onChange={() => toggleSkill(skill)}
              style={{
                marginRight: "10px",
                transform: "scale(1.2)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontWeight: selectedSkills.includes(skill) ? "500" : "400",
                fontSize: "14px",
                lineHeight: 1.2,
              }}
            >
              {skill}
            </span>
          </label>
        ))}
      </div>

      {filteredSkills.length === 0 && searchTerm && (
        <div
          className="text-center"
          style={{ color: "#666", margin: "40px 0" }}
        >
          No skills found matching "{searchTerm}"
        </div>
      )}

      {/* Selected Skills Summary */}
      {selectedSkills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-center mb-3">
            Selected Skills ({selectedSkills.length}):
          </h4>
          <div className="d-flex justify-center flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  padding: "6px 10px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {skill}
                <button
                  onClick={() => toggleSkill(skill)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "0",
                    marginLeft: "3px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="text-center">
        <button
          onClick={handleSave}
          disabled={loading || selectedSkills.length === 0}
          className="btn"
          style={{
            padding: "15px 40px",
            backgroundColor: selectedSkills.length > 0 ? "#28a745" : "#6c757d",
            color: "white",
            fontSize: "16px",
            fontWeight: "500",
            width: "auto",
            minWidth: "200px",
            cursor:
              loading || selectedSkills.length === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading ? "Saving..." : `Save ${selectedSkills.length} Skills`}
        </button>
      </div>
    </div>
  );
}

export default Skills;
