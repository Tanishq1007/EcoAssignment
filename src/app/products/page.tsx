'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string; // Change from imageUrl to image for consistency
  brand: number;
}

interface Brand {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'image'>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    brand: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/products/');
      const data = await response.json();

      const productsWithNumbers = data.map((product: Product) => ({
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      }));

      setProducts(productsWithNumbers);
    };

    fetchProducts();
  }, []);

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/brands/');
      const data = await response.json();
      setBrands(data);
    };

    fetchBrands();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewProduct(prev => ({ ...prev, brand: parseInt(e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price.toString());
    formData.append('category', newProduct.category);
    formData.append('brand', newProduct.brand.toString());
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/products/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Failed to create product');
      }

      const data = await response.json();
      console.log('Product created:', data);
      setNotification('Product created successfully');
      // Refresh the product list after adding a new product
      setProducts(prev => [...prev, { ...data, id: prev.length + 1 }]); // Assuming `data` contains the new product
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      {notification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{notification}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Upload Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="brand">Select Brand</Label>
            <select
              id="brand"
              name="brand"
              value={newProduct.brand}
              onChange={handleBrandChange}
              required
              className="border rounded-md p-2"
            >
              <option value="">Select a brand</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit">Add Product</Button>
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="border p-4 rounded-lg">
              <h3 className="font-bold">{product.name}</h3>
              <p>{product.description}</p>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price.toFixed(2)}</p>
              {product.image && ( // Ensure image exists before rendering
                <Image
                  src={product.image} // Assuming this is the correct property
                  alt={product.name}
                  width={500}
                  height={300}
                />
              )}
              <p>Brand ID: {product.brand}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
