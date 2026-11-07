# ☁️ CloudSage – MigrateMind

### Enterprise Cloud Migration Planner & Infrastructure as Code (IaC) Generator

CloudSage – MigrateMind is an enterprise-oriented cloud migration planning platform designed to help organizations assess their existing infrastructure, evaluate migration strategies, design target cloud architectures, estimate costs, manage migration execution, and validate migration readiness.

The platform supports cloud migration planning across **Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP)**.

---

## 🚀 Project Overview

Migrating enterprise applications to the cloud involves several challenges, including infrastructure assessment, application dependencies, migration costs, security risks, and operational planning.

CloudSage – MigrateMind provides a centralized platform to organize and manage these activities through a structured 10-stage migration workflow.

## ✨ Key Features

### 1. Infrastructure Inventory
- Identify and organize existing infrastructure resources.
- Record server, CPU, memory, storage, and database details.
- Maintain infrastructure inventory.

### 2. Workload Assessment
- Analyze application workloads.
- Implement the 6Rs migration strategy.
- Recommend suitable migration approaches.
- Evaluate migration complexity and dependencies.

### 3. Target Cloud Architecture
- Support AWS, Azure, and GCP.
- Map existing infrastructure to cloud services.
- Generate target architecture diagrams.
- Visualize cloud infrastructure components.

### 4. Cloud Cost Estimation & Optimization
- Estimate monthly and annual cloud costs.
- Compare AWS, Azure, and GCP.
- Analyze compute, storage, database, and networking costs.
- Identify cost optimization opportunities.

### 5. Migration Execution Planner
- Organize workloads into migration waves.
- Create and assign migration tasks.
- Manage timelines and dependencies.
- Track migration progress.

### 6. Risk, Security & Compliance
- Identify migration risks.
- Calculate risk severity.
- Evaluate security requirements.
- Assess compliance checklists.
- Track mitigation activities.

### 7. Migration Monitoring & Validation
- Monitor migration progress.
- Validate migrated workloads.
- Track application availability and performance.
- Maintain migration audit history.

### 8. Final Migration Reports
- Generate executive summaries.
- Create technical migration reports.
- Generate cost and security reports.
- Export reports in PDF and CSV formats.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, JavaScript |
| Frontend Build Tool | Vite |
| Backend | Java |
| Backend Framework | Spring Boot |
| ORM | Spring Data JPA, Hibernate |
| Database | MySQL |
| Build Tool | Maven |
| API Architecture | REST APIs |
| Architecture Visualization | React Flow |
| Charts | Recharts |
| Version Control | Git, GitHub |

---

## 🏗️ System Architecture

The application follows a frontend-backend architecture.

```text
              USER
                |
                v
       REACT FRONTEND
                |
                | REST API
                v
       JAVA SPRING BOOT
                |
       -------------------
       |        |        |
       v        v        v
    Services  JPA    Validation
                |
                v
             MYSQL
```

---

## 📁 Project Structure

```text
CloudSage-MigrateMind/
│
├── backend/
│   └── Spring Boot Application
│       ├── src/
│       └── pom.xml
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── assets/
│
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

*Note: Update this structure to match the actual folders in the repository.*

---

## ⚙️ Installation & Setup

### Prerequisites

Install the following:

- Java JDK
- Maven
- Node.js and npm
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Sravanthi-Vasireddy/CloudSage-MigrateMind.git
```

```bash
cd CloudSage-MigrateMind
```

### 2. Configure MySQL

Create a MySQL database:

```sql
CREATE DATABASE cloudsage_db;
```

Configure your database connection in the Spring Boot application configuration.

Use environment variables for database credentials. Do not commit passwords or secrets.

### 3. Start the Spring Boot Backend

Open the backend directory:

```bash
cd backend
```

Build the application:

```bash
mvn clean install
```

Run the application:

```bash
mvn spring-boot:run
```

### 4. Start the React Frontend

Open another terminal in the project root:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

---

## ☁️ Supported Cloud Platforms

- Amazon Web Services (AWS)
- Microsoft Azure
- Google Cloud Platform (GCP)

---

## 🎯 Project Goals

- Simplify enterprise cloud migration planning.
- Improve infrastructure visibility.
- Recommend suitable migration strategies.
- Compare cloud infrastructure costs.
- Identify migration risks and security gaps.
- Provide structured migration execution plans.
- Generate comprehensive migration documentation.

---

## 🔮 Future Enhancements

- Direct AWS, Azure, and GCP integrations.
- Live cloud infrastructure discovery.
- Real-time cloud pricing integration.
- Automated Terraform Infrastructure as Code generation.
- Advanced cloud resource optimization.
- Production-grade monitoring integrations.

---

## 👩‍💻 Author

**Sravanthi Vasireddy**

Computer Science Engineering

GitHub: [Sravanthi-Vasireddy](https://github.com/Sravanthi-Vasireddy)

---

## 📌 Repository

[CloudSage – MigrateMind](https://github.com/Sravanthi-Vasireddy/CloudSage-MigrateMind)

---

*CloudSage – MigrateMind | Enterprise Cloud Migration Planning Platform*