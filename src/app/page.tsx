import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Brand and Product Management</h1>
      <div className="flex justify-center space-x-4">
        <Link href="/brands">
          <Button>Manage Brands</Button>
        </Link>
        <Link href="/products">
          <Button>Manage Products</Button>
        </Link>
        
      </div>
    </div>
  );
}