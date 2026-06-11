# 🍳 CookAssist

### AI-Powered Voice Cooking Assistant

CookAssist is a full-stack AI-powered cooking assistant designed to provide hands-free recipe guidance through voice commands and intelligent cooking support.

The platform combines conversational AI, voice interaction, recipe management, and user authentication to create a seamless cooking experience.

---

## 🎯 Problem Statement

Cooking often requires users to repeatedly interact with their devices while preparing meals, making it inconvenient to follow recipes, search instructions, or navigate cooking steps.

CookAssist addresses this challenge by providing an AI-powered voice assistant that allows users to interact naturally using voice commands while cooking.

---

## ✨ Features

### 🎙️ Voice-Based Interaction

* Hands-free cooking assistance
* Voice command processing
* Natural language understanding
* Interactive cooking guidance

### 🤖 AI-Powered Assistance

* OpenAI-powered conversational support
* Recipe-related question answering
* Cooking instruction generation
* Ingredient and preparation guidance

### 🔐 Authentication System

* User registration
* Secure login
* JWT-based authentication
* Protected routes

### 📖 Recipe Management

* Browse recipes
* Save recipes
* Track cooking sessions
* Personalized experience

### 💾 Persistent Data Storage

* MongoDB Atlas integration
* User profile management
* Session storage
* Recipe history

---

## 🏗️ Project Architecture

```text
CookAssist
│
├── frontend
│   ├── React Application
│   ├── Voice Interface
│   ├── Authentication Pages
│   └── Cooking Dashboard
│
├── backend
│   ├── Express API
│   ├── Authentication Service
│   ├── OpenAI Integration
│   ├── Session Management
│   └── MongoDB Integration
│
└── MongoDB Atlas
    ├── Users
    ├── Recipes
    └── Cooking Sessions
```

---

## 🔄 Application Workflow

```text
User Voice Command
        │
        ▼
Speech Recognition
        │
        ▼
Backend API
        │
        ▼
OpenAI Processing
        │
        ▼
Intent Recognition
        │
        ▼
Cooking Guidance
        │
        ▼
Voice/Text Response
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* CSS3
* Web Speech API

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT (JSON Web Tokens)

### AI Integration

* OpenAI API

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

## 📂 Project Structure

```text
CookAssist
│
├── backend
│   ├── routes
│   ├── models
│   ├── services
│   ├── middleware
│   ├── .env.example
│   └── server.js
│
├── frontend
│   ├── src
│   ├── public
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/purnavalli07/CookAssist.git
cd CookAssist
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

Start backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🎓 Key Learning Outcomes

Through this project, I gained experience in:

* Full Stack Development
* REST API Development
* MongoDB Atlas Integration
* JWT Authentication
* OpenAI API Integration
* Voice Interface Development
* State Management
* Secure Application Architecture

---

## 🚀 Future Improvements

* Multi-language voice support
* Recipe recommendation engine
* Nutritional analysis
* Smart ingredient substitution
* Personalized meal planning
* Voice-controlled timers

---

## 👨‍💻 Author

### Ryali Purnavalli

Software Engineer | Full Stack Developer | MERN Stack Developer | AI Builder

📧 Email: [purnavalliryali@gmail.com](mailto:purnavalliryali@gmail.com)

💼 LinkedIn: [https://linkedin.com/in/purnavalli-ryali](https://www.linkedin.com/in/purnavalli-ryali-322287293/)

🐙 GitHub: https://github.com/purnavalli07

---

⭐ If you found this project interesting, consider giving it a star.
