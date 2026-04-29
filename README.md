# 🚀 DevSync Server

**DevSync Server** is a robust, scalable, and modular backend built using **Node.js**, **Express**, and **TypeScript**. It powers a collaborative project management platform with real-time communication, task tracking, and advanced administrative capabilities.

---

## 🛠️ Tech Stack

* **Language:** TypeScript
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose)
* **Caching & Queues:** Redis (BullMQ for background jobs & workers)
* **Real-time Communication:** Socket.io (Chat & Video Calls)
* **Storage:** AWS S3 (File & ZIP management)
* **Logging:** Winston / Morgan

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* Role-Based Access Control (RBAC)
* Secure authentication for Users and Admins
* OTP-based verification system

### 📊 Project & Issue Management

* Create and manage projects
* Issue tracking and task assignment
* Detailed activity reports

### ⚡ Real-time Collaboration

* Group messaging via WebSockets
* Live group video calling support

### 🤖 Automated Services

* Background job processing using BullMQ
* Meeting scheduling with automated email notifications
* OTP handling via job queues

### 📦 File Management

* Upload and download ZIP files
* AWS S3 integration for scalable storage

### 🧑‍💻 Admin CLI Tool

* Custom CLI for database operations
* Create/manage admin accounts
* Utility scripts (e.g., password hashing)

---

## 📂 Project Structure

```
devsync-server/
├── cli/                # Admin CLI tools
├── src/
│   ├── config/         # DB & Redis configurations
│   ├── middlewares/    # Auth & logging middlewares
│   ├── modules/        # Feature modules (User, Admin, Chat, etc.)
│   ├── templates/      # Email templates
│   ├── utils/          # Helpers (S3, Email, Logger)
│   ├── app.ts          # Express app setup
│   └── socket.ts       # Socket.io handlers
├── package.json
└── tsconfig.json
```

---

## 🚦 Getting Started

### 📌 Prerequisites

* Node.js (v16+)
* MongoDB
* Redis (running instance)
* AWS credentials (for S3)

---

### ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/sharmasatyam121104-devloper/devsync-server.git

# Navigate into the project
cd devsync-server

# Install dependencies
npm install
```

---

### 🔑 Environment Variables

Create a `.env` file in the root directory and configure:

```
PORT=
MONGO_URI=
REDIS_HOST=
REDIS_PORT=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_BUCKET_NAME=
JWT_SECRET=
EMAIL_SERVICE=
```

---

### ▶️ Running the Project

#### Development Mode

```bash
npm run dev
```

#### Production Build

```bash
npm run build
npm start
```

---

## 💻 Admin CLI Tools

Run custom scripts for administrative tasks:

### Create Admin

```bash
npm run create-admin
```



---

## 🛡️ API Modules

| Route       | Description                  |
| ----------- | ---------------------------- |
| `/user`     | Authentication, OTP, Profile |
| `/admin`    | Admin controls & analytics   |
| `/project`  | Project lifecycle management |
| `/issue`    | Issue tracking system        |
| `/chat`     | Real-time messaging          |
| `/meetings` | Scheduling & collaboration   |

---

## 📈 Future Enhancements

* WebRTC optimization for video calls
* Advanced analytics dashboard
* Microservices architecture migration
* Docker & Kubernetes deployment

---

## 👤 Author

**Satyam Sharma**

* GitHub: https://github.com/sharmasatyam121104-devloper

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 💡 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

---

## ⭐ Support

If you like this project, consider giving it a **star ⭐ on GitHub**!
