import { useStudents } from "../context/BhpStudentsContext";

export default function BhpStudentTable() {
    const { students, loading, deleteStudentById } = useStudents();

    if (loading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div>
            <h2>📋 Quản lý sinh viên</h2>
            <table border="1" width="100%" cellPadding="8">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Lớp</th>
                        <th>GPA</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((s) => (
                            <tr key={s.id}>
                                <td>{s.id}</td>
                                <td>{s.name}</td>
                                <td>{s.email}</td>
                                <td>{s.class}</td>
                                <td>{s.gpa}</td>
                                <td>{s.status}</td>
                                <td>
                                    <button onClick={() => deleteStudentById(s.id)}>❌ Xóa</button>
                                    <button style={{ marginLeft: "8px" }}>✏️ Sửa</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">Không có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
