
# Physiotherapy Clinic Backend

A production-ready Node.js + Express + MongoDB backend for a Physiotherapy Clinic Website with JWT authentication and role-based access control.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Secure password hashing with bcrypt

- **User Management**
  - User registration and login
  - Profile management
  - Password change functionality

- **Appointment System**
  - Create and manage appointments
  - Status tracking (pending/approved/completed/cancelled)
  - Admin approval workflow

- **Service Management**
  - CRUD operations for clinic services
  - Active/inactive service status
  - Search functionality

- **Testimonial System**
  - Patient reviews and ratings
  - Admin approval process
  - Rating statistics

- **Contact Management**
  - Contact form submissions
  - Message status tracking
  - Admin response workflow

- **Admin Dashboard**
  - Comprehensive statistics
  - User and appointment management
  - System overview

## 📋 Requirements

- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd physiotherapy-clinic/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/physiotherapy-clinic
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                    # Database configuration
├── models/
│   ├── User.js                  # User model
│   ├── Appointment.js           # Appointment model
│   ├── Service.js               # Service model
│   ├── Testimonial.js           # Testimonial model
│   └── Contact.js               # Contact model
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── userController.js        # User-related logic
│   ├── adminController.js       # Admin functionality
│   └── publicController.js      # Public API logic
├── routes/
│   ├── authRoutes.js            # Authentication routes
│   ├── userRoutes.js            # User routes
│   ├── adminRoutes.js           # Admin routes
│   └── publicRoutes.js          # Public routes
├── middleware/
│   ├── authMiddleware.js        # JWT authentication
│   ├── roleMiddleware.js        # Role-based authorization
│   └── errorMiddleware.js       # Error handling
├── utils/
│   └── generateToken.js         # JWT token generation
├── app.js                       # Express app configuration
├── server.js                    # Server startup
├── package.json                 # Dependencies and scripts
└── .env.example                 # Environment variables template
```


### Utility Routes
- `GET /health` - Health check
- `GET /api` - API documentation

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation with express-validator
- CORS configuration
- Error handling and sanitization

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/physiotherapy-clinic |
| JWT_SECRET | JWT secret key | (Required) |
| JWT_EXPIRE | Token expiration time | 30d |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |

## 🚀 Deployment

1. **Set production environment variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   ```

2. **Install production dependencies**
   ```bash
   npm install --production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

## 📚 API Documentation

Visit `http://localhost:5000/api` for interactive API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Note**: This backend is designed to work with a React frontend. Make sure to configure the `FRONTEND_URL` environment variable to match your frontend domain.



************************************************************************************Client Folder (README.md)***************************************************************************************************************


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



