# api-medicamentos-anvisa
API pública para pesquisa de medicamentos cadastrados na base de dados da ANVISA.

## 📝 Sobre

Esta API permite consultar medicamentos registrados na base de dados da ANVISA de forma simples e rápida, retornando informações em formato JSON.

## 🌐 URL Base

A API está disponível publicamente em:  
`(https://api-medicamentos-anvisa.vercel.app/)`

## 🚦 Rotas

### 1. 📋 Listar todos os medicamentos

- **Endpoint:** `/`
- **Método:** `GET`
- **Descrição:** Retorna todos os medicamentos disponíveis.

**Exemplo de uso:**
```bash
curl https://api-medicamentos-anvisa.vercel.app/
```

### 2. Buscar medicamentos por nome

- **Endpoint:** `/:nome`
- **Método:** `GET`
- **Descrição:** Retorna todos os medicamentos cujo nome contenha o termo pesquisado (case-insensitive).

**Exemplo de uso:**
```bash
curl https://api-medicamentos-anvisa.vercel.app/dipirona
```

### 3. Buscar medicamentos por nome com limite de resultados

- **Endpoint:** `/:nome?limit=N`
- **Método:** `GET`
- **Descrição:** Retorna até `N` medicamentos cujo nome contenha o termo pesquisado.

**Exemplo de uso:**
```bash
curl "https://api-medicamentos-anvisa.vercel.app/dipirona?limit=2"
```

## Exemplo de resposta

```json
[
    {
         "NOME_PRODUTO": "DIPIRONA SÓDICA",
         "LABORATORIO": "XYZ FARMA",
         "REGISTRO": "123456789",
         "PRINCIPIO_ATIVO": "Dipirona Sódica"
    }
]
```

## Observações

- O parâmetro `limit` é opcional e limita a quantidade de itens retornados.
- Caso não haja correspondência, será retornado um array vazio.

## Licença

MIT
