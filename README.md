# PromptVerse - AI Prompt Marketplace Backend

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-brightgreen.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x+-success.svg)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Integration-blueviolet.svg)](https://stripe.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-important.svg)](https://openai.com/)

---

## Overview 🚀

PromptVerse is the backend system for a robust marketplace designed for buying and selling AI prompts (e.g., for ChatGPT, Midjourney, DALL-E). This project showcases advanced backend development skills, including secure authentication, payment processing, external API integrations, and database management using Node.js, Express, and MongoDB.

Users can register as buyers or sellers. Sellers upload prompts with details and thumbnails, which require admin approval. Buyers can browse approved prompts, get AI-generated previews (text or image) using the OpenAI API without seeing the actual prompt, and purchase prompts securely via Stripe.

---

## Key Features ✨

- **User Authentication & Authorization:**
  - JWT-based secure registration and login.
  - Password hashing using `bcrypt`.
  - Role-based access control (Buyer, Seller, Admin).
  - Protected routes for authenticated actions.
- **Prompt Management:**
  - Sellers can Create, Read, Update, and Delete their own prompts.
  - Image thumbnail uploads handled via Multer and stored on Cloudinary.
  - Admin approval system (`pending`, `approved`, `rejected` status).
  - Public endpoint to fetch all approved prompts.
- **AI Preview Generation:**
  - Integration with OpenAI API (GPT-3.5 Turbo for text, DALL-E 3 for images).
  - Buyers can generate previews based on the prompt type and seller-provided sample input without revealing the core prompt.
- **Payment Integration (Stripe):**
  - Secure checkout sessions created dynamically per prompt.
  - Webhook handler to securely confirm successful payments.
  - Order creation upon successful payment confirmation.
- **Order Management:**
  - Buyers can view a list of prompts they have purchased, including the full prompt body.
- **Admin Controls:**
  - Admins can approve or reject pending prompts.
  - Admins can manage user status (activate, ban, delete - soft delete).
  - Endpoint to view overall platform statistics (user counts by role/status, prompt counts by status, total orders, total revenue).
- **Basic Logging:**
  - Key user actions (registration, login, purchase, prompt creation/update/delete) are logged to the database for monitoring.

---

## Tech Stack 🛠️

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **File Storage:** Cloudinary (for image uploads)
- **File Upload Middleware:** Multer, multer-storage-cloudinary
- **Payment Gateway:** Stripe API
- **AI Integration:** OpenAI API (GPT-3.5 Turbo, DALL-E 3)
- **Environment Variables:** dotenv
- **Validation (Implicit):** Mongoose Schema Validation

---

## Getting Started ⚙️

Follow these instructions to get the project running locally.

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn
- MongoDB (local instance or Atlas connection string)
- Cloudinary Account (for API keys)
- Stripe Account (for API keys - use test mode)
- OpenAI Account (for API key)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd promptverse-backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up environment variables:**

    - Create a `.env` file in the root directory.
    - Copy the contents of `.env.example` (if you create one) or add the following variables, replacing the placeholder values with your actual keys:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string

    # JWT
    SECRET_KEY=your_very_strong_jwt_secret_key

    # Cloudinary
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # OpenAI
    OPENAI_API_KEY=your_openai_secret_key

    # Stripe (Use Test Keys for Development)
    STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
    STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
    STRIPE_WEBHOOK_SECRET=whsec_... (Use key from `stripe listen` for local testing)

    # Frontend URL (for Stripe redirects)
    CLIENT_URL=http://localhost:3000
    ```

### Running the Server

1.  **Start the server:**
    ```bash
    npm start
    # or yarn start / node src/app.js (depending on your package.json scripts)
    ```
2.  **Set up Stripe Webhook Forwarding (for local testing):**
    - Install the [Stripe CLI](https://stripe.com/docs/stripe-cli).
    - Run `stripe login`.
    - Run `stripe listen --forward-to localhost:5000/api/orders/webhook` (adjust port/path if needed).
    - Use the temporary webhook secret provided by the CLI in your `.env` file.

The server should now be running on the port specified in your `.env` file (defaulting to 5000).

---

## API Documentation 📖

The API provides endpoints for user management, prompt handling, AI previews, and order processing.

**Base URL:** `/api/v1` (or `/api` depending on your `app.js` setup)

**Main Route Groups:**

- `/users`: Registration, Login, Profile Updates, Role Changes, Deletion
- `/prompts`: Create, Update, Delete, Get Own Prompts, Get Public Approved Prompts, AI Preview
- `/orders`: Create Checkout Session, Get Purchased Prompts, Webhook Confirmation
- `/admin`: User Status Updates, Prompt Status Updates, Site Statistics

_(Detailed documentation for each endpoint, including request/response formats, can be provided via a Postman collection or Swagger documentation - **mention which one you plan to create or have created**)._

---

## Skills Demonstrated 🌟

This project showcases proficiency in:

- **RESTful API Design & Development:** Building structured and scalable APIs with Express.js.
- **Database Management:** Designing schemas and performing CRUD operations with MongoDB and Mongoose.
- **Authentication & Security:** Implementing JWT-based authentication, password hashing, and role-based access control.
- **Payment Gateway Integration:** Securely processing payments using the Stripe API and handling webhooks.
- **Third-Party API Integration:** Interacting with external services like Cloudinary (for file storage) and OpenAI (for AI generation).
- **Middleware Implementation:** Using middleware for authentication, authorization, file uploads (Multer), and error handling.
- **Asynchronous Programming:** Effectively using `async/await` for non-blocking operations.
- **Error Handling:** Implementing robust error handling and validation.
- **Environment Configuration:** Managing sensitive keys and settings using environment variables.

---

## Future Enhancements (Optional) 🚀

- Implement refresh tokens for longer user sessions.
- Add advanced features like prompt ratings, reviews, and seller dashboards.
- Develop a more sophisticated analytics/logging system.
- Explore automated content moderation using AI.
- Add pagination to endpoints returning lists (e.g., `allApprovedPrompts`).

---

## License 📄

This project is open source and available for educational purposes so anyone can use this.

---
