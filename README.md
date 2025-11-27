# 🚀 AssignPad

A simple and fast **Assignment Management System** for **Students** and **Professors**.  
Students upload assignments, professors review them — clean and easy.

---

## ✨ Features
- 👤 Role-based users (Student / Professor)
- 📤 Single & multiple assignment upload
- 📝 Auto-tracking: submitter, reviewer, timestamps, edit history
- 📁 File storage with public URLs
- 🔍 Fetch by student, professor, or assignment ID
- ⚡ Fast API + clean modular structure

---

## 🛠️ Tech Stack

### 🎯 Backend
- Node.js + Express  
- MongoDB + Mongoose  
- Multer (file uploads)

### 🎨 Frontend
- React + Vite  
- TailwindCSS  
- Axios for API calls

---

## 📂 Folder Structure

AssignPad/
│
├── 📁 client/ # Frontend (React + Vite)
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── hooks/
│ │ └── api/
│ └── index.html
│
├── 📁 server/ # Backend (Node + Express)
│ ├── service/
│ ├── src/
│ │ ├── admin/
│ │ ├── assignment/
│ │ │ ├── assignment.controller.js
│ │ │ ├── assignment.model.js
│ │ │ └── assignment.route.js
│ │ ├── department/
│ │ ├── middleware/
│ │ ├── session/
│ │ ├── storage/
│ │ │ └── assignment/ # Stored files
│ │ └── submissions/
│ ├── index.js
│ └── package.json
│
└── README.md

yaml
Copy code

---

## ▶️ Scripts

```bash
npm install
npm start
