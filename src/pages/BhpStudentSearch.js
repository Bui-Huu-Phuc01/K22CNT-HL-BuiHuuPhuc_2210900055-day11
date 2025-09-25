// src/pages/BhpStudentSearch.js
import { useState, useMemo } from "react";
import { useStudents } from "../context/BhpStudentsContext";

export default function BhpStudentSearch() {
    const { students } = useStudents();
    const [q, setQ] = useState("");

    const filtered = useMemo(
        () =>
            students.filter(
                (s) =>
                    (s.maSV || "").toLowerCase().includes(q.toLowerCase()) ||
                    (s.hoTen || "").toLowerCase().includes(q.toLowerCase())
            ),
        [students, q]
    );

    return (
        <div>
            <h2>Tra cứu sinh viên</h2>
            <input
                placeholder="Tìm theo mã / họ tên..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />
            <ul>
                {filtered.map((s) => (
                    <li key={s.id}>
                        {s.hoTen} — {s.maSV} • {s.lop} • {s.nganh} • GPA {s.gpa} • {s.trangThai}
                    </li>
                ))}
                {filtered.length === 0 && <li>Không có kết quả</li>}
            </ul>
        </div>
    );
}
