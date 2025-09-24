// pages/BhpStudentSearch.js
import { useMemo, useState } from 'react';
import { useStudents } from '../context/BhpStudentsContext';
import { TRANG_THAI } from '../constants';

export default function BhpStudentSearch() {
    const { students } = useStudents();
    const [q, setQ] = useState('');
    const [lop, setLop] = useState('');
    const [nganh, setNganh] = useState('');
    const [tt, setTt] = useState('');
    const [gMin, setGMin] = useState('');
    const [gMax, setGMax] = useState('');

    const filtered = useMemo(() => {
        return students.filter(s => {
            const hit = (s.maSV || '').toLowerCase().includes(q.toLowerCase())
                || (s.hoTen || '').toLowerCase().includes(q.toLowerCase());
            if (!hit) return false;
            if (lop && s.lop !== lop) return false;
            if (nganh && s.nganh !== nganh) return false;
            if (tt && s.trangThai !== tt) return false;
            const g = Number(s.gpa);
            if (gMin !== '' && !(g >= Number(gMin))) return false;
            if (gMax !== '' && !(g <= Number(gMax))) return false;
            return true;
        });
    }, [students, q, lop, nganh, tt, gMin, gMax]);

    const LOPS = [...new Set(students.map(s => s.lop).filter(Boolean))];
    const NGANHS = [...new Set(students.map(s => s.nganh).filter(Boolean))];

    return (
        <div>
            <h2 style={{ marginTop: 0 }}>Tra cứu sinh viên</h2>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <input placeholder="Tìm theo mã / họ tên..." value={q} onChange={e => setQ(e.target.value)} />
                <select value={lop} onChange={e => setLop(e.target.value)}>
                    <option value="">Tất cả lớp</option>
                    {LOPS.map(x => <option key={x}>{x}</option>)}
                </select>
                <select value={nganh} onChange={e => setNganh(e.target.value)}>
                    <option value="">Tất cả ngành</option>
                    {NGANHS.map(x => <option key={x}>{x}</option>)}
                </select>
                <select value={tt} onChange={e => setTt(e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    {TRANG_THAI.map(x => <option key={x}>{x}</option>)}
                </select>
                <input placeholder="GPA từ" type="number" step="0.01" value={gMin} onChange={e => setGMin(e.target.value)} style={{ width: 90 }} />
                <input placeholder="đến" type="number" step="0.01" value={gMax} onChange={e => setGMax(e.target.value)} style={{ width: 90 }} />
            </div>

            <ul style={{ paddingLeft: 18 }}>
                {filtered.map(s => (
                    <li key={s.id}>
                        <b>{s.hoTen}</b> — {s.maSV} • {s.lop} • {s.nganh} • GPA {s.gpa ?? '—'} • {s.trangThai}
                    </li>
                ))}
                {filtered.length === 0 && <li style={{ color: '#666' }}>Không có kết quả</li>}
            </ul>
        </div>
    );
}
