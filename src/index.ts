import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import sequelize from '../Model/dbconfig';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRoutes from './Routes/Auth';
import ImageRoutes from './Routes/Image';
import BannerRoutes from './Routes/Banners';

const app = express()
const port = 3000

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (no Origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.get('/test', (req, res) => {
  res.send('Hello World!')
});

app.use("/auth",AuthRoutes);
app.use("/image",ImageRoutes);
app.use("/ecom",BannerRoutes);

app.listen(port, () => {
  sequelize.sync().then(() => {
    console.log(`Server running at http://localhost:${port}`);
  });
})