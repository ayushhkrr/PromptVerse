# PromptVerse 🚀

A full-stack marketplace platform for buying and selling AI prompts, built with the MERN stack. Users can discover, purchase, and sell premium AI prompts for various use cases including ChatGPT, DALL-E, writing, coding, marketing, and design.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.1-blue.svg)

## 🌟 Features

### For Buyers
- **Browse Marketplace**: Explore curated AI prompts across multiple categories
- **Advanced Filtering**: Search by tags (ChatGPT, DALL-E, Writing, Coding, etc.)
- **Secure Payments**: Stripe integration for safe transactions
- **Purchase History**: Track all purchased prompts in one place
- **Preview System**: View sample outputs before purchasing

### For Sellers
- **Prompt Management**: Create, edit, and manage your prompt listings
- **Image Uploads**: Cloudinary integration for thumbnail management
- **Revenue Tracking**: Monitor sales and earnings
- **AI-Powered Previews**: Generate sample outputs using OpenAI API
- **Status Dashboard**: Track approval status of submitted prompts

### For Administrators
- **Admin Dashboard**: Comprehensive control panel for platform management
- **Prompt Moderation**: Approve or reject submitted prompts
- **User Management**: Ban/unban users, manage roles
- **Analytics**: View platform statistics and user activity

### Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Google OAuth 2.0**: Social login integration via Passport.js
- **Password Encryption**: Bcrypt hashing for password security
- **Protected Routes**: Role-based access control (Buyer, Seller, Admin)
- **Webhook Security**: Stripe webhook verification for payment processing

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern UI library with latest features
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first styling framework
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js & Express 5.1.0** - Server framework
- **MongoDB & Mongoose 8.19.1** - NoSQL database with ODM
- **JWT** - Token-based authentication
- **Passport.js** - Google OAuth strategy
- **Bcrypt** - Password hashing
- **Stripe API** - Payment processing
- **OpenAI API** - AI prompt preview generation
- **Cloudinary** - Image storage and CDN
- **Multer** - File upload handling

## 📁 Project Structure

```
PromptVerse/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PromptCard.jsx
│   │   │   ├── DynamicBackground.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx         # Main marketplace
│   │   │   ├── Login.jsx        # Authentication
│   │   │   ├── Register.jsx
│   │   │   ├── CreatePrompt.jsx # Seller prompt creation
│   │   │   ├── PromptDetail.jsx # Individual prompt view
│   │   │   ├── MyPrompts.jsx    # Seller dashboard
│   │   │   ├── MyPurchases.jsx  # Buyer purchases
│   │   │   ├── BecomeSeller.jsx # Role upgrade
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   └── PaymentCancel.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── routes/
│   │   │   └── AppRouter.jsx    # Route configuration
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   └── main.jsx             # App entry point
│   └── package.json
│
└── server/                      # Backend Node.js application
    ├── src/
    │   ├── config/              # Configuration files
    │   │   ├── db.js            # MongoDB connection
    │   │   ├── cloudinary.js    # Cloudinary setup
    │   │   └── googleAuth.js    # Passport Google strategy
    │   ├── controllers/         # Business logic
    │   │   ├── userController.js
    │   │   ├── promptController.js
    │   │   ├── orderController.js
    │   │   └── adminController.js
    │   ├── models/              # Mongoose schemas
    │   │   ├── userModel.js     # User schema with roles
    │   │   ├── promptModel.js   # Prompt listings
    │   │   ├── orderModel.js    # Purchase records
    │   │   └── logModel.js      # Activity logs
    │   ├── routes/              # API routes
    │   │   ├── userRoutes.js
    │   │   ├── promptRoutes.js
    │   │   └── orderRoutes.js
    │   ├── middleware/          # Custom middleware
    │   │   ├── auth.js          # JWT verification
    │   │   ├── admin.js         # Admin role check
    │   │   └── multer.js        # File upload config
    │   ├── Services/
    │   │   └── OpenAI.js        # OpenAI API integration
    │   └── app.js               # Express server setup
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stripe account
- Cloudinary account
- OpenAI API key
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayushhkrr/PromptVerse.git
   cd PromptVerse
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Create `.env` file in the `server` directory:
   ```env
   # Server Configuration
   PORT=5000
   CLIENT_URL=http://localhost:5173

   # Database
   MONGO_URI=mongodb_connection_string

   # JWT Secret
   JWT_SECRET=jwt_secret_key

   # Stripe
   STRIPE_SECRET_KEY=stripe_secret_key
   STRIPE_WEBHOOK_SECRET=stripe_webhook_secret

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=cloud_name
   CLOUDINARY_API_KEY=api_key
   CLOUDINARY_API_SECRET=api_secret

   # OpenAI
   OPENAI_API_KEY=openai_api_key

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=google_client_id
   GOOGLE_CLIENT_SECRET=google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/users/auth/google/callback
   ```

   Create `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
   ```

5. **Run the application**

   Terminal 1 - Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 - Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/users/register           # User registration
POST   /api/v1/users/login              # User login
GET    /api/v1/users/auth/google        # Google OAuth login
GET    /api/v1/users/auth/google/callback # OAuth callback
GET    /api/v1/users/profile            # Get user profile (protected)
```

