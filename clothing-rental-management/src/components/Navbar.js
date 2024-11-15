import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <Layout.Header>
      <Menu theme="dark" mode="horizontal">
        <Menu.Item key="products">
          <Link to="/products">Quản lý sản phẩm</Link>
        </Menu.Item>
        <Menu.Item key="contents">
          <Link to="/contents">Quản lý nội dung</Link>
        </Menu.Item>
        <Menu.Item key="library">
          <Link to="/library">Quản lý thư viện</Link>
        </Menu.Item>
      </Menu>
    </Layout.Header>
  );
};

export default Navbar;
