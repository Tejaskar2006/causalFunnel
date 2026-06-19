# User Analytics Application

This is a full-stack application for tracking user interactions (`page_view`, `click`) on a web page and visualizing them on a dashboard.

## Tech Stack
- **Tracker:** Vanilla JavaScript (`tracker/tracker.js`)
- **Backend:** Node.js, Express.js, MongoDB (Mongoose) with an MVC structure (`models`, `controllers`, `routes`).
- **Frontend Dashboard:** React.js + Vite

## Project Structure
- `/backend`: Node.js Express server
- `/frontend`: React Vite application (includes the dashboard)
- `/tracker`: Tracking script and demo HTML page

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB instance running locally or via Atlas

### Backend Setup
1. Navigate to `backend/` directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your MongoDB connection string: `MONGO_URI=mongodb://localhost:27017/causalFunnel`
4. Start the server: `npm run dev` (runs on port 5000)

### Frontend Setup
1. Navigate to `frontend/` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

### Demo / Tracker
- Open `tracker/demo/index.html` in your browser to simulate user events. The script will automatically send tracking data to the backend.

## Deployment
- **Backend:** Hosted on [Render](https://render.com).
- **Frontend:** Hosted on [Vercel](https://vercel.com).
- **Tracker:** Hosted separately (e.g., Netlify, Vercel, or AWS S3).

## Assumptions & Trade-offs
- Used standard `localStorage` to generate and persist `session_id`. In a real-world scenario, first-party cookies with HTTP-only flags might be used depending on security requirements.
- The `click` tracker captures basic `x` and `y` client coordinates. For a robust heatmap, elements or window resizing strategies might need additional normalization.
