export const categoriesData = [
    { name: "Electronics" },
    { name: "Clothing" },
    { name: "Footwear" },
    { name: "Accessories" },
    { name: "Home & Living" }
];

export const usersData = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
        phone: 9876543210,
        address: "123 Admin St, Tech City"
    },
    {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "customer",
        phone: 9123456789,
        address: "456 Main St, Commerce Town"
    },
    {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        role: "customer",
        phone: 9012345678,
        address: "789 Park Ave, Metro City"
    }
];

export const getProductsData = (categoryMap) => [
    {
        title: "Wireless Noise-Canceling Headphones",
        description: "High-fidelity audio with active noise cancellation and 30 hours of battery life.",
        price: 199.99,
        discountRate: 15,
        rating: 4.8,
        images: ["/public/assets/1.png"],
        variants: [
            { size: "Small", quantity: 15 },
            { size: "Medium", quantity: 25 },
            { size: "Large", quantity: 20 },
            { size: "X-Large", quantity: 10 }
        ],
        category: categoryMap["Electronics"]
    },
    {
        title: "Smart Fitness Watch",
        description: "Tracks heart rate, sleep, steps, and activity with built-in GPS and waterproof body.",
        price: 149.99,
        discountRate: 10,
        rating: 4.5,
        images: ["/public/assets/2.png"],
        variants: [
            { size: "Small", quantity: 15 },
            { size: "Medium", quantity: 20 },
            { size: "Large", quantity: 20 },
            { size: "X-Large", quantity: 5 }
        ],
        category: categoryMap["Electronics"]
    },
    {
        title: "Classic Cotton Denim Jacket",
        description: "Timeless denim jacket made from 100% premium cotton denim.",
        price: 79.99,
        discountRate: 5,
        rating: 4.6,
        images: ["/public/assets/3.png"],
        variants: [
            { size: "Small", quantity: 10 },
            { size: "Medium", quantity: 18 },
            { size: "Large", quantity: 12 },
            { size: "X-Large", quantity: 4 }
        ],
        category: categoryMap["Clothing"]
    },
    {
        title: "Casual Crewneck T-Shirt",
        description: "Soft breathable cotton t-shirt ideal for everyday casual wear.",
        price: 24.99,
        discountRate: 0,
        rating: 4.2,
        images: ["/public/assets/4.png"],
        variants: [
            { size: "Small", quantity: 30 },
            { size: "Medium", quantity: 45 },
            { size: "Large", quantity: 20 },
            { size: "X-Large", quantity: 15 }
        ],
        category: categoryMap["Clothing"]
    },
    {
        title: "Pro Running Sneakers",
        description: "Lightweight breathable mesh running shoes with responsive cushioning.",
        price: 119.99,
        discountRate: 20,
        rating: 4.7,
        images: ["/public/assets/5.png"],
        variants: [
            { size: "Small", quantity: 8 },
            { size: "Medium", quantity: 14 },
            { size: "Large", quantity: 10 },
            { size: "X-Large", quantity: 5 }
        ],
        category: categoryMap["Footwear"]
    },
    {
        title: "Leather Minimalist Wallet",
        description: "Slim genuine leather wallet with RFID blocking technology.",
        price: 39.99,
        discountRate: 0,
        rating: 4.4,
        images: ["/public/assets/6.png"],
        variants: [
            { size: "Small", quantity: 10 },
            { size: "Medium", quantity: 25 },
            { size: "Large", quantity: 15 },
            { size: "X-Large", quantity: 10 }
        ],
        category: categoryMap["Accessories"]
    },
    {
        title: "Ergonomic Desk Lamp",
        description: "Dimmable LED desk lamp with adjustable arm and touch controls.",
        price: 49.99,
        discountRate: 10,
        rating: 4.3,
        images: ["/public/assets/7.png"],
        variants: [
            { size: "Small", quantity: 5 },
            { size: "Medium", quantity: 12 },
            { size: "Large", quantity: 8 },
            { size: "X-Large", quantity: 4 }
        ],
        category: categoryMap["Home & Living"]
    }
];
