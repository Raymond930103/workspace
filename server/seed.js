import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const data = [[
  { "date": "2025-05-01", "line": "1", "product": "Widget-A", "shift": "A", "quantity": 1200, "defectRate": 0.015, "notes": "" },
  { "date": "2025-05-01", "line": "2", "product": "Widget-B", "shift": "B", "quantity": 980,  "defectRate": 0.022, "notes": "" },
  { "date": "2025-05-02", "line": "1", "product": "Widget-A", "shift": "C", "quantity": 1100, "defectRate": 0.013 },
  { "date": "2025-05-02", "line": "3", "product": "Gizmo-X",  "shift": "A", "quantity": 760,  "defectRate": 0.031 },
  { "date": "2025-05-03", "line": "2", "product": "Widget-B", "shift": "B", "quantity": 1050, "defectRate": 0.018 },
  { "date": "2025-05-03", "line": "3", "product": "Gizmo-X",  "shift": "C", "quantity": 820,  "defectRate": 0.027 },
  { "date": "2025-05-04", "line": "1", "product": "Widget-A", "shift": "A", "quantity": 1300, "defectRate": 0.012 },
  { "date": "2025-05-04", "line": "2", "product": "Widget-B", "shift": "C", "quantity": 990,  "defectRate": 0.020 },
  { "date": "2025-05-05", "line": "3", "product": "Gizmo-X",  "shift": "B", "quantity": 890,  "defectRate": 0.024 },
  { "date": "2025-05-05", "line": "1", "product": "Widget-A", "shift": "B", "quantity": 1230, "defectRate": 0.016 }
]];
const recordSchema = new mongoose.Schema({date:Date,line:String,product:String,shift:String,quantity:Number,defectRate:Number,notes:String});
const Record = mongoose.model('Record', recordSchema);

mongoose.connect(process.env.MONGO_URI).then(async()=>{
  await Record.insertMany(data);
  console.log('✔️  seed done'); process.exit();
});
