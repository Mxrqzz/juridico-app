const express = require("express");
const cors = require("cors");

const agendamentosRouter = require("./routes/agendamentos");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/agendamentos", agendamentosRouter);

app.get("/", (req, res) => {
  res.send("API de Agendamentos está funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
