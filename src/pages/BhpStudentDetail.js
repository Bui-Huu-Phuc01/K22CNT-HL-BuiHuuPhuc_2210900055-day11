// src/pages/BhpStudentDetail.js
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudents } from "../context/BhpStudentsContext";
import { TRANG_THAI, defaultStudent as defaultForm } from "../constants";

export default function BhpStudentDetail() {
    const { masv } = useParams(); // lấy param từ route
    const navigate = useNavigate();
    const { students, addStudent, updateStudent } = useStudents();

    const isEdit = Boolean(masv);

    const [form, setForm] = useState({ ...defaultForm, id: crypto.randomUUID() });

    // Load dữ liệu khi sửa
    useEffect(() => {
        if (isEdit) {
            const existing = students.find((s) => s.id === masv);
            if (existing) setForm(existing);
        }
    }, [masv, isEdit, students]);

    // Xử lý input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Xử lý submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form?.maSV || !form?.hoTen) {
            alert("Mã SV và Họ tên là bắt buộc!");
            return;
        }

        const payload = {
            ...form,
            gpa: Number(form.gpa || 0),
            soTinChiDat: Number(form.soTinChiDat || 0),
            soTinChiNo: Number(form.soTinChiNo || 0),
            updatedAt: new Date().toISOString(),
        };

        try {
            if (isEdit) {
                await updateStudent(form.id, payload);
                alert("Cập nhật thành công!");
            } else {
                payload.createdAt = new Date().toISOString();
                await addStudent(payload);
                alert("Thêm mới thành công!");
            }
            navigate("/danh-sach-sinh-vien");
        } catch (err) {
            console.error(err);
            alert("Không thể lưu dữ liệu!");
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2>{isEdit ? "Sửa sinh viên" : "Thêm sinh viên"}</h2>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
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
                        name="trangThai"
                        value={form.trangThai}
                        onChange={handleChange}
                    >
                        {TRANG_THAI.map((x) => (
                            <option key={x} value={x}>
                                {x}
                            </option>
                        ))}
                    </select>
                </label>

                <div style={{ display: "flex", gap: 8 }}>
                    <button type="submit">💾 Lưu</button>
                    <button type="button" onClick={() => navigate(-1)}>
                        ❌ Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
