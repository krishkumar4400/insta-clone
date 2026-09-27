import express from 'express';
import cors from "cors";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello Express");
});

export default app;
