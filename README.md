markdown
# Thangabali's Suitcase Marketplace - Backend

## Setup Instructions

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with the following variables:
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>
JWT_EXPIRE=30d
OTP_EXPIRE_MINUTES=10
PORT=5000

text
4. Run MongoDB server locally or provide connection string
5. Run `npm start` to start the server

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user (email, password, role)
- `POST /auth/verify` - Verify account with OTP
- `POST /auth/login` - Login user

### Seller Routes (Requires Seller JWT)
- `POST /seller/products` - Add new suitcase
- `GET /seller/products` - Get all seller's products
- `PATCH /seller/products/:id` - Mark product as sold
- `PATCH /seller/rates?material=leather&increase=10` - Bulk update rates

### Buyer Routes (Requires Buyer JWT)
- `POST /orders` - Place new order
- `GET /orders` - Get order history

### Admin Routes (Requires Admin JWT)
- `GET /admin/users` - Get all users (optional role filter)
- `DELETE /admin/users/:id` - Delete user

### Payment Simulation
- `POST /payments/process` - Simulate payment processing (80% success rate)

### Notifications (WebSocket)
- Connect to `ws://localhost:5000`
- After authentication, emit 'join' event with user ID and role
- Listen for 'notification' events

## Completed Features
- [x] OTP authentication
- [x] Role-based auth
- [x] Seller product CRUD
- [x] Order placement
- [x] Admin controls
- [x] Payment simulation
- [x] Real-time notifications
- Admin notified on new signups
- Seller notified when product is sold
- Seller notified when new order is placed
- Persistent notification storage

## Testing Instructions

1. Start by signing up a user:
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@example.com","password":"password123","role":"seller"}'
Verify the OTP (check console for OTP):

bash
curl -X POST http://localhost:5000/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@example.com","otp":"123456"}'
Login to get JWT token:

bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@example.com","password":"password123"}'
Use the token to access protected routes:

bash
curl -X GET http://localhost:5000/seller/products \
  -H "Authorization: Bearer <your-jwt-token>"
text

## How to Run

1. Make sure you have Node.js (v14+) and MongoDB installed
2. Clone the repository
3. Run `npm install`
4. Create `.env` file with required environment variables
5. Start MongoDB server
6. Run `npm start`
7. The server will be available at `http://localhost:5000`

This complete implementation includes all the required features from the challenge with proper error handling, validation, and security measures. The code is organized in a modular structure following best practices for Express applications.