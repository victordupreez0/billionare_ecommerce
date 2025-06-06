import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
    category: ''
  });
  const [message, setMessage] = useState('');
  const [view, setView] = useState('add'); // 'add' or 'view'
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('category', form.category);
      if (form.image) {
        formData.append('image', form.image);
      }
      await axios.post('http://localhost:3000/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Product created!');
      setForm({ name: '', price: '', description: '', image: null, category: '' });
    } catch (err) {
      setMessage('Error creating product');
    }
  };

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/products');
      setProducts(res.data);
    } catch (err) {
      setMessage('Error fetching products');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (view === 'view') fetchProducts();
  }, [view]);

  // Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setMessage('Error deleting product');
    }
  };

  // Filtered products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  function setShowCommentModal(arg0: boolean) {
    throw new Error('Function not implemented.');
  }

  function setSelectedProduct(product: any) {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold">{view === 'add' ? 'Add Product' : 'View/Search Products'}</h2>
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
          onClick={() => setView(view === 'add' ? 'view' : 'add')}
        >
          {view === 'add' ? 'View/Search Products' : 'Add Product'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {view === 'add' && (
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow" encType="multipart/form-data">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Price</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Image</label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Rich">Rich</option>
                  <option value="Richer">Richer</option>
                  <option value="Richest">Richest</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Add Product
              </button>
            </form>
          )}
          {message && (
            <div className="mt-4 p-3 rounded bg-blue-100 text-blue-800 border border-blue-300">
              {message}
            </div>
          )}
        </div>
        <div>
          {view === 'view' && (
            <div>
              <input
                type="text"
                className="w-full mb-4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : (
                <ul className="space-y-3">
                  {filteredProducts.length === 0 && (
                    <li className="p-4 bg-gray-100 rounded text-center text-gray-500">No products found.</li>
                  )}
                  {filteredProducts.map(product => (
                    <li
                      key={product._id}
                      className="flex flex-col justify-between h-full p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => window.location.href = `/product/${product._id}`}
                    >
                      <div className="flex items-center gap-4">
                        {product.imageUrl && (
                          <img
                            src={`http://localhost:3000${product.imageUrl}`}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded border"
                          />
                        )}
                        <div>
                          <span className="font-semibold">{product.name}</span>
                          
                          

                          <span className="ml-2 text-gray-600">${product.price}</span>

                          <div className="text-sm text-gray-500">{product.description}</div>
                        </div>
                        
                        
                        
                      </div>
                      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                          onClick={() => handleDelete(product._id)}
                          tabIndex={0}
                        >
                          Delete
                        </button>
                      </div>

                        {product.flagged && (
                          <div className="flex justify-end mt-2">
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">Flagged</span>
                             {product.flagged && product.flagReason && (
                          <span className="text-xs text-red-700 mt-1"> Reason: {product.flagReason} </span>
                      
                          )}
                          </div>
                        )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddProduct;