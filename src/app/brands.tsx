"use client"; // Mark this component as a client component

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Brand {
  id: number;
  name: string;
  description: string;
  logo: string; // URL to the brand logo
}

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]); // Declare the 'brands' state

  // Fetch brands when the component mounts
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/brands/');
        console.log('Response data:', response.data);  // Debugging log
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();  // Call the fetch function
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Brands</h1>
      <div className="mt-4">
        {brands.length > 0 ? (
          brands.map((brand) => (
            <Link key={brand.id} href={`/brands/${brand.id}`}>
              <div className="p-4 border rounded-lg shadow mb-4">
                <h2 className="text-xl font-semibold">{brand.name}</h2>
                <p>{brand.description}</p>
                <img src={brand.logo} alt={brand.name} className="w-32 h-32 object-contain" />
              </div>
            </Link>
          ))
        ) : (
          <p>No brands found.</p>
        )}
      </div>
    </div>
  );
};

export default BrandsPage;
