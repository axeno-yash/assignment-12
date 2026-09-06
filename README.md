# 🛒 SHOP.CO — MERN E-Commerce Platform

A feature-rich, high-performance **MERN Stack E-Commerce Application Backend & Frontend Architecture**, built with Node.js, Express.js, MongoDB (Mongoose), and Zod schema validation.

## 🎨 Page-by-Page Data Mapping Guide

| Page | UI Section | Route Mapped | Purpose / Details |
|:---|:---|:---|:---|
| **Home Page** | New Arrivals | `GET /api/products?limit=4&page=1` | 4 newest products |
| | Top Selling | `GET /api/products?limit=4&sort=rating` | 4 highest-rated products |
| | Browse by Style | `GET /api/categories` | Casual, Formal, Party, Gym categories |
| | Happy Customers | `GET /api/reviews` | Customer testimonials carousel |
| **Product Details** | Main Product View | `GET /api/products/:id` | Image gallery, price, discount, sizes, stock |
| | Add to Cart | `POST /api/cart/items` | Adds product + size + qty to cart |
| | Related Products | `GET /api/products?category=:catId&limit=4` | "You Might Also Like" section |
| **Category / Shop** | Product Grid & Filters | `GET /api/products?category=..&minPrice=..&size=..&sort=..&page=..` | Paginated product listing with sidebar filters |
| **Cart** | Cart Items & Summary | `GET /api/cart` | Products in cart, subtotal, discount, fee, total |
| | Apply Promo Code | `POST /api/cart/coupon` | Applies `SAVE10` or `SAVE20` |
| | Checkout Action | `POST /api/orders` | Converts cart into a completed order |
| **Orders** | My Orders List | `GET /api/orders` | User order history with items & delivery status |
| **Admin Panel** | Stats & User List | `GET /api/admin/dashboard` & `GET /api/admin/users` | Platform metrics & user role management |

---

## 📄 License
This project is licensed under the **ISC License**.
