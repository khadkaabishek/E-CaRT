# 🛒 Full-Stack E-Commerce Web App

This is a fully functional **E-commerce Web Application** built entirely by me as a solo project to showcase the implementation of modern full-stack development features — including authentication, product management, analytics, and order handling.

> ⚡ This project is designed not just for functionality, but as a demonstration of best practices and modular code architecture using popular technologies like **React**, **TypeScript**, **Node.js**, and **MongoDB**.

---

## 🚀 Tech Stack

**Frontend:**
- React + TypeScript
- Vite for lightning-fast development and bundling
- Recharts for data visualization (Seller Analytics)

**Backend:**
- Node.js + Express
- MongoDB with Mongoose ODM
- Multer for image/file uploads
- Google OAuth 2.0 login integration
- JWT Authentication
- RESTful APIs

---

## 🧠 Key Features

### 👤 Authentication
- User login/signup with session/token-based auth
- Google OAuth login integration
- Protected routes using middleware

### 🛍️ E-commerce Functionality
- Product listings with images, descriptions, and price
- Add to cart and wishlist/like functionality
- Real-time inventory management (auto-adjusts stock on order)

### 📦 Order Management
- Buyers can place orders for one or multiple products
- Orders are saved with user and product details
- Quantity tracking ensures no over-selling

### 📊 Seller Analytics
- Sellers can view **product-wise sales distribution**
- Pie charts built using `recharts` on the frontend
- `/analyze/:id` API returns seller-specific sales stats
- Analytics update dynamically with order data

### 📤 File Uploads
- Multer used to handle image uploads for products
- Uploaded files are stored in organized `uploads/` directories

---
## ✅ Why I Built This

I built this project:
- To apply and demonstrate my skills in **full-stack web development**
- To explore the **integration of real-world features** like analytics and inventory syncing
- To write **clean, modular, scalable code** — both frontend and backend
- To understand how different components (Auth, API, DB, UI) work in sync

---

## 📌 Future Enhancements (Optional Ideas)
- Implement Stripe or Khalti for payment processing
- Add user reviews & product ratings
- Admin dashboard for platform-wide analytics
- Unit and integration tests (Jest + Supertest)




