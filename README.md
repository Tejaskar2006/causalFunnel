# User Analytics Application

This is a full-stack application for tracking user interactions (`page_view`, `click`) on a web page and visualizing them on a dashboard.

## Deployment
- **Backend:** Hosted on Render.
- **Frontend Dashboard:** Hosted on Vercel at [https://causal-funnel-dashboard.vercel.app](https://causal-funnel-dashboard.vercel.app).
- **Tracker & Demo:** Hosted on Vercel at [https://causal-funnel-tracker.vercel.app](https://causal-funnel-tracker.vercel.app).

## Tech Stack
- **Tracker:** Vanilla JavaScript (`tracker/tracker.js`)
- **Backend:** Node.js, Express.js, MongoDB (Mongoose) with an MVC structure (`models`, `controllers`, `routes`).
- **Frontend Dashboard:** React.js + Vite (Includes auto-refresh polling for real-time updates)

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

### Testing the Tracker
You can test the tracking script in two ways:

**1. Live Demo Page:**
Visit the live tracker demo page to simulate user events:
[https://causal-funnel-tracker.vercel.app](https://causal-funnel-tracker.vercel.app)

**2. Inject into Any Real Website:**
To test tracking on a live site (e.g., Amazon, Flipkart, your own site), open the browser Developer Tools Console (F12) and paste the following snippet:

```javascript
const script = document.createElement("script");
script.src = "https://causal-funnel-tracker.vercel.app/tracker.js";
script.type = "module"; 
document.head.appendChild(script);
console.log("CausalFunnel Tracker Injected Successfully!");
```
This will instantly log a `page_view` and start tracking all `click` events to your backend.


## Assumptions & Trade-offs
- Used standard `localStorage` to generate and persist `session_id`. In a real-world scenario, first-party cookies with HTTP-only flags might be used depending on security requirements.
- The `click` tracker captures basic `x` and `y` client coordinates. For a robust heatmap, elements or window resizing strategies might need additional normalization.
- **Auto-Refresh Dashboard:** Implemented a short-polling mechanism (`setInterval`) in React that fetches new sessions every 5 seconds. This is a simple and effective alternative to setting up WebSockets for real-time updates in a small-scale assignment.
