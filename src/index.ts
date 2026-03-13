import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import sequelize from '../Model/dbconfig';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRoutes from './Routes/Auth';

const app = express()
const port = 3000

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*" }));

app.get('/test', (req, res) => {
  res.send('Hello World!')
});

app.use("/auth",AuthRoutes);

app.listen(port, () => {
  sequelize.sync().then(() => {
    console.log(`Server running at http://localhost:${port}`);
  });
})