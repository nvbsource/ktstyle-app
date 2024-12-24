import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import QuickViewProduct from "./QuickViewProduct";
import { fetchProducts } from "../api/productsApi";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mock data
  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await fetchProducts();
        setProducts(response);
      };
      fetchData();
    } catch (error) {}
  }, []);

  const handleQuickView = (e, product) => {
    console.log(e);
    
    e.stopPropagation()
    e.preventDefault()
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);
  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard quickView={handleQuickView} product={product}/>
        ))}
      </div>

      <QuickViewProduct
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        data={selectedProduct}
      />
    </>
  );
}
