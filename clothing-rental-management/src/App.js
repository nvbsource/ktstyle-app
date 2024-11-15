import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import ProductManagement from './pages/ProductManagement';
import LibraryManagement from './pages/LibraryManagement';
import ProductContentsManagement from './pages/ProductContentsManagement';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ padding: '20px 50px' }}>
          <Routes>
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/library" element={<LibraryManagement />} />
            <Route path="/contents" element={<ProductContentsManagement />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
