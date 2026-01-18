db = db.getSiblingDB('ecommerce');

db.products.insertMany([
  {
    name: "Laptop",
    price: 45000,
    description: "High-performance laptop for professionals",
    category: "Electronics",
    stock: 10
  },
  {
    name: "Smartphone",
    price: 25000,
    description: "Latest Android smartphone with great camera",
    category: "Electronics",
    stock: 25
  },
  {
    name: "Coffee Mug",
    price: 299,
    description: "Premium ceramic coffee mug",
    category: "Home",
    stock: 50
  }
]);

print("Sample products inserted successfully!");