import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../api';

// ─── yup schema ──────────────────────────────────────────
const schema = yup.object({
  date:       yup.date().required('必填').typeError('日期格式錯誤'),
  line:       yup.string().required('必填'),
  product:    yup.string().required('必填'),
  shift:      yup.string().oneOf(['A', 'B', 'C']).required(),
  quantity:   yup.number().min(0, '≥ 0').required('必填').typeError('必須是數字'),
  defectRate: yup.number().min(0).max(1).required('必填').typeError('必須是數字'),
  notes:      yup.string().default(''),
});

export default function RecordForm({ refresh, editing, onDone }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 若按「✏️ Edit」時載入既有資料
  useEffect(() => {
    reset(editing ?? {});         // undefined ⇒ 清空
  }, [editing, reset]);

  const save = async (data) => {
    if (editing) {
      await api.put(`/records/${editing._id}`, data);
    } else {
      await api.post('/records', data);
    }
    onDone();          // 關閉編輯模式
    refresh();         // 重新抓資料
  };

  return (
    <form onSubmit={handleSubmit(save)} className="space-y-2 border p-4 rounded">
      <input
        type="date"
        {...register('date')}
        className="border px-2 py-1"
      />
      <span className="text-red-500 text-sm">{errors.date?.message}</span>

      <input
        placeholder="產線"
        {...register('line')}
        className="border px-2 py-1"
      />
      <span className="text-red-500 text-sm">{errors.line?.message}</span>

      <input
        placeholder="產品"
        {...register('product')}
        className="border px-2 py-1"
      />

      <select {...register('shift')} className="border px-2 py-1">
        {['A', 'B', 'C'].map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="產量"
        {...register('quantity')}
        className="border px-2 py-1"
      />
      <span className="text-red-500 text-sm">{errors.quantity?.message}</span>

      <input
        type="number"
        step="0.001"
        placeholder="不良率 (0-1)"
        {...register('defectRate')}
        className="border px-2 py-1"
      />
      <span className="text-red-500 text-sm">{errors.defectRate?.message}</span>

      <textarea
        placeholder="備註"
        {...register('notes')}
        className="border px-2 py-1 w-full"
      />

      <div className="space-x-2">
        <button className="bg-emerald-600 text-white px-4 py-1 rounded">
           儲存
        </button>
        {editing && (
          <button
            type="button"
            onClick={onDone}
            className="bg-gray-500 text-white px-4 py-1 rounded"
          >
            取消
          </button>
        )}
      </div>
    </form>
  );
}
