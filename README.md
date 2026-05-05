# Collaborative Document Editor

A full-stack MERN (MongoDB, Express, React, Node.js) application for creating, editing, importing, and sharing documents in real-time.

## Features

- **Rich Text Editor**: A Google Docs-like minimal UI built with Tailwind CSS and React-Quill.
- **File Upload**: Import existing `.txt` files directly into the editor to create new documents.
- **Access Control & Dashboard**: A sleek dashboard that separates "My Documents" from "Shared with Me".
- **Simple Sharing**: Share documents with other users instantly using their email address.

---

## 🚀 How to Run the Project

This project consists of two parts: the `backend` (server & database) and the `frontend` (user interface). You need to run both at the same time.

### Prerequisites
Make sure you have the following installed on your system:
1. **Node.js** (v16 or higher)
2. **MongoDB Community Server** (Running locally on default port `27017`)

### Step 1: Start the Backend (Server)
1. Open a new terminal.
2. Navigate to the backend folder:
   ```bash
   cd f:\Assessment\backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *You should see a message saying "MongoDB Connected" and "Server running on port 5000". Leave this terminal open.*

### Step 2: Start the Frontend (UI)
1. Open a **second, separate terminal**.
2. Navigate to the frontend folder:
   ```bash
   cd f:\Assessment\frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the React development server:
   ```bash
   npm run dev
   ```
   *You should see a message indicating the server is running on `http://localhost:5173/`.*

### Step 3: Open the App
Open your web browser (Chrome, Edge, Firefox, etc.) and go to:
👉 **http://localhost:5173/**

---

## 🔑 Login & Passwords (How it works)

To keep this project fast, lightweight, and easy to use, **there are NO passwords!** 

The app uses a simplified Identity System:
1. When you open the app, you will be greeted by a "Welcome" screen.
2. It will ask for an **Email Address**. 
3. You can type **ANY** email address (e.g., `alice@example.com` or `yourname@test.com`).
4. That's it! You are logged in. The app uses this email to identify you, save your documents, and allow others to share documents with you.

### How to test the Sharing feature:
1. Log in as `alice@test.com`.
2. Click **+ New Document**, type some notes, and click **Save**.
3. Click the **Share** button in the top menu.
4. When prompted, type `bob@test.com` and hit OK.
5. Go back to the dashboard and click **Sign out**.
6. Log in again, but this time type `bob@test.com`.
7. You will now see Alice's document sitting in your **"Shared with Me"** section!

---

## Folder Structure

- `/backend`: Contains the Node.js + Express server, MongoDB Mongoose schemas (`Document.js`), and API controllers. Uses `multer` for handling `.txt` file uploads.
- `/frontend`: Contains the React + Vite application. Uses `Tailwind CSS` for styling, `Axios` for API calls, and `react-quill-new` for the rich text editor.

## API Endpoints Reference

- `GET /api/documents/user/:email` - Get all documents owned by or shared with a specific user.
- `POST /api/documents` - Create a new document.
- `GET /api/documents/:id` - Fetch a specific document.
- `PUT /api/documents/:id` - Update a document's title or content.
- `POST /api/documents/:id/share` - Share a document with a specific email.
- `POST /api/documents/upload` - Upload a `.txt` file and convert it into a document.
