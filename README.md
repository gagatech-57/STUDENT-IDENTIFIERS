# Student Portal & File Vault API

A clean, scalable, production-ready MERN Stack (Node.js + Express + MongoDB) REST API built with service-controller architecture.

## Project Structure

```
src/
├── config/
│   └── db.js                 # MongoDB Atlas connection
├── controllers/
│   ├── authController.js     # Auth HTTP request & response handlers
│   ├── studentController.js  # Student CRUD request & response handlers
│   └── uploadController.js   # File upload request & response handlers
├── services/
│   ├── authService.js        # Auth business logic (JWT, password hash)
│   ├── studentService.js     # Student DB query logic & operations
│   └── uploadService.js      # Upload DB query logic & metadata formatting
├── middleware/
│   ├── authMiddleware.js     # Bearer JWT token verification
│   ├── errorHandler.js       # Global error handler
│   ├── notFound.js           # 404 Route Not Found middleware
│   ├── uploadMiddleware.js   # Multer file storage & limits configuration
│   └── validateMiddleware.js # express-validator error extractor
├── models/
│   ├── Student.js            # Mongoose Student Schema
│   └── Upload.js             # Mongoose Upload Schema
├── routes/
│   ├── authRoutes.js         # /login and /register routes
│   ├── studentRoutes.js      # /students CRUD endpoints
│   └── uploadRoutes.js       # /upload file endpoints
├── validators/
│   ├── authValidator.js      # Auth validation rules
│   └── studentValidator.js   # Student validation rules
├── utils/
│   ├── jwt.js                # Token sign & verify helpers
│   └── studentResponse.js    # Student response DTO formatter
├── uploads/                  # Uploaded files directory
├── public/                   # Frontend React single page application
├── app.js                    # Express application setup
└── server.js                 # HTTP Server & DB connection startup
```

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file based on `.env.example`:

```env
PORT=3000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/studentdb
JWT_SECRET=your_secret_key
```

### Running the Server

```bash
# Production mode
npm start

# Development mode (with nodemon)
npm run dev
```

## API Endpoints Summary

### Authentication

- `POST /register` - Create new student account
- `POST /login` - Authenticate student and get JWT token

### Students (Protected with Bearer Token)

- `GET /students` - List all students
- `GET /students/:studentId` - Get student by ID
- `POST /students` - Create new student record
- `PUT /students/:studentId` - Update student details
- `DELETE /students/:studentId` - Remove student record

### Uploads

- `GET /upload` - Health check status
- `GET /upload/files` - List uploaded files from MongoDB
- `POST /upload` - Upload single file (`photo` field)
- `POST /upload/array` - Upload multiple files (`photos` field)
- `POST /upload/fields` - Upload mixed files (`photo` and `resume` fields)
# STUDENT-IDENTIFIERS  
