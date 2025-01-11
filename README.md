# Travel Article App

## Overview
The **Travel Article App** is a web application built using **HTML**, **CSS**, **JavaScript**, **TypeScript**, and **ReactJS**. It allows users to explore travel destinations, read articles, and interact with comments. The app integrates with a provided API to fetch and manipulate data, including articles, categories, and comments. It features a responsive design, ensuring compatibility across all devices (mobile and desktop).

---

## Features
1. **Dashboard**:
   - Displays a comprehensive overview of articles, including the number of comments per article.
   - Optionally integrates with **ChartJS** to visualize data (e.g., most commented articles).

2. **Article Management**:
   - **CRUD Operations**: Users can create, read, update, and delete articles.
   - Articles are displayed in a creative layout (cards or tables).
   - Each article includes its category and associated comments.

3. **User Profile**:
   - Displays the user's profile information.
   - Shows a list of destinations the user has commented on.

4. **Superadmin Category Management**:
   - A dedicated page for superadmins to manage categories (create, update, delete).

5. **Filtering and Pagination**:
   - Articles can be filtered using query parameters (e.g., by category, date, or title).
   - Custom pagination or infinite scroll is implemented for seamless navigation.

6. **Authentication**:
   - Users can register, log in, and log out.
   - User credentials (except passwords) are stored in **localStorage**, **sessionStorage**, or **cookies**.

7. **Error Handling**:
   - Comprehensive error handling for API requests (e.g., 404 errors, network issues).

8. **State Management**:
   - **Redux** is used for state management, particularly for authentication and user session handling.

---

## Technical Details

### Technologies Used
- **Frontend**: ReactJS, TypeScript, HTML, CSS (TailwindCSS or custom CSS).
- **State Management**: Redux.
- **API Integration**: Axios for fetching data.
- **Pagination**: Custom pagination or infinite scroll.
- **Charts**: ChartJS (optional for dashboard).

### API Integration
The app integrates with the following API endpoints:
- **Articles**: Fetch, create, update, and delete articles.
- **Comments**: Fetch, create, update, and delete comments.
- **Categories**: Fetch and manage categories (superadmin only).
- **Authentication**: Register, login, and logout.

### State Management with Redux
- **Purpose**: Redux is primarily used for managing authentication state (e.g., user login status, token management).
- **Implementation**:
  - Actions: `LOGIN`, `LOGOUT`, `REGISTER`.
  - Reducers: Handle authentication state changes.
  - Store: Centralized state management for the app.

### Error Handling
- **404 Errors**: 
  - During development, a 404 error occurred when fetching comments by ID. To address this, comments are stored in **localStorage**.
  - After adding, updating, or deleting a comment, the app redirects to the homepage to refresh the data and fetch the latest comments.
- **General Errors**: 
  - All API requests include error handling to display user-friendly messages (e.g., "Failed to fetch articles").

---

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/travel-article-app.git
   cd travel-article-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the Application**:
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Access the App**:
   Open your browser and navigate to `http://localhost:3000`.

---

## Usage

### Dashboard
- Displays a list of articles with the number of comments.
- Optionally includes charts for visualizing data (e.g., most commented articles).

### Articles
- **View Articles**: Browse articles with their categories and comments.
- **Create Article**: Add a new article with a title, description, and category.
- **Update Article**: Edit an existing article.
- **Delete Article**: Remove an article.

### Comments
- **Add Comment**: Post a comment on an article.
- **Edit Comment**: Update an existing comment.
- **Delete Comment**: Remove a comment.

### Profile
- View user details and a list of destinations the user has commented on.

### Superadmin Category Management
- **Add Category**: Create a new category.
- **Update Category**: Edit an existing category.
- **Delete Category**: Remove a category.

### Authentication
- **Register**: Create a new account.
- **Login**: Log in to the app.
- **Logout**: Log out of the app.

---

## Challenges and Solutions

### Challenge 1: 404 Error When Fetching Comments by ID
- **Issue**: The API returned a 404 error when fetching comments by ID.
- **Solution**: 
  - Comments are stored in **localStorage** to ensure data persistence.
  - After adding, updating, or deleting a comment, the app redirects to the homepage to refresh the data and fetch the latest comments.

### Challenge 2: State Management Complexity
- **Issue**: Managing authentication and user session state became complex.
- **Solution**: 
  - Implemented **Redux** to centralize state management, particularly for authentication.

### Challenge 3: Responsive Design
- **Issue**: Ensuring the app works seamlessly on both mobile and desktop devices.
- **Solution**: 
  - Used **TailwindCSS** for responsive design and media queries.

---

## Future Improvements
- Implement **server-side rendering (SSR)** for better performance.
- Add **dark mode** support.
- Integrate **real-time updates** using WebSockets.
- Enhance the dashboard with more advanced analytics using **ChartJS**.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
