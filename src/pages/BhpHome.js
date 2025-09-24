// pages/BhpHome.js
import { Link } from 'react-router-dom';

export default function BhpHome() {
  return (
    <div>
      <h1>React Hooks + Router (BHP)</h1>
      <p>Demo quản lý sinh viên — tìm kiếm, tra cứu, thêm/sửa/xoá; dữ liệu lưu LocalStorage.</p>

      <section style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:12, marginTop:14}}>
        <Card title="🔎 Tìm kiếm mượt">Debounce 300ms & giữ trạng thái.</Card>
        <Card title="📁 Quản lý gọn">Thêm/sửa/xoá, không mất khi refresh.</Card>
        <Card title="🧭 Điều hướng rõ ràng">Trang chủ • Tra cứu • Danh sách • Chi tiết.</Card>
      </section>

      <section style={{border:'1px solid #eee', borderRadius:14, padding:18, marginTop:18}}>
        <h3 style={{marginTop:0}}>Bắt đầu nhanh</h3>
        <ol style={{margin:'8px 0 8px', lineHeight:1.7}}>
          <li>Mở <Link to="/tra-cuu-sinh-vien">Tra cứu sinh viên</Link> và gõ mã/tên để xem nhanh.</li>
          <li>Vào <Link to="/danh-sach-sinh-vien">Danh sách sinh viên</Link> để thêm mới hoặc bấm <i>Sửa</i>.</li>
          <li>Bấm tiêu đề cột để sắp xếp, dùng tìm kiếm để lọc.</li>
        </ol>
      </section>
    </div>
  );
}

function Card({title, children}) {
  return (
    <div style={{border:'1px solid #eee', borderRadius:12, padding:12}}>
      <div style={{fontWeight:700, marginBottom:6}}>{title}</div>
      <div>{children}</div>
    </div>
  );
}
