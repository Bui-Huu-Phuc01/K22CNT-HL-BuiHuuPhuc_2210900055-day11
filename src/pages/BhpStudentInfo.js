// pages/BhpStudentInfo.js
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { defaultStudent, TRANG_THAI } from '../constants';
import { useStudents } from '../context/BhpStudentsContext';

const Input = ({ label, ...rest }) => (
    <label style={{ display: 'grid', gap: 4, marginBottom: 10 }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <input {...rest} />
    </label>
);
const Select = ({ label, children, ...rest }) => (
    <label style={{ display: 'grid', gap: 4, marginBottom: 10 }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <select {...rest}>{children}</select>
    </label>
);

export default function BhpStudentInfo({ mode }) {
    const { id: idParam } = useParams();
    const isEditByRoute = Boolean(idParam);
    const isEdit = mode === 'edit' || isEditByRoute;

    const { getById, dispatch, existsByMaSV, students } = useStudents();
    const navigate = useNavigate();

    // Lấy record hiện có (không dùng useMemo để tránh warning deps)
    const existing = isEdit ? getById(idParam) : null;

    const [form, setForm] = useState(defaultStudent);

    useEffect(() => {
        if (existing) {
            setForm(existing);
        } else if (!isEdit) {
            setForm({
                ...defaultStudent,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
    }, [existing, isEdit]);

    function validate(f) {
        if (!f.maSV.trim()) return 'Vui lòng nhập Mã SV';
        if (!f.hoTen.trim()) return 'Vui lòng nhập Họ tên';
        const g = Number(f.gpa);
        if (f.gpa !== '' && (isNaN(g) || g < 0 || g > 4)) return 'GPA phải trong khoảng 0–4';
        if (Number(f.soTinChiDat) < 0 || Number(f.soTinChiNo) < 0) return 'Tín chỉ không được âm';
        return null;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const msg = validate(form);
        if (msg) { alert(msg); return; }

        // chặn mã SV trùng
        if (existsByMaSV(form.maSV, isEdit ? form.id : null)) {
            const dup = students.find(s => (s.maSV || '').trim().toLowerCase() === form.maSV.trim().toLowerCase());
            if (!isEdit && dup) {
                if (window.confirm('Mã SV đã tồn tại. Mở hồ sơ đó để chỉnh sửa?')) {
                    navigate(`/sinh-vien/${dup.id}`); return;
                }
            }
            alert('Mã SV đã tồn tại trong danh sách.'); return;
        }

        const payload = { ...form, updatedAt: new Date().toISOString() };

        if (isEdit) dispatch({ type: 'update', payload });
        else dispatch({ type: 'add', payload });

        navigate('/danh-sach-sinh-vien');
    }

    function toggleTag(tag) {
        const set = new Set(form.tags || []);
        set.has(tag) ? set.delete(tag) : set.add(tag);
        setForm({ ...form, tags: [...set] });
    }

    return (
        <div>
            <h2 style={{ marginTop: 0 }}>{isEdit ? 'Sửa sinh viên' : 'Thêm sinh viên'}</h2>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <section style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
                    <h3 style={{ marginTop: 0 }}>Học tập</h3>
                    <Input label="Mã SV *" value={form.maSV} onChange={e => setForm({ ...form, maSV: e.target.value })}
                        onBlur={() => {
                            if (form.maSV?.trim() && existsByMaSV(form.maSV, isEdit ? form.id : null)) {
                                alert('Mã SV này đã có trong danh sách.');
                            }
                        }}
                        placeholder="VD: 22D12345" />
                    <Input label="Họ tên *" value={form.hoTen} onChange={e => setForm({ ...form, hoTen: e.target.value })} />
                    <Select label="Giới tính" value={form.gioiTinh} onChange={e => setForm({ ...form, gioiTinh: e.target.value })}>
                        <option value=""></option><option>Nam</option><option>Nữ</option><option>Khác</option>
                    </Select>
                    <Input label="Ngày sinh" type="date" value={form.ngaySinh} onChange={e => setForm({ ...form, ngaySinh: e.target.value })} />
                    <Input label="Lớp" value={form.lop} onChange={e => setForm({ ...form, lop: e.target.value })} />
                    <Input label="Ngành/Khoa" value={form.nganh} onChange={e => setForm({ ...form, nganh: e.target.value })} />
                    <Input label="Khoá học" placeholder="2022–2026" value={form.khoaHoc} onChange={e => setForm({ ...form, khoaHoc: e.target.value })} />
                    <Select label="Trạng thái" value={form.trangThai} onChange={e => setForm({ ...form, trangThai: e.target.value })}>
                        {TRANG_THAI.map(x => <option key={x} value={x}>{x}</option>)}
                    </Select>
                    <Input label="GPA (0–4)" type="number" step="0.01" min="0" max="4"
                        value={form.gpa} onChange={e => setForm({ ...form, gpa: e.target.value })} />
                    <Input label="Tín chỉ đạt" type="number" min="0"
                        value={form.soTinChiDat} onChange={e => setForm({ ...form, soTinChiDat: e.target.value })} />
                    <Input label="Tín chỉ nợ" type="number" min="0"
                        value={form.soTinChiNo} onChange={e => setForm({ ...form, soTinChiNo: e.target.value })} />
                    <Input label="Ngày dự kiến tốt nghiệp" type="date"
                        value={form.ngayDuKienTotNghiep} onChange={e => setForm({ ...form, ngayDuKienTotNghiep: e.target.value })} />
                    <Input label="Cố vấn học tập" value={form.coVanHocTap} onChange={e => setForm({ ...form, coVanHocTap: e.target.value })} />
                </section>

                <section style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
                    <h3 style={{ marginTop: 0 }}>Liên hệ & khác</h3>
                    <Input label="Email trường" type="email" value={form.emailTruong} onChange={e => setForm({ ...form, emailTruong: e.target.value })} />
                    <Input label="Số điện thoại" value={form.soDienThoai} onChange={e => setForm({ ...form, soDienThoai: e.target.value })} />
                    <Input label="Địa chỉ thường trú" value={form.diaChiThuongTru} onChange={e => setForm({ ...form, diaChiThuongTru: e.target.value })} />
                    <Input label="Địa chỉ liên hệ" value={form.diaChiLienHe} onChange={e => setForm({ ...form, diaChiLienHe: e.target.value })} />
                    <Input label="Số CCCD" value={form.soCCCD} onChange={e => setForm({ ...form, soCCCD: e.target.value })} />
                    <Input label="Mã định danh nội bộ" value={form.maDinhDanhNoiBo} onChange={e => setForm({ ...form, maDinhDanhNoiBo: e.target.value })} />
                    <label style={{ display: 'grid', gap: 4, marginBottom: 10 }}>
                        <span style={{ fontWeight: 600 }}>Tags (phân tách bởi dấu phẩy)</span>
                        <input value={form.tags?.join(', ') || ''} onChange={e => {
                            const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setForm({ ...form, tags: arr });
                        }} />
                    </label>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                        {['học bổng', 'cảnh báo học vụ'].map(t =>
                            <button type="button" key={t}
                                onClick={() => toggleTag(t)}
                                style={{
                                    padding: '4px 10px', borderRadius: 16, border: '1px solid #ccc',
                                    background: (form.tags || []).includes(t) ? '#111' : '#fff',
                                    color: (form.tags || []).includes(t) ? '#fff' : '#111'
                                }}>
                                {t}
                            </button>
                        )}
                    </div>

                    <label style={{ display: 'grid', gap: 4, marginBottom: 10 }}>
                        <span style={{ fontWeight: 600 }}>Ghi chú</span>
                        <textarea rows={4} value={form.ghiChu} onChange={e => setForm({ ...form, ghiChu: e.target.value })} />
                    </label>

                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button type="submit" style={{ padding: '8px 14px' }}>Lưu</button>
                        <button type="button" onClick={() => navigate(-1)} style={{ padding: '8px 14px' }}>Huỷ</button>
                    </div>
                </section>
            </form>
        </div>
    );
}
