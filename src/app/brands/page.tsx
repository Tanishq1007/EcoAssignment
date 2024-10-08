'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import Image from 'next/image';

interface Brand {
  id: number;
  name: string;
  description: string;
  logo: string | null; // Change to string to hold URL
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [newBrand, setNewBrand] = useState<Omit<Brand, 'id'>>({ name: '', description: '', logo: null });
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/brands/');
      if (response.ok) {
        const data = await response.json();
        setBrands(data);  // Update state with fetched brands
      } else {
        console.error('Failed to fetch brands');
      }
    };

    fetchBrands();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBrand(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewBrand(prev => ({ ...prev, logo: URL.createObjectURL(file) })); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', newBrand.name);
    formData.append('description', newBrand.description);
    if (newBrand.logo) {
      // Retrieve the File object from the URL and append
      const file = e.currentTarget.logo.files?.[0];
      if (file) {
        formData.append('logo', file);
      }
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/brands/', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to create brand");
      }
      const brand = await response.json();
      setBrands(prev => [...prev, brand]);
      setNewBrand({ name: '', description: '', logo: null }); // Reset to initial state
      setNotification("Brand created successfully!");
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error(error);
      setNotification("Failed to create brand");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Brands Management</h1>
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
        <h2 className="text-xl font-semibold mb-2">Add New Brand</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Brand Name</Label>
            <Input
              id="name"
              name="name"
              value={newBrand.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={newBrand.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="logo">Upload Logo</Label>
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
          <Button type="submit">Add Brand</Button>
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Brands</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map(brand => (
            <div key={brand.id} className="border p-4 rounded-lg">
              <h3 className="font-bold">{brand.name}</h3>
              <p>{brand.description}</p>
              {brand.logo && (
                <Image
                  src={brand.logo} // Use brand.logo directly, which is expected to be a string
                  alt="Logo"
                  width={500}
                  height={300}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
