# Ogani - Organic Food E-commerce Store 🥬

A full-stack web application for an online organic food store, built with **Node.js**, **Express**, and **MongoDB**. This project features a complete e-commerce flow with role-based access control for Administrators, Staff, and Customers.

## ✨ Features

### 🛒 Client (Customer)

- **Product Catalog:** Browse organic products by categories, search functionality, and filtering.
- **Shopping Cart:** Add/remove items, update quantities, and view total price.
- **Checkout System:** Place orders and track order status.
- **User Account:** Login, Register, Forgot Password (OTP), and Profile management.
- **Order History:** View past orders and their details.

### 🛠 Admin Dashboard

- **Dashboard:** Overview of system activities.
- **Product Management:** Add, edit, delete products, and manage inventory.
- **Category Management:** Organize products into categories.
- **Order Management:** View and manage all customer orders.
- **User Management:** Manage Customer and Staff accounts.
- **Support:** Handle customer inquiries.

### 🧑‍💼 Staff Interface

- **Order Processing:** Update order statuses (Confirm, Shipping, Delivered).
- **Customer Support:** Respond to customer queries.

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (using Mongoose ODM)
- **Templating Engine:** Express-Handlebars (HBS)
- **Styling:** SCSS, Bootstrap, Custom CSS (Ogani Template adaptation)
- **Authentication:** Express-Session, Custom Auth Middleware
- **Utilities:**
  - `moment`: Date formatting
  - `multer`: File uploads
  - `nodemailer`: Email services (OTP/Notifications)
  - `sweetalert2`: Beautiful alerts

## 📂 Project Structure

```bash
PROJECT_OGANI/
├── config/             # Database and system configurations
├── controllers/        # Logic for handling requests
│   ├── admin/          # Admin-specific controllers
│   ├── client/         # Client-facing controllers
│   └── staff/          # Staff-specific controllers
├── middleware/         # Auth and role-based middleware
├── models/             # Mongoose schemas (Product, User, Order, etc.)
├── routes/             # API and Page routes
├── src/
│   ├── public/         # Static assets (CSS, JS, Images)
│   └── resources/
│       └── views/      # Handlebars templates
├── util/               # Helper utilities
├── index.js            # Application entry point
└── package.json        # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/duyhaodev/PROJECT_OGANI.git
    cd PROJECT_OGANI
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configuration**

    - Create a `.env` file in the root directory (or ensure environment variables are set):
      ```env
      PORT=3000
      # Add other keys if necessary (e.g., EMAIL_USER, EMAIL_PASS for Nodemailer)
      ```
    - **Database:** The project is currently configured to connect to a local MongoDB instance (`mongodb://localhost:27017/OGANI`).
      - To change this, edit `config/database.js`.

4.  **Run the application**

    ```bash
    npm start
    ```

    - The server will start on `http://localhost:3000` (or your defined PORT).

5.  **Development**
    - To watch for changes (using nodemon):
      ```bash
      npm start
      ```
    - To watch Sass changes:
      ```bash
      npm run watch
      ```

---
