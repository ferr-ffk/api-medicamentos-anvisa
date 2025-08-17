import express from "express";
import cors from 'cors';

const app = express();
const port = 8080;
const apiUrl = "https://raw.githubusercontent.com/ferr-ffk/medicamentos/refs/heads/master/"

app.use(cors())

function readTextFile(file, callback) {
    fetch(apiUrl + file)
        .then(response => response.text())
        .then(data => callback(data))
        .catch(error => {
            console.error("Error fetching file:", error);
            callback("[]");
        });
}   

app.get("/", (req, res) => {
  readTextFile("medicamentos.json", function(text){
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
        readTextFile("medicamentos-reduzido.json", function(text){
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

            console.log("Possíveis medicamentos encontrados:", possiveisMedicamentos.length);
    
            res.json(possiveisMedicamentos);
        });

        return;
    }


    readTextFile("medicamentos.json", function(text){
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

        return;
    });

});

app.get("/vacinas", (req, res) => {
    readTextFile("vacinas.json", function(text) {
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

    readTextFile("vacinas.json", function(text) {
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
