# OsirisAI

This project was created as a learning exercise to implement a fully-functional backend written entirely in Go, while building a React frontend in Typescript. I am always learning and improving my skills - I hope this project demonstrates my progress as a software developer and my dedication to mastering full-stack development.

# Setup

## Prerequisites

- Go 1.16 or later
- Node.js 14 or later
- npm 6 or later

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd app/api
   ```

2. Install dependencies:
   ```
   go mod tidy
   ```

3. Run the backend server:
   ```
   go run main.go
   ```

The backend server will start on `http://localhost:8080`.

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd app/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend development server will start, typically on `http://localhost:3000`.

## Running the Application

1. Start the backend server as described above.
2. In a separate terminal, start the frontend development server.
3. Open your browser and navigate to `http://localhost:3000` to use the application.

## Development

- The backend code is located in `app/api/main.go`.
- The frontend code is in the `app/frontend/src` directory, with `App.tsx` as the main component.
- Tailwind CSS is used for styling. The configuration is in `app/frontend/tailwind.config.js`.

## Notes

- The backend currently sends random phrases as responses. Implement your AI logic to replace this behavior.
- Ensure both backend and frontend are running simultaneously for the application to work properly.
