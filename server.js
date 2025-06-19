import express from "express";
import cors from 'cors';

const app = express();
const port = 8080;

app.use(cors())

function readTextFile(file, callback) {
    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(text => callback(text))
        .catch(error => console.error('Error fetching file:', error));
}   

app.get("/", (req, res) => {
  readTextFile("https://ferr-ffk.github.io/api-medicamentos/medicamentos.json", function(text){
    const data = JSON.parse(text);

    res.send(data); // Sends the data after fetching it
  });
});

app.get("/:nome", (req, res) => {
    const nome = req.params.nome;

    if (nome === "favicon.ico") {
        res.status(204).send(); // No content for favicon requests

        return;
    }

    console.log("Pesquisa por medicamento:", nome);

    readTextFile("https://ferr-ffk.github.io/medicamentos/medicamentos.json", function(text){
        const data = JSON.parse(text);

        console.log("Dados carregados:", data.length, "medicamentos encontrados");

        let possiveisMedicamentos = [];
        let limit = 0;

        data.forEach((medicamento) => {
            if (medicamento['NOME_PRODUTO'].toLowerCase().includes(nome.toLowerCase())) {
                possiveisMedicamentos.push(medicamento);
            }
        });

        if (req.query.limit > 0) {
            limit = parseInt(req.query.limit);

            possiveisMedicamentos = possiveisMedicamentos.slice(0, limit);
        }

        res.json(possiveisMedicamentos);
    });
    
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default app; // Export the app for testing purposes
