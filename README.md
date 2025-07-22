# CafeMenuQR

A secure, modern, and dynamic QR code menu system for your cafe, built with Next.js and Firebase.

## Overview

CafeMenuQR provides a seamless and secure way for customers to view your menu. Instead of static, shareable links, this system generates a unique, single-use session for every QR code scan. This prevents link sharing and ensures that each session is fresh, enhancing security and control over menu access.

## How It Works

The user flow is designed for security and a great user experience:

1.  **Scan QR Code**: The customer scans a QR code at their table, which directs them to the application's home page.
2.  **Generate Secure Token**: The server instantly generates a unique JWT (JSON Web Token) with a short lifespan (e.g., 60 seconds).
3.  **Redirect to Menu**: The user is immediately redirected to a dynamic menu URL containing the secure token (e.g., `/menu/[token]`).
4.  **Validate Session**: The menu page performs two checks:
    *   It verifies that the token's 60-second lifespan has not expired.
    *   It checks against a Firebase Firestore database to ensure the token has not already been used for a previous session.
5.  **Display Menu**: If the token is valid and unused, the menu is displayed along with a countdown timer showing the session's remaining time. The token is then instantly marked as 'expired' in Firestore to prevent reuse.
6.  **Invalid Session**: If the token is expired or has already been used, the user is gracefully prompted to scan the QR code again to start a new session.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Backend/Database**: [Firebase (Firestore)](https://firebase.google.com/) for token validation.
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) for creating secure, expiring sessions.

## Getting Started

To run this project locally, you will need to have Node.js and npm installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/haydarkadioglu/CafeMenuQR.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    - Create a Firebase project.
    - Create a Firestore database.
    - Get your Firebase project configuration and add it to `src/lib/firebase.ts`.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Navigate to `http://localhost:3000/qr` to see the QR code for your menu. Scanning it will initiate the user flow.
