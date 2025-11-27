# 🚀 AssignPad

AssignPad is a fast and modular **Assignment Management System** used by  
**Students → Professors → HOD → Admin** for seamless academic workflow.

---

## ✨ Core Features

### 👑 Admin (Super User)
- Admin is **created only via CLI** (not API)
- Only admin can create:
  - 👤 Students
  - 🎓 Professors
  - 🏫 Departments
  - 🧩 New service modules (assignment, session, department, etc.)
- CLI Tools:
  ```bash
  npm run create-user        # Create Admin / Student / Professor
  npm run features           # Auto-generate service modules
👤 Users (Created by Admin Only)
Students and Professors cannot self-register

Their accounts are generated securely by admin:

Unique ID

Role-based permissions

Default password (must change on first login)

🎓 Professor Workflow
Professors get a clean and structured review system:

📥 1. Review Assignment
Check submission details

View attached files

Add review comments

❌ 2. Reject
Add rejection reason

Student gets notification

✍️ 3. Sign / Approve
Professor digitally signs approval

Status becomes: verified-by-professor

📤 4. Forward to HOD
Professor can send verified assignments to HOD for final approval

Status becomes: sent-to-hod

🧑‍💼 HOD Workflow
View all professor-approved assignments

Approve / reject with notes

Final signature for completion

🔐 Authentication (JWT)
Secure login using JWT Access + Refresh Tokens

Role-based access control:

🧑 Student → Upload, view their submissions

🎓 Professor → Verify, sign, reject, forward

👑 Admin → Full system control

Auto-refresh mechanism keeps the session alive

📤 Assignment System
Single & Multiple file uploads

Tracks:

Submitter

Reviewed by

Timestamps

Signatures

Complete audit trail history

File storage with public URLs

🛠️ Tech Stack
🎯 Backend
Node.js + Express

MongoDB + Mongoose

JWT Auth

Multer (file uploads)

bcrypt.js

CLI automation (custom Node scripts)

🎨 Frontend
React + Vite

TailwindCSS

Axios

▶️ Scripts
bash
Copy code
npm install
npm start
npm run create-user   # CLI: Create Admin / Student / Professor
npm run features      # CLI: Generate new services/modules
