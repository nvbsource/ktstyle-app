import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import {
  BankFilled,
  DashboardOutlined,
  FacebookFilled,
  ProductOutlined,
  SettingOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons'

const { SubMenu } = Menu

const Navbar = () => {
  const location = useLocation() // Lấy đường dẫn hiện tại để xác định menu đang active
  const [current, setCurrent] = useState(location.pathname) // State lưu menu đang active

  // Xử lý khi người dùng chọn một menu
  const handleMenuClick = (e) => {
    setCurrent(e.key) // Cập nhật menu đang active
  }

  return (
    <Layout.Header>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[current]} // Đặt menu đang active
        onClick={handleMenuClick} // Xử lý sự kiện click
      >
        <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/orders/manager" icon={<ShoppingOutlined />}>
          <Link to="/orders/manager">Hóa đơn</Link>
        </Menu.Item>
        <Menu.Item key="/transactions/manager" icon={<BankFilled />}>
          <Link to="/transactions/manager">Tra soát ngân hàng</Link>
        </Menu.Item>
        <SubMenu key="customers" title="Khách hàng" icon={<UserOutlined />}>
          <Menu.Item key="/customers/rental">
            <Link to="/customers/rental">Lịch sử thuê đồ</Link>
          </Menu.Item>
          <Menu.Item key="/customers/manager">
            <Link to="/customers/manager">Quản lý khách hàng</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="products" title="Sản phẩm" icon={<ProductOutlined />}>
          <Menu.Item key="/products/manager">
            <Link to="/products/manager">Quản lý sản phẩm</Link>
          </Menu.Item>
          <Menu.Item key="/products/inventory">
            <Link to="/products/inventory">Quản lý kho</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="contents"
          title="Content Creator"
          icon={<FacebookFilled />}
        >
          <Menu.Item key="/contents/manager">
            <Link to="/contents/manager">Quản lý nội dung</Link>
          </Menu.Item>
          <Menu.Item key="/contents/calendar">
            <Link to="/contents/manager">Lên lịch đăng bài</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="settings"
          title="Cài đặt cấu hình"
          icon={<SettingOutlined />}
        >
          <Menu.Item key="/settings/categories">
            <Link to="/settings/categories">Cài đặt danh mục</Link>
          </Menu.Item>
          <Menu.Item key="/settings/libraries">
            <Link to="/settings/libraries">Cài đặt thư viện</Link>
          </Menu.Item>
          <Menu.Item key="/settings/website">
            <Link to="/settings/website">Cài đặt website</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Layout.Header>
  )
}

export default Navbar
