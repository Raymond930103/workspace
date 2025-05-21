import {useEffect,useState} from 'react';
import api from '../api';
import RecordForm from './RecordForm';
import {LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid} from 'recharts';

export default function RecordTable(){
  const [rows,setRows]=useState([]);
  const [edit,setEdit]=useState(null);
  const refresh=()=>api.get('/records').then(r=>setRows(r.data));
  useEffect(()=>{refresh();},[]);
  const del=async id=>{await api.delete(`/records/${id}`);refresh();};
  return (
    <div className="p-4">
      <RecordForm refresh={refresh} editing={edit} onDone={()=>setEdit(null)}/>
      <table className="border w-full mt-4">
        <thead><tr><th>日期</th><th>線</th><th>產品</th><th>班</th><th>量</th><th>不良率</th><th/></tr></thead>
        <tbody>{rows.map(r=>(
          <tr key={r._id}>
            <td>{new Date(r.date).toLocaleDateString()}</td>
            <td>{r.line}</td><td>{r.product}</td><td>{r.shift}</td>
            <td>{r.quantity}</td><td>{(r.defectRate*100).toFixed(2)}%</td>
            <td><button onClick={()=>setEdit(r)}>✏️</button><button onClick={()=>del(r._id)}>🗑️</button></td>
          </tr>))}
        </tbody>
      </table>
      <LineChart width={600} height={250} data={rows}>
        <CartesianGrid stroke="#555"/>
        <XAxis dataKey="date" tickFormatter={d=>new Date(d).toLocaleDateString()}/>
        <YAxis/>
        <Tooltip/>
        <Line dataKey="quantity" stroke="#82ca9d"/>
      </LineChart>

    </div>
  );
}
