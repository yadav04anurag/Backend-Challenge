# Thangabali's Suitcase Marketplace - Backend

A robust backend for an e-commerce platform for selling suitcases, featuring role-based authentication, product management, order processing, and real-time notifications.

## 🚀 Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd <repository-name>
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Create a `.env` file** in the root of the project and add the following configuration variables.

    ```env
    MONGO_URI=your-mongodb-connection-string
    JWT_SECRET=your-super-secret-jwt-key
    JWT_EXPIRE=1d
    OTP_EXPIRE_MINUTES=5
    PORT=5000
    ```

5.  **Run the application:**
    ```bash
    npm start
    ```
    The server will be available at `http://localhost:5000`.

## ✨ Features

-   [x] **OTP Authentication**: Secure user verification using One-Time Passwords.
-   [x] **Role-Based Authorization**: Differentiated access levels for `Buyer`, `Seller`, and `Admin` roles.
-   [x] **Seller Product Management**: Full CRUD (Create, Read, Update, Delete) functionality for product listings.
-   [x] **Order Placement**: Seamless order creation for buyers.
-   [x] **Admin Controls**: User management capabilities for administrators.
-   [x] **Payment Simulation**: A mock payment processing endpoint.
-   [x] **Real-time Notifications**: WebSocket integration for instant updates on significant events.
    -   Admin is notified of new user signups.
    -   Seller is notified when their product is sold.
    -   Seller is notified when a new order is placed.
-   [x] **Persistent Notification Storage**: Notifications are saved to the database.

## ⚙️ API Endpoints

### 🔑 Authentication

| Method | Endpoint         | Description                                    |
| :----- | :--------------- | :--------------------------------------------- |
| `POST` | `/auth/signup`   | Register a new user (`email`, `password`, `role`). |
| `POST` | `/auth/verify`   | Verify account with OTP (`email`, `otp`).      |
| `POST` | `/auth/login`    | Login to get a JWT token (`email`, `password`).|

### 🧑‍💼 Seller Routes (`Requires Seller JWT`)

| Method  | Endpoint                      | Description                                                  |
| :------ | :---------------------------- | :----------------------------------------------------------- |
| `POST`  | `/seller/products`            | Add a new suitcase.                                          |
| `GET`   | `/seller/products`            | Get all products listed by the authenticated seller.         |
| `PATCH` | `/seller/products/:id`        | Mark a specific product as sold.                             |
| `PATCH` | `/seller/rates`               | Bulk update rates. e.g., `?material=leather&increase=10`     |

### 🛍️ Buyer Routes (`Requires Buyer JWT`)

| Method | Endpoint  | Description                   |
| :----- | :-------- | :---------------------------- |
| `POST` | `/orders` | Place a new order.            |
| `GET`  | `/orders` | Get the buyer's order history.|

### 👑 Admin Routes (`Requires Admin JWT`)

| Method   | Endpoint          | Description                                  |
| :------- | :---------------- | :------------------------------------------- |
| `GET`    | `/admin/users`    | Get all users (optional filter by `role`).   |
| `DELETE` | `/admin/users/:id`| Delete a user.                               |

### 💳 Payment Simulation

| Method | Endpoint            | Description                                |
| :----- | :------------------ | :----------------------------------------- |
| `POST` | `/payments/process` | Simulate payment processing (80% success). |

### 📢 Notifications (WebSocket)

-   **Connection URL**: `ws://localhost:5000`
-   **Events**:
    -   `join`: Emit after authentication with `{ userId, role }` to join a room.
    -   `notification`: Listen for this event to receive real-time notifications.

## 🧪 Testing with cURL

1.  **Sign up a new user** (e.g., a seller):
    ```bash
    curl -X POST http://localhost:5000/auth/signup \
      -H "Content-Type: application/json" \
      -d '{"email":"seller@example.com","password":"password123","role":"seller"}'
    ```

2.  **Verify the OTP** (check the server console for the generated OTP):
    ```bash
    curl -X POST http://localhost:5000/auth/verify \
      -H "Content-Type: application/json" \
      -d '{"email":"seller@example.com","otp":"123456"}'
    ```

3.  **Login to get a JWT token**:
    ```bash
    curl -X POST http://localhost:5000/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"seller@example.com","password":"password123"}'
    ```

4.  **Use the JWT token** to access a protected route:
    ```bash
    # Replace <your-jwt-token> with the token received from the login step
    curl -X GET http://localhost:5000/seller/products \
      -H "Authorization: Bearer <your-jwt-token>"
    ```

## 🛠️ Prerequisites

-   [Node.js](https://nodejs.org/) (v14+)
-   [MongoDB](https://www.mongodb.com/try/download/community)

This complete implementation includes all the required features with proper error handling, validation, and security measures. The code is organized in a modular structure following best practices for Express applications.
