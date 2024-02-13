# OnlineLibrary - Your Virtual Bookshelf

OnlineLibrary is a feature-rich web application developed for the final project of a databases course. This app, built using React, NodeJS, and MySQL, provides users with a seamless experience to explore, borrow, and return books from a virtual library.

## Features

- **User Authentication:** Create accounts using email/password or through Google.
- **Dashboard:** After logging in, users access a dashboard displaying all available books in the database.
- **Book Checkout:** Users with filled mailing info can checkout available books with real-time inventory updates.
- **My Books Portal:** Read and preview borrowed books through the 'My Books' portal.
- **Book Returns:** Return borrowed books, making them available for others to enjoy.
- **History Tracking:** Store user sign-in history, relevant information, and borrow history.

## Installation

### Prerequisites

Before running OnlineLibrary, ensure you have the following installed:

- [Node.js and npm](https://nodejs.org/)
- [MySQL](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/)
- [Google Cloud Platform](https://console.cloud.google.com/)

### Google Cloud Console Configuration

1. Enable the following scopes for the web application OAuth 2.0 client ID on Google Cloud Platform:
   - `userInfo.email`
   - `userInfo.profile`
   - (Optional) `openID`

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/matthew-allman/OnlineLibrary.git
   cd OnlineLibrary

2. Start terminals for frontend and backend:
   - In one terminal, navigate to the 'frontend' folder:
     ```bash
     cd frontend
     
   - In another terminal, navigate to the 'backend' folder:
     ```bash
     cd backend
     
3. Create .env files:
   - In the 'frontend' folder, create a .env file with the following variables:
     ```bash
     VITE_APP_API_URL=<YOUR_BACKEND_URL>
     VITE_APP_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
     
   - In the 'backend' folder, create a .env file with the following variables:
     ```bash
     MYSQL_DATABASE=<YOUR_DATABASE_NAME>
     MYSQL_USER=<YOUR_DATABASE_USER>
     MYSQL_PASSWORD=<YOUR_DATABASE_PASSWORD>
     MYSQL_HOSTNAME=<YOUR_DATABASE_HOSTNAME>
     PORT=<YOUR_PORT>
     FRONTEND_URL=<YOUR_FRONTEND_URL>
     SESSION_SECRET=<YOUR_SESSION_SECRET>
     GOOGLE_BOOKS_API_QUERY=<YOUR_GOOGLE_BOOKS_QUERY>

4. Install dependencies and start the applications:
   - In the 'frontend' terminal, run:
     ```bash
     npm i
     npm run dev

   - In the 'frontend' terminal, run:
     ```bash
     npm i
     npm start

Now, your OnlineLibrary should be up and running!


