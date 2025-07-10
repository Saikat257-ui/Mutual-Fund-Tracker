# Mutual Funds Portfolio Tracker

A full-stack web application that allows users to search for mutual funds, view their details, and maintain a personalized list of saved funds.

## Features

- User registration and authentication (JWT-based).
- Search for mutual funds using an external API.
- View detailed information about a specific mutual fund.
- Save and remove mutual funds from a user's personalized list.
- Responsive design with Tailwind CSS.

## Technologies Used

### Frontend

- React
- React Router for routing.
- Axios for API calls.
- Tailwind CSS for styling.

### Backend

- Node.js
- Express.js for the server framework.
- MongoDB with Mongoose as the ODM.
- JSON Web Tokens (JWT) for authentication.
- bcryptjs for password hashing.

## Setup and Installation

To get the application running locally, follow these steps:

### Prerequisites

- Node.js installed on your machine.
- A MongoDB database instance (local or cloud-based).

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following variables:

```
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory and add the following variables:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MF_API_URL=<mutual_fund_external_api_url>
```
*Note: The application uses an external API to fetch mutual funds data. You need to provide the base URL for that API in `REACT_APP_MF_API_URL`.*

## Available Scripts

### Backend

- `npm start`: Starts the server in production mode.
- `npm run dev`: Starts the server with `nodemon` for development, which automatically restarts on file changes.

### Frontend

- `npm start`: Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- `npm run build`: Builds the app for production to the `build` folder.
- `npm test`: Launches the test runner in interactive watch mode.

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register`: Register a new user.
  - Body: `{ "username", "email", "password" }`
- `POST /login`: Log in an existing user.
  - Body: `{ "email", "password" }`

### Funds (`/api/funds`)

*All fund-related routes require authentication (a valid JWT in the Authorization header).*

- `POST /save`: Save a mutual fund to the user's list.
  - Body: `{ "fundId", "schemeName", "schemeCode" }`
- `GET /saved`: Get all saved funds for the logged-in user.
- `DELETE /saved/:fundId`: Remove a fund from the user's saved list.
