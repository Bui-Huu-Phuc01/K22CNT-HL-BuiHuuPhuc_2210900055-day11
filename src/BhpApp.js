
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudentsProvider } from './context/BhpStudentsContext';
import BhpNav from './components/BhpNav';
import BhpHome from './pages/BhpHome';
import BhpStudentSearch from './pages/BhpStudentSearch';
import BhpStudentList from './pages/BhpStudentList';
import BhpStudentDetail from './pages/BhpStudentDetail';

export default function BhpApp() {
  return (
    <BrowserRouter>
      <StudentsProvider>
        <div className="container">
          <h1>React Hooks + Router (BHP)</h1>
          <BhpNav />
          <Routes>
            <Route path="/" element={<BhpHome />} />
            <Route path="/tra-cuu-sinh-vien" element={<BhpStudentSearch />} />
            <Route path="/danh-sach-sinh-vien" element={<BhpStudentList />} />
            {/* thêm mới */}
            <Route path="/sinh-vien/new" element={<BhpStudentDetail />} />
            {/* xem/sửa theo mã SV */}
            <Route path="/sinh-vien/:masv" element={<BhpStudentDetail />} />

            {/* chuyển hướng đường cũ */}
            <Route path="/thong-tin-sinh-vien" element={<Navigate to="/tra-cuu-sinh-vien" replace />} />
          </Routes>
        </div>
      </StudentsProvider>
    </BrowserRouter>
  );
}
