import express from "express";
import cors from 'cors';
import Fuse from "fuse.js";

const app = express();
const port = 8080;
const apiUrl = "https://ferr-ffk.github.io/medicamentos/"

const options = {
    keys: ["NOME_PRODUTO"], // campos a pesquisar
    threshold: 0.3 // sensibilidade da busca (0 = exato, 1 = super flexível)
};

app.use(cors())

function procurarMedicamento(med, data) {
    possiveisMedicamentos = [];

    data.forEach((medicamento) => {
        if (medicamento['NOME_PRODUTO'].toLowerCase().includes(med.toLowerCase())) {
            possiveisMedicamentos.push(medicamento);
        }
    });

    return possiveisMedicamentos.sort((a, b) => a['NOME_PRODUTO'].length - b['NOME_PRODUTO'].length);
}

function procurarMedicamentoFuse(med, data) {
    const fuse = new Fuse(data, options);

    const resultado = fuse.search(med);

    return resultado.map((item) => item.item);
}

function readJsonFile(file, callback) {
    fetch(apiUrl + file)
        .then(response => response.text())
        .then(data => callback(data))
        .catch(error => {
            console.error("Error fetching file:", error);
            callback("[]");
        });
}   

app.get("/", (req, res) => {
  readJsonFile("medicamentos.json", function(text){
    const data = JSON.parse(text);

    res.send(data); // Sends the data after fetching it
  });
});

app.get("/:nome", (req, res) => {
    const nome = req.params.nome;
    const simplified = req.query.simplified;

    if (nome === "favicon.ico") {
        res.status(204).send(); // No content for favicon requests

        return;
    }

    console.log("Pesquisa por medicamento:", nome);
    console.log("Simplified:", simplified);

    if (simplified) {
        readJsonFile("medicamentos-reduzido.json", function(text){
            const data = JSON.parse(text);
    
            console.log("Dados carregados:", data.length, "medicamentos encontrados");

            let possiveisMedicamentos = procurarMedicamentoFuse(nome, data);
            let limit = 0;
    
            if (req.query.limit > 0) {
                limit = parseInt(req.query.limit);
    
                possiveisMedicamentos = possiveisMedicamentos.slice(0, limit);
            }

            console.log("Possíveis medicamentos encontrados:", possiveisMedicamentos.length);
    
            res.json(possiveisMedicamentos);

            return;
        });
    }


    readJsonFile("medicamentos.json", function(text){
        const data = JSON.parse(text);

        console.log("Dados carregados:", data.length, "medicamentos encontrados");

        let possiveisMedicamentos = procurarMedicamentoFuse(nome, data);

        console.log("Possíveis medicamentos encontrados:", possiveisMedicamentos.length);

        res.json(possiveisMedicamentos);

        return;
    });
});

app.get("/vacinas", (req, res) => {
    readJsonFile("vacinas.json", function(text) {
        const data = JSON.parse(text);
        res.send(data);
    });
});

app.get("/vacinas/:nome", (req, res) => {
    const nome = req.params.nome;

    if (nome === "favicon.ico") {
        res.status(204).send(); // No content for favicon requests
        return;
    }

    console.log("Pesquisa por vacina:", nome);

    readJsonFile("vacinas.json", function(text) {
        const data = JSON.parse(text);
        let possiveisVacinas = [];

        data.forEach((vacina) => {
            if (vacina['NOME_PRODUTO'].toLowerCase().includes(nome.toLowerCase())) {
                possiveisVacinas.push(vacina);
            }
        });

        res.json(possiveisVacinas);
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default app; // Export the app for testing purposes
