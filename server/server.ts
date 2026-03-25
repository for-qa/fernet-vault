import express from 'express';
import cors from 'cors';
import routes from './api/routes';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 8102;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
