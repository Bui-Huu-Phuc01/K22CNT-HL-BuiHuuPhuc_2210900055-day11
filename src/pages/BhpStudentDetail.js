// src/pages/BhpStudentDetail.js
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudents } from "../context/BhpStudentsContext";
import "./BhpStudentDetail.css"; // tạo file css riêng nếu muốn style

const defaultStudent = {
    maSV: "",
    hoTen: "",
    lop: "",
    nganh: "",
    gpa: "",
    trangthai: "",
    soTinChiDat: "",
    soTinChiNo: "",
};

export default function BhpStudentDetail() {
    const { id } = useParams(); // lấy id từ URL
    const navigate = useNavigate();
    const { students, addStudent, updateStudent } = useStudents();

    const [form, setForm] = useState(defaultStudent);
    const isEdit = Boolean(id);

    // Nếu là sửa, load thông tin sinh viên cũ
    useEffect(() => {
        if (isEdit) {
            const existing = students.find((s) => s.id === id);
            if (existing) setForm(existing);
        }
    }, [id, isEdit, students]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.maSV || !form.hoTen) {
            alert("Mã SV và Họ tên là bắt buộc!");
            return;
        }

        const payload = {
            ...form,
            gpa: Number(form.gpa || 0),
            soTinChiDat: Number(form.soTinChiDat || 0),
            soTinChiNo: Number(form.soTinChiNo || 0),
        };

        try {
            if (isEdit) {
                const realId = form.id ?? id; // fix lỗi khi form chưa có id
                await updateStudent(realId, payload);
                alert("Cập nhật thành công!");
            } else {
                await addStudent(payload);
                alert("Thêm mới thành công!");
            }
            navigate("/danh-sach-sinh-vien");
        } catch (err) {
            console.error("Lỗi khi lưu:", err);
            alert("Không thể lưu dữ liệu!");
        }
    };

    return (
        <div className="student-detail">
            <h2>{isEdit ? "Sửa sinh viên" : "Thêm sinh viên"}</h2>

            <form className="student-form" onSubmit={handleSubmit}>
                <label>
                    Mã SV *
                    <input
                        name="maSV"
                        value={form.maSV}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Họ tên *
                    <input
                        name="hoTen"
                        value={form.hoTen}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Lớp
                    <input name="lop" value={form.lop} onChange={handleChange} />
                </label>

                <label>
                    Ngành
                    <input name="nganh" value={form.nganh} onChange={handleChange} />
                </label>

                <label>
                    GPA
                    <input
                        name="gpa"
                        type="number"
                        step="0.01"
                        value={form.gpa}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Số tín chỉ đạt
                    <input
                        name="soTinChiDat"
                        type="number"
                        value={form.soTinChiDat}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Số tín chỉ nợ
                    <input
                        name="soTinChiNo"
                        type="number"
                        value={form.soTinChiNo}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Trạng thái
                    <select
                        name="trangthai"
                        value={form.trangthai}
                        onChange={handleChange}
                    >
                        <option value="">-- Chọn trạng thái --</option>
                        <option value="Đang học">Đang học</option>
                        <option value="Bảo lưu">Bảo lưu</option>
                        <option value="Tốt nghiệp">Tốt nghiệp</option>
                        <option value="Thôi học">Thôi học</option>
                    </select>
                </label>

                <div className="form-actions">
                    <button type="submit">💾 Lưu</button>
                    <button type="button" onClick={() => navigate(-1)}>
                        ❌ Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
