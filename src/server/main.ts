import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

const PORT = 4000;

//middleware

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => console.log(`App listening on Port: ${PORT}`));
