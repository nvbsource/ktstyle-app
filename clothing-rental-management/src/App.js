import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import ProductManagement from './pages/ProductManagement';
import LibraryManagement from './pages/LibraryManagement';
import ContentManagement from './pages/ContentManagement';
import FaceKYC from './pages/FaceKYC';
import CategoryManagement from './pages/CategoryManagement';
import CustomerManagement from './pages/CustomerManagement';
import TransactionManagement from './pages/TransactionManagement';
import OrderManagement from './pages/OrderManagement';
import RentalManagement from './pages/RentalManagement';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ padding: '20px 50px' }}>
          <Routes>
            <Route path="/customers/manager" element={<CustomerManagement />} />
            <Route path="/customers/rental" element={<RentalManagement />} />
            <Route path="/products/manager" element={<ProductManagement />} />
            <Route path="/settings/libraries" element={<LibraryManagement />} />
            <Route path="/settings/categories" element={<CategoryManagement />} />
            <Route path="/transactions/manager" element={<TransactionManagement />} />
            <Route path="/orders/manager" element={<OrderManagement />} />
            <Route path="/contents/manager" element={<ContentManagement />} />
            <Route path="/kyc" element={<FaceKYC />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
