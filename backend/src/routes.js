//para importar algo específico utilizamos chaves {}
const { Router } = require('express');

const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

//Metodos http: GET, POST, PUT e DELETE

/*
    Tipos de parâmetros:
        - Query Params: 
            Utilizado praticamente sempre nos métodos GET
            Ficam visíveis na url
            acessados através de request.query(Filtros, ordenação, paginação...)
        - Route Params:
            Acessado através de request.params (identificação do recurso na alteração ou delete)
        - Body:
            Dados para criação ou alteração de um registro

        MongoDB (Não-relacional)
*/
//async significa que a resposta pode demorar

routes.post('/devs', DevController.store);
routes.get('/devs', DevController.index);
routes.get('/search', SearchController.index);

module.exports = routes;