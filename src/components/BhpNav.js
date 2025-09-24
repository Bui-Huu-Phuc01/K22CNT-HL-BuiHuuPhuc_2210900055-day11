// components/BhpNav.js
import { NavLink } from 'react-router-dom';

const linkStyle = ({ isActive }) => ({
    marginRight: 14,
    padding: '6px 10px',
    textDecoration: 'none',
    borderRadius: 8,
    fontWeight: 600,
    border: isActive ? '2px solid #333' : '2px solid transparent'
});

export default function BhpNav() {
    return (
        <nav style={{ marginBottom: 16 }}>
            <NavLink to="/" end style={linkStyle}>Trang chủ</NavLink>
            <NavLink to="/tra-cuu-sinh-vien" style={linkStyle}>Tra cứu sinh viên</NavLink>
            <NavLink to="/danh-sach-sinh-vien" style={linkStyle}>Danh sách sinh viên</NavLink>
            <NavLink to="/sinh-vien/new" style={linkStyle}>➕ Thêm sinh viên</NavLink>
        </nav>
    );
}
