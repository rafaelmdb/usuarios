const express = require('express'); //Framework backend do Node
const cors = require("cors"); //Permite requisição entre domínios diferentes (para o frontend conseguir chamar o Node, que fica noutra porta)
const bodyParser = require("body-parser"); //Decodifica o conteúdo do body enviado através da requisição no Postman

const app = express(); //Inicia o backend

let port = 5000; //Porta do aplicativo backend

app.use(bodyParser.json()); //Configura o backend

//Toda URL que inicia por /api vai para o gerenciamento de rotas
const routes = require('./routes/api');
app.use('/api', routes);

//Habilita CORS
app.use(cors());

//Inicia o servidor na porta 5000
app.listen(process.env.port || port, () =>{
    console.log('Servidor em execução na porta: ' + port);
});