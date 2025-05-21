import { useEffect, useState, useMemo } from 'react';
import api from '../api';
import RecordForm from './RecordForm';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function RecordTable() {
  /** 資料狀態 */
  const [rows, setRows] = useState([]);
  /** 搜尋與篩選 */
  const [keyword, setKeyword] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all');
  /** 編輯模式 */
  const [editing, setEditing] = useState(null);

  /** 讀資料 */
  const refresh = () =>
    api.get('/records').then((r) => setRows(r.data));
  useEffect(() => { refresh(); }, []);

  const destroy = async (id) => {
    await api.delete(`/records/${id}`);
    refresh();
  };

  /** 依搜尋 / 篩選產生新陣列 */
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchKey =
        keyword === '' ||
        r.product.includes(keyword) ||
        r.line.includes(keyword);
      const matchShift =
        shiftFilter === 'all' || r.shift === shiftFilter;
      return matchKey && matchShift;
    });
  }, [rows, keyword, shiftFilter]);

  return (
    <div className="p-6 space-y-6">
      {/* 表單（新增 or 編輯） */}
      <RecordForm
        refresh={refresh}
        editing={editing}
        onDone={() => setEditing(null)}
      />

      {/* 搜尋／篩選列 */}
      <div className="flex flex-wrap gap-4 items-end">
        <input
          placeholder="搜尋產品 / 產線"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border px-2 py-1"
        />

        <select
          value={shiftFilter}
          onChange={(e) => setShiftFilter(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="all">全部班別</option>
          {['A', 'B', 'C'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <span className="text-sm text-gray-400">
          共 {filtered.length} 筆
        </span>
      </div>

      {/* 資料表格 */}
      <table className="min-w-full text-sm text-left text-gray-200 border border-gray-600">
        <thead>
          <tr className="bg-slate-700">
            <th className="px-2">日期</th>
            <th className="px-2">線</th>
            <th className="px-2">產品</th>
            <th className="px-2">班</th>
            <th className="px-2">產量</th>
            <th className="px-2">不良率</th>
            <th className="px-2 w-20" />
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r._id} className="border-t border-gray-600">
              <td className="px-2">
                {r.date.slice(0,10)}
              </td>
              <td className="px-2">{r.line}</td>
              <td className="px-2">{r.product}</td>
              <td className="px-2">{r.shift}</td>
              <td className="px-2">{r.quantity}</td>
              <td className="px-2">
                {(r.defectRate * 100).toFixed(2)}%
              </td>
              <td className="px-2 space-x-1">
                <button
                  onClick={() => setEditing(r)}
                  className="text-amber-400"
                >
                  ✏️
                </button>
                <button
                  onClick={() => destroy(r._id)}
                  className="text-red-500"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 圖表：左折線圖（產量） - 右長條圖（不良率） */}
      <div className="flex flex-col md:flex-row gap-8">
        <LineChart
          width={420}
          height={260}
          data={filtered}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#555" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) =>
              new Date(d).toLocaleDateString()
            }
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="quantity"
            name="產量"
            stroke="#82ca9d"
          />
        </LineChart>

        <BarChart
          width={420}
          height={260}
          data={filtered}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#555" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) =>
              new Date(d).toLocaleDateString()
            }
          />
          <YAxis
            tickFormatter={(v) => (v * 100).toFixed(0) + '%'}
          />
          <Tooltip
            formatter={(v) =>
              (v * 100).toFixed(2) + '%'
            }
          />
          <Legend />
          <Bar
            dataKey="defectRate"
            name="不良率"
            fill="#8884d8"
          />
        </BarChart>
      </div>
    </div>
  );
}
