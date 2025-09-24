import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const StudentsContext = createContext();
const API_URL = "https://68d35225cc7017eec5468d2e.mockapi.io/api/v1/quanlysinhvien";

export function StudentsProvider({ children }) {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null); // trạng thái đang sửa

    // Lấy danh sách sinh viên khi load app
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get(API_URL);
            setStudents(res.data || []);
        } catch (err) {
            console.error("Lỗi load dữ liệu:", err);
        }
    };

    // Thêm mới
    const addStudent = async (student) => {
        try {
            const res = await axios.post(API_URL, student);
            setStudents((prev) => [...prev, res.data]);
        } catch (err) {
            console.error("Lỗi thêm sinh viên:", err);
            throw err;
        }
    };

    // Cập nhật
    const updateStudent = async (id, updated) => {
        try {
            const res = await axios.put(`${API_URL}/${id}`, updated);
            setStudents((prev) => prev.map((s) => (s.id === id ? res.data : s)));
            setEditingStudent(null); // reset sau khi lưu
        } catch (err) {
            console.error("Lỗi cập nhật sinh viên:", err);
            throw err;
        }
    };

    // Xóa
    const deleteStudent = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setStudents((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Lỗi xóa sinh viên:", err);
            throw err;
        }
    };

    // Lấy theo id
    const getStudentById = (id) => students.find((s) => s.id === id) || null;

    return (
        <StudentsContext.Provider
            value={{
                students,
                editingStudent,
                setEditingStudent, // để trang detail hoặc list bật chế độ sửa
                addStudent,
                updateStudent,
                deleteStudent,
                getStudentById,
                fetchStudents,
            }}
        >
            {children}
        </StudentsContext.Provider>
    );
}

export function useStudents() {
    return useContext(StudentsContext);
}
