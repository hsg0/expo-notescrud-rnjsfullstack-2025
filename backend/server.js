import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectMongoDB from './config/mongoDB.js';
import notesRouter from './routes/notesRoutes.js';


dotenv.config();

connectMongoDB();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:8081",      // web / iOS simulator on same Mac
    "http://127.0.0.1:8081",
   
  ],
  methods: ["GET","POST","PUT","PATCH","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('Server is healthy');
});

app.use('/api/notes', notesRouter);


const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});