import React, { useEffect } from "react";
import { fetchProducts } from "../services/api";

export default function Test() {
  const [products, setProducts] = React.useState([]);

  // Hàm để lấy danh sách sản phẩm từ API
  const loadProducts = async () => {
    const response = await fetchProducts(); // Gọi API để lấy danh sách sản phẩm
    setProducts(response.data);
  };

  // Chuyển đổi dữ liệu thành CSV
  const exportToCSV = () => {
    if (products.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    // Tạo tiêu đề cho file CSV
    let csvContent = "ID,Name,Import Price,Rental Price\n";

    // Lặp qua danh sách sản phẩm và nối các hàng vào CSV
    products.forEach((product) => {
      csvContent += `"${product.id}","${product.name.replace(
        /"/g,
        '""'
      )}","${product.import_price}","${product.rental_price}"\n`;
    });

    // Tạo file Blob từ chuỗi CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Tạo URL cho file Blob
    const url = URL.createObjectURL(blob);

    // Tạo link download và tự động nhấn vào nó
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "products.csv"); // Đặt tên file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <button onClick={exportToCSV}>Xuất CSV</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Import Price</th>
            <th>Rental Price</th>
          </tr>
        </thead>
        <tbody>
          {products.reverse().map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.import_price}</td>
              <td>{product.rental_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}