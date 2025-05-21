import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log('✅ MongoDB connected'))
  .catch(console.error);

const schema = new mongoose.Schema({
  date: Date,
  line: String,
  product: String,
  shift: String,
  quantity: Number,
  defectRate: Number,
  notes: String
});
const Record = mongoose.model('Record', schema);

app.get('/api/records', async (_,res)=>res.json(await Record.find().sort({date:-1})));
app.post('/api/records', async (req,res)=>res.json(await Record.create(req.body)));
app.put('/api/records/:id', async (req,res)=>res.json(await Record.findByIdAndUpdate(req.params.id, req.body, {new:true})));
app.delete('/api/records/:id', async (req,res)=>{await Record.findByIdAndDelete(req.params.id);res.sendStatus(204);});

app.listen(4000, ()=>console.log('🚀 API http://localhost:4000'));
