# PromptVerse — AI Prompt Marketplace

Buy & sell AI prompts securely. Full-stack marketplace with authentication, seller dashboards, and Stripe-powered payments.

### 🚀 Demo
Live: https://prompt-verse-omega.vercel.app  
Repo: https://github.com/ayushhkrr/PromptVerse

---

### 🛠️ Tech Stack

| Category | Tech |
|--------|------|
Frontend | React.js, TailwindCSS  
Backend | Node.js, Express.js  
Database | MongoDB (Mongoose)  
Auth | JWT, bcrypt  
Payments | Stripe + Webhooks  
Deployment | Vercel  

---

### ✨ Features

- Secure JWT user authentication & protected routes  
- Create / list / purchase AI prompts  
- Seller dashboard to upload & price prompts  
- Stripe checkout + webhook validation  
- Access control: users see only purchased prompts  
- Fully API-driven architecture

---

### ⚙️ API Endpoints (sample)

| Method | Endpoint | Description |
|--------|---------|------------|
POST | `/api/auth/register` | Register new user  
POST | `/api/auth/login` | Login user  
GET | `/api/products` | List all prompts  
POST | `/api/products` | Create prompt *(seller only)*  
POST | `/api/payments/checkout` | Stripe checkout  
POST | `/api/webhook` | Stripe webhook handler  

Full API docs coming soon.

---

### 📦 Installation

```bash
git clone <repo_url>
cd PromptVerse
npm install
npm start
