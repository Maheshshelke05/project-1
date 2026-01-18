import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', description: '', category: '', stock: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/products`, {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock)
      });
      setNewProduct({ name: '', price: '', description: '', category: '', stock: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🛒 E-commerce Dashboard</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <h2>Add New Product</h2>
        <form onSubmit={addProduct}>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            required
            style={{ margin: '5px', padding: '8px' }}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            required
            style={{ margin: '5px', padding: '8px' }}
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
            required
            style={{ margin: '5px', padding: '8px' }}
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
            required
            style={{ margin: '5px', padding: '8px' }}
          />
          <br />
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            style={{ margin: '5px', padding: '8px', width: '300px' }}
          />
          <br />
          <button type="submit" style={{ margin: '5px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
            Add Product
          </button>
        </form>
      </div>

      <div>
        <h2>Products ({products.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {products.map((product) => (
            <div key={product._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
              <h3>{product.name}</h3>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;