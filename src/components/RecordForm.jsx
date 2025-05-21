import { useState } from 'react';
import api from '../api';

export default function RecordForm({ refresh, editing, onDone }) {
  const empty = {date:'',line:'1',product:'',shift:'A',quantity:0,defectRate:0,notes:''};
  const [f,setF] = useState(editing ?? empty);
  const h = e => setF({...f,[e.target.name]:e.target.value});
  const save = async e=>{
    e.preventDefault();
    editing ? await api.put(`/records/${editing._id}`,f)
            : await api.post('/records',f);
    onDone();refresh();
  };
  return (
    <form onSubmit={save} className="space-y-2">
      <input type="date" name="date" value={f.date} onChange={h} required/>
      <input name="line" value={f.line} onChange={h} placeholder="產線"/>
      <input name="product" value={f.product} onChange={h} placeholder="產品"/>
      <select name="shift" value={f.shift} onChange={h}>{['A','B','C'].map(s=><option key={s}>{s}</option>)}</select>
      <input type="number" name="quantity" value={f.quantity} onChange={h}/>
      <input type="number" name="defectRate" value={f.defectRate} onChange={h} step="0.001" min="0" max="1"/>
      <textarea name="notes" value={f.notes} onChange={h}/>
      <button>💾</button>{editing&&<button type="button" onClick={onDone}>取消</button>}
    </form>
  );
}
