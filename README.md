# Learning Management Platform

A full-stack web app for browsing courses, registering, logging in, and managing course enrollments. It has a React frontend and a Flask REST backend. Built as a two-person team project for ENSF 381 (Full-Stack Web Development) at the University of Calgary, April 2025.

![Screenshot](docs/screenshot.png)

## Features

- **Course catalog**: browse courses served from the Flask API
- **Student registration**: sign-up form that posts to the backend and rejects duplicate usernames
- **Login and protected routes**: the courses page is only reachable when logged in, using React Context and a `ProtectedRoute` wrapper with React Router
- **Enrollment list**: add courses to and remove them from your enrolled list
- **Testimonials**: homepage shows random student testimonials from the API

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React, React Router, React Context, CSS Modules |
| Backend | Python, Flask, Flask-CORS |
| Data | JSON files (courses, testimonials) |

## Architecture

```
React app (port 3000)  ──HTTP/JSON──>  Flask API (port 5000)
  ├─ Homepage                            ├─ GET  /courses
  ├─ LoginPage / SignupPage              ├─ GET  /testimonials
  └─ CoursesPage (protected)             └─ POST /register
```

## My contributions

- Set up the project and built most of the initial app: the Flask backend (`/courses`, `/testimonials`, `/register` routes) and the React frontend structure
- Implemented authentication state with React Context and the protected-route wrapper that gates the courses page
- Built the courses and enrollment pages and wired them to the REST API

My teammate refined the registration form and backend registration logic.

## Running it locally

**Backend**

```bash
cd backend
pip install flask flask-cors
python app.py
```

**Frontend** (in a second terminal, from the project root)

```bash
npm install
npm start
```

Then open http://localhost:3000.

## Known limitations

This was a course assignment focused on frontend–backend integration, so it takes shortcuts a production app wouldn't:

- Student accounts are stored in memory and reset when the server restarts. A real version would use a database such as PostgreSQL.
- Passwords are stored in plain text. A real version would hash them, for example with bcrypt.
