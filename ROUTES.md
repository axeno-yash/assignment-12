Here's what each route does, plain and simple:

---

### 🔐 `/api/auth`

| Route | What it does |
|:---|:---|
| `POST /api/auth/signup` | Creates a new user account, hashes the password, sets a JWT cookie, returns token |
| `POST /api/auth/signin` | Validates credentials, sets JWT cookie, returns user info + token |
| `GET /api/auth/logout` | Clears the JWT cookie — user is logged out |

---

### 👤 `/api/user`

| Route | What it does |
|:---|:---|
| `GET /api/user/profile` | Returns the logged-in user's data from DB |
| `PUT /api/user/profile` | Updates `name`, `phone`, or `address` for the logged-in user |

---

### 📦 `/api/products`

| Route | What it does |
|:---|:---|
| `GET /api/products` | Returns paginated product list — supports `search`, `category`, `minPrice`, `maxPrice`, `size`, `inStock`, `sort` (`most_popular`, `price_asc`, `price_desc`, `newest`), `page`, `limit` as query params |
| `GET /api/products/:id` | Returns a single product by its ID with category populated |
| `POST /api/products` | Admin creates a new product with all fields including variants |
| `PUT /api/products/:id` | Admin replaces any product field(s) by product ID |
| `PATCH /api/products/:id/stock` | Admin updates only the `variants` (size + quantity) of a product |
| `DELETE /api/products/:id` | Admin permanently deletes a product |

---

### 🗂️ `/api/categories`

| Route | What it does |
|:---|:---|
| `GET /api/categories` | Returns all categories sorted alphabetically |
| `POST /api/categories` | Admin creates a new category (unique name enforced) |
| `PUT /api/categories/:id` | Admin renames a category by ID |
| `DELETE /api/categories/:id` | Admin deletes a category by ID |

---

### 🛒 `/api/cart`

| Route | What it does |
|:---|:---|
| `GET /api/cart` | Returns the logged-in user's cart (auto-creates empty cart if none exists) |
| `POST /api/cart/items` | Adds a product+size+quantity to cart — merges quantity if item already exists, checks stock |
| `PUT /api/cart/items` | Updates quantity of a specific item in cart — send `quantity: 0` to remove it |
| `DELETE /api/cart/items/:productId/:size` | Removes a specific product+size combo from cart |
| `POST /api/cart/coupon` | Applies `SAVE10` (10% off) or `SAVE20` (20% off) coupon to cart |
| `DELETE /api/cart/clear` | Empties the entire cart and removes any coupon |

---

### 📋 `/api/orders`

| Route | What it does |
|:---|:---|
| `POST /api/orders` | Places an order from the current cart — validates stock, deducts inventory, computes total with discount, clears cart |
| `GET /api/orders` | Returns all orders placed by the logged-in user |
| `GET /api/orders/:id` | Returns a single order (only if it belongs to the logged-in user), with product details populated |
| `GET /api/orders/admin/all` | Admin fetches every order in the system with user info populated |
| `PATCH /api/orders/admin/:id/status` | Admin updates order status to `pending`, `shipped`, or `delivered` |

---

### 🛡️ `/api/admin`

| Route | What it does |
|:---|:---|
| `GET /api/admin/dashboard` | Returns aggregate stats — total users, products, orders, and revenue |
| `GET /api/admin/users` | Returns all registered users |
| `PATCH /api/admin/users/:id/role` | Promotes or demotes a user to `admin` or `customer` |

---

### ⭐ `/api/reviews`

| Route | What it does |
|:---|:---|
| `GET /api/reviews` | Serves static review testimonials array for Home & Product details pages |

---

### 🖼️ `/public`

| Route | What it does |
|:---|:---|
| `GET /public/assets/1.png` → `12.png` | Serves local product images as static files |