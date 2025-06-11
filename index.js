const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8080;

const watsonX = require("./routes/watsonx");


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando!");
});

app.use("/watsonx", watsonX);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});