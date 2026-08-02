# 🎓 Academic Performance Prediction System

> **A Web-Based Grade Prediction System Using Multiple Linear Regression Models**

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An intuitive, automated web-based analytical tool designed to forecast student final exam scores using Multiple Linear Regression (MLR). Built to help educators and students identify at-risk performance early and enable proactive academic intervention.

---

## 📌 Description for GitHub Repository

> **Web-based Academic Performance Prediction System using Multiple Linear Regression (React + Vite, PapaParse, Recharts). Forecasts student final exam grades based on process scores and absence counts.**

---

## 📖 Introduction & Rationale

In higher education, monitoring and evaluating student academic performance early is critical. Traditional grade estimation often relies on subjective intuition or manual calculations based on midterm results, posing significant challenges for both students and instructors.

Without early predictive tools:
- **Students** may fail to recognize failing or declining performance in time to take corrective action.
- **Instructors** struggle to efficiently identify "at-risk" students needing early academic warnings or proactive interventions.

This project provides an automated, streamlined, and scalable solution for academic forecasting through a modern web application interface.

---

## 🎯 Key Objectives

- **Automated Data Ingestion:** Seamlessly read student process grades and absence records from CSV files using PapaParse.
- **Predictive Modeling:** Implement a Multiple Linear Regression model ($\hat{Y} = \beta_0 + \beta_1 X_1 + \beta_2 X_2$) to forecast final exam scores based on two primary input variables.
- **Efficiency Enhancement:** Eliminate manual computations to ensure grade prediction is rapid, accurate, and scalable.
- **User Experience & Visualization:** Provide an intuitive graphical interface that allows users to upload datasets and visualize predictive outcomes using Recharts.

---

## 📐 Project Scope & Variables

### Dataset & Scope
- **Sample Size:** 500 student records focused on academic performance.
- **Independent Variables ($X$):**
  - **$X_1$ - Process Grade:** Composite score out of 10 (includes attendance, class assignments, and midterm examinations).
  - **$X_2$ - Absence Count:** Total number of missed academic sessions.
- **Target Dependent Variable ($Y$):** Predicted Final Exam Score (scale 0–10).

### Mathematical Model
$$\hat{Y} = \beta_0 + \beta_1 X_1 + \beta_2 X_2$$

- $\beta_0$: Intercept term
- $\beta_1$: Coefficient for Process Grade ($X_1$)
- $\beta_2$: Coefficient for Absence Count ($X_2$)

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Core** | [React 19](https://react.dev/) | Modern UI component framework |
| **Build System** | [Vite 7](https://vitejs.dev/) | Fast HMR dev server and bundler |
| **Data Parser** | [PapaParse](https://www.papaparse.com/) | Browser CSV parser |
| **Data Visualization** | [Recharts](https://recharts.org/) | Composable chart library for React |
| **Styles** | [Sass / SCSS](https://sass-lang.com/) | CSS preprocessor |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn package manager

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/academic-performance-prediction-system.git
   cd "Academic Performance Prediction System"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Launch dev server:**
   ```bash
   npm run dev
   ```

4. **Build production bundle:**
   ```bash
   npm run build
   ```

---

## 💻 Deliverables & Features

- 📁 **CSV File Ingestion:** Drag-and-drop or file selector to import student dataset.
- 🧮 **Automated Model Training:** Instantly fits Multiple Linear Regression parameters ($\beta_0, \beta_1, \beta_2$).
- 🎯 **Individual & Batch Predictions:** Estimate final grades for single student entries or bulk dataset entries.
- 📊 **Visual Analytics:** Interactive scatter plots, trendlines, and risk warning indicators.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, development setup, and process for submitting pull requests.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
