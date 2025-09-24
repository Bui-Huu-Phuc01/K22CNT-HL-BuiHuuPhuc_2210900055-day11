// src/pages/BhpStudentList.js
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useStudents } from "../context/BhpStudentsContext";

function Badge({ text }) {
    const color =
        text === "Đang học"
            ? "#22c55e"
            : text === "Bảo lưu"
                ? "#f59e0b"
                : text === "Tốt nghiệp"
                    ? "#3b82f6"
                    : "#ef4444";
    return (
        <span
            style={{
                background: color,
                color: "#fff",
                padding: "2px 8px",
                borderRadius: 12,
                fontSize: 12,
            }}
        >
            {text}
        </span>
    );
}

function Warn({ gpa, no }) {
    if (Number(gpa) < 2)
        return (
            <span title="GPA thấp" style={{ color: "#ef4444" }}>
                ●
            </span>
        );
    if (Number(no) > 0)
        return (
            <span title="Nợ tín chỉ" style={{ color: "#f59e0b" }}>
                ●
            </span>
        );
    return null;
}

export default function BhpStudentList() {
    // Lấy students và deleteStudent từ context
    const { students, deleteStudent } = useStudents();

    const [q, setQ] = useState("");
    const [sort, setSort] = useState({ key: "hoTen", dir: "asc" });

    // Lọc + sắp xếp
    const list = useMemo(() => {
        const filtered = students.filter(
            (s) =>
                (s.maSV || "").toLowerCase().includes(q.toLowerCase()) ||
                (s.hoTen || "").toLowerCase().includes(q.toLowerCase())
        );
        const next = [...filtered].sort((a, b) => {
            const dir = sort.dir === "asc" ? 1 : -1;
            const av = (a[sort.key] ?? "").toString().toLowerCase();
            const bv = (b[sort.key] ?? "").toString().toLowerCase();
            return av > bv ? dir : av < bv ? -dir : 0;
        });
        return next;
    }, [students, q, sort]);

    // Hàm xoá
    function remove(id) {
        if (window.confirm("Xoá sinh viên này?")) {
            deleteStudent(id);
        }
    }

    // Hàm render cột head
    const head = (k, label) => (
        <th
            onClick={() =>
                setSort({
                    key: k,
                    dir: sort.key === k && sort.dir === "asc" ? "desc" : "asc",
                })
            }
            style={{ cursor: "pointer", whiteSpace: "nowrap" }}
        >
            {label} {sort.key === k ? (sort.dir === "asc" ? "▲" : "▼") : ""}
        </th>
    );

    return (
        <div>
            <h2 style={{ marginTop: 0 }}>Danh sách sinh viên</h2>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <input
                    placeholder="Tìm theo mã / họ tên..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <Link
                    to="/sinh-vien/new"
                    style={{
                        padding: "6px 10px",
                        border: "1px solid #ccc",
                        borderRadius: 8,
                    }}
                >
                    ➕ Thêm mới
                </Link>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {head("maSV", "Mã SV")}
                            {head("hoTen", "Họ tên")}
                            {head("lop", "Lớp")}
                            {head("nganh", "Ngành")}
                            {head("gpa", "GPA")}
                            <th>Tín chỉ Đ/N</th>
                            {head("trangThai", "Trạng thái")}
                            <th>Tags</th>
                            <th style={{ width: 130 }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((sv) => (
                            <tr key={sv.id} style={{ borderTop: "1px solid #eee" }}>
                                <td>{sv.maSV}</td>
                                <td>{sv.hoTen}</td>
                                <td>{sv.lop}</td>
                                <td>{sv.nganh}</td>

                                <td style={{ textAlign: "right" }}>
                                    {sv.gpa ?? ""} <Warn gpa={sv.gpa} no={sv.soTinChiNo} />
                                </td>

                                <td style={{ textAlign: "center" }}>
                                    {sv.soTinChiDat ?? 0}/{sv.soTinChiNo ?? 0}
                                </td>

                                <td>
                                    <Badge text={sv.trangThai || "Không rõ"} />
                                </td>
                                <td>{(sv.tags || []).join(", ")}</td>

                                <td style={{ whiteSpace: "nowrap" }}>
                                    <Link to={`/sinh-vien/${sv.id}`}>Sửa</Link>{" "}
                                    <button
                                        onClick={() => remove(sv.id)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#ef4444",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {list.length === 0 && (
                            <tr>
                                <td
                                    colSpan={9}
                                    style={{ padding: 16, textAlign: "center", color: "#666" }}
                                >
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
