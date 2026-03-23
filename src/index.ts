import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import sequelize from '../Model/dbconfig';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRoutes from './Routes/Auth';
import ImageRoutes from './Routes/Image';
import BannerRoutes from './Routes/Banners';
import ProductRoutes from './Routes/Product';
import { Client } from "@elastic/elasticsearch";
import model from "../Model/model";

const es = new Client({ node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200" });
const app = express()
const port = 3000


const elasticSearchSetup = async () => {
  try {
    const indexName = "products";
    const exist = await es.indices.exists({ index: indexName });
    if(!exist) {
      await es.indices.create({
        index: indexName,
        mappings: {
          properties: {
            id: { type: "long" },
            Name: { type: "text" },
            Description: { type: "text" },
            Price: { type: "double" },
            ImageKey: { type: "keyword" },
            IsDiscounted: { type: "boolean" },
            DiscountPercentage: { type: "integer" },
            IsBestSeller: { type: "boolean" },
          },
        },
      });
    }
    const data = await model.ProductDetails.findAll();
    const bulkData = data.map((item) => ({
      id: item.dataValues.id,
      Name: item.dataValues.Name,
      Description: item.dataValues.Description,
      Price: item.dataValues.Price,
      ImageKey: item.dataValues.ImageKey,
      IsDiscounted: item.dataValues.IsDiscounted,
      DiscountPercentage: item.dataValues.DiscountPercentage,
      IsBestSeller: item.dataValues.IsBestSeller,
    }));
    
    await es.helpers.bulk({
      datasource: bulkData, // must include `id`
      onDocument(doc) {
        return { index: { _index: "products", _id: String(doc.id) } };
      },
      refreshOnCompletion: true,
    });
    console.log("Elasticsearch setup completed successfully.");
  } catch (error) {
    console.error("Error setting up Elasticsearch:", error);
  }
};

elasticSearchSetup();


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

// app.get("/search", async (req, res) => {
//   const { q } = req.query;
//   if (!q) {
//     return res.status(400).json({ error: "Query parameter 'q' is required" });
//   }
//   try {
//     const queryText = String(q); // Explicitly cast q to string
//     const body = {
//       query : {
//         multi_match:{
//           query : queryText,
//           fields : ["Name^2","Description"],
//           fuzziness: "AUTO"
//         }
//       },
//       suggest:{
//         text : queryText,
//         simple_phrase : {
//           phrase : {
//             field : "Name",
//             size : 1,
//             gram_size : 2,
//           }
//       }
//     }
//   };
//   const {hits , suggest} = await es.search({
//     index: "products", body
//   });  
//   const results = hits.hits.map((hit) => hit._source);
//   const data = { results, suggest: suggest?.simple_phrase };
//   return res.json(data);
//   } catch (error) {
//     console.error("Error searching products:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.get('/test', (req, res) => {
  res.send('Hello World!')
});

app.use("/auth",AuthRoutes);
app.use("/image",ImageRoutes);
app.use("/ecom",BannerRoutes);
app.use("/product",ProductRoutes);

app.listen(port, () => {
  sequelize.sync().then(() => {
    console.log(`Server running at http://localhost:${port}`);
  });
})

export default es;