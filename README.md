# 🍽️ Food Del - MERN Stack Food Delivery Website

**Food Del** is a full-stack food delivery application built with the MERN stack. It addresses the real-world challenge of ordering food efficiently by allowing users to browse restaurants, place orders, and track their status — while also providing an admin dashboard to manage menus, orders, and users.

---

## 🌟 Project Goal

In our daily lives, ordering food can be time-consuming and inefficient, especially when restaurant menus are not organized or real-time updates are missing. **Food Del** solves this problem by offering:

- A smooth interface for **customers** to browse, search, and order food.
- A powerful **admin dashboard** to manage orders, track delivery status, and control the menu dynamically.

This project is built with scalability and real-time performance in mind.

---

## 🧩 Tech Stack

### Frontend (Customer Side)
- **Vite + React.js** – Fast, modern React tooling
- **CSS** – Custom styling

### Admin Panel (Admin Side)
- **React.js** via Vite (separate instance)
- **Custom dashboard UI** for managing orders, menu, and more

### Backend
- **Node.js + Express.js** – RESTful API
- **MongoDB** – NoSQL database for storing users, orders, food items

---

## 📁 Folder Structure
```bash
Food-Del/
├── admin/ # Admin panel (Vite + React)
│ ├── public/
│ ├── src/
│ └── vite.config.js
│
├── frontend/ # Customer-facing frontend (Vite + React)
│ ├── public/
│ ├── src/
│ └── vite.config.js
│
├── backend/ # Express.js backend API
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── uploads/
│ └── server.js
```

---

## 🚀 Features

### 👨‍🍳 Customer Features
- Browse food items and categories
- Add to cart and place orders
- Real-time order status tracking
- Secure authentication and user registration
- Responsive and fast UI (built with Vite)

### 👩‍💼 Admin Features
- Add/Edit/Delete menu items
- Manage orders (status, history, etc.)
- View all registered users
- Upload images for food items
- Admin authentication

---

## 🛠️ How to Run Locally

1. **Clone the repository:**

```bash
git clone https://github.com/Anamika-Singh-23/Food_Del-Food_Delivery_Website-.git
cd food-del
```
2. Install dependencies:

Backend:

```
cd backend
npm install
```
Frontend (customer):

```
cd ../frontend
npm install
```
Admin panel:

```
cd ../admin
npm install
```
3. Start development servers:

Backend:

```
npm run server
```
Frontend:

```
npm run dev
```
Admin panel:

```
npm run dev
```
4. Set up .env file in /backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

🧪 Future Enhancements
Payment gateway integration (Razorpay)

Delivery partner tracking

Push notifications for order status

Mobile App version using React Native

🙌 Acknowledgements

This project is built as a learning and real-world development initiative to understand how full-stack applications work in practice.

📩 Contact

If you have suggestions or want to contribute, feel free to raise issues or reach out at:

📧 anamika.singh_cs22@gla.ac.in

"Built to solve real-world problems, one plate at a time."
