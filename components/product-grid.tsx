import { FC } from "react";
import ProductCard from "@/components/product-card";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category?: string;
  slug: string;
}

interface ProductGridProps {
  products: any[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 font-gilroy">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid; 