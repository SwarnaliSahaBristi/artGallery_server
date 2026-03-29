# ⚙️ ARTIFY – Server (Backend)

---

## 🌟 Overview

This is the backend service for ARTIFY. It handles API requests, authentication, and database operations for managing artworks and users.

---

## ✨ Features

* 📦 RESTful API (CRUD operations for artworks)
* 🔐 Firebase Admin authentication
* 🗂️ MongoDB database integration
* 🚀 Scalable backend structure
* 🌐 Secure environment configuration

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB
* **Authentication:** Firebase Admin SDK
* **Environment Management:** dotenv
* **Middleware:** CORS, Express JSON

---

## 📁 Project Setup

### 1️⃣ Clone Repository

```bash
git clone <your-server-repo-link>
cd server
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root:

```env

DB_USER=your_db_user
DB_PASSWORD=your_db_password
PORT=3000
FIREBASE_SERVICE_KEY=your_firebase_service_key
```

---

### 🔐 Firebase Admin Setup

* Download your Firebase Admin SDK JSON file
* Store it securely (DO NOT upload to GitHub)

Alternative (recommended): Use environment variables instead of JSON file.

Example:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourKey\n-----END PRIVATE KEY-----\n"
```

---

### 4️⃣ Run Server

```bash
npm start
```

or (for development)

```bash
nodemon index.js
```

---

## 📌 API Endpoints (Example)

```
GET    /artworks
POST   /artworks
GET    /artworks/:id
PUT    /artworks/:id
DELETE /artworks/:id
```

---

## 📂 Folder Structure (Example)

```
server/
 ├── routes/
 ├── controllers/
 ├── middleware/
 ├── config/
 └── index.js
```

---

## ⚠️ Security Notes

* Never commit `.env` or Firebase credentials
* Use `.gitignore` to protect sensitive files
* Validate all incoming data

---

## 🚀 Deployment

* Can be deployed on:

  * Render
  * Railway
  * Vercel (serverless)

---

## 🤝 Contribution

Contributions are welcome. Please follow best practices and clean coding standards.

---