### Prompts
```
GET    /api/v1/prompts                  # Get all approved prompts
GET    /api/v1/prompts/:id              # Get single prompt
POST   /api/v1/prompts                  # Create prompt (seller only)
PUT    /api/v1/prompts/:id              # Update prompt (seller only)
DELETE /api/v1/prompts/:id              # Delete prompt (seller/admin)
GET    /api/v1/prompts/seller/my        # Get seller's prompts
```

### Orders
```
POST   /api/v1/orders/create-checkout   # Create Stripe checkout session
GET    /api/v1/orders/my-purchases      # Get user's purchases
POST   /api/v1/orders/webhook           # Stripe webhook handler
```

### Admin
```
GET    /api/v1/admin/dashboard          # Admin statistics
PUT    /api/v1/admin/prompts/:id/approve # Approve prompt
PUT    /api/v1/admin/prompts/:id/reject  # Reject prompt
PUT    /api/v1/admin/users/:id/ban      # Ban user
PUT    /api/v1/admin/users/:id/unban    # Unban user
```

## 🎨 Key Features Implementation

### Payment Processing
- Stripe Checkout integration for secure payments
- Webhook handling for async payment confirmation
- Automatic purchase record creation
- Support for one-time payments

### Image Management
- Multer for handling multipart/form-data
- Cloudinary for image storage and optimization
- Automatic thumbnail generation
- CDN delivery for fast loading

### AI Integration
- OpenAI API for generating prompt previews
- Support for both text and image generation prompts
- Sample input/output demonstration
- Error handling for API failures

### Real-time UI
- Framer Motion for smooth page transitions
- Loading states and skeletons
- Optimistic UI updates
- Responsive glassmorphism design

## 🔐 Security Features

- **Input Validation**: Server-side validation using Validator.js
- **Password Strength**: Enforced strong password requirements
- **XSS Protection**: Sanitization of user inputs
- **CORS Configuration**: Restricted origins for API access
- **Rate Limiting**: Protection against brute force attacks (recommended to add)
- **Secure Headers**: Helmet.js integration (recommended to add)

## 🧪 Testing (Recommended Additions)

To enhance the project, consider adding:
- Jest for unit testing
- Supertest for API testing
- React Testing Library for component tests
- Cypress for E2E testing

## 📦 Deployment

### Frontend (Vercel/Netlify)
1. Build the production bundle: `npm run build`
2. Deploy the `dist` folder
3. Update environment variables

### Backend (Railway/Render/Heroku)
1. Set environment variables
2. Deploy from GitHub repository
3. Configure MongoDB Atlas connection
4. Set up Stripe webhook endpoint

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] Add prompt rating and review system
- [ ] Implement favorites/wishlist functionality
- [ ] Add seller profile pages
- [ ] Create advanced search with filters
- [ ] Implement real-time notifications
- [ ] Add prompt versioning
- [ ] Create affiliate/referral system
- [ ] Add analytics dashboard for sellers
- [ ] Implement subscription model
- [ ] Add multi-language support

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Your Name - [GitHub Profile](https://github.com/ayushhkrr)

## 🙏 Acknowledgments

- OpenAI for API access
- Stripe for payment processing
- Cloudinary for image hosting
- MongoDB for database solution
- The open-source community

---

**Note**: This is a portfolio/learning project. For production use, implement additional security measures, comprehensive testing, and performance optimizations.
