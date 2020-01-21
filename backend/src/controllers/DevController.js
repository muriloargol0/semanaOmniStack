const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

//Controller normalmente tem 5 funções: index, show, store, update e destroy

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();
        
        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

    if(!dev){
         //await serve para devolver a resposta para o front end somente quando possuir os dados
        const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

        //se o name não existe ele seta o valor do login como name
        const { name = login, avatar_url, bio } = apiResponse.data;

        const techsArray = parseStringAsArray(techs);

        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        }

        //no techs tivemos que colocar techs: techsArray pois o nome do campo era diferente do da propriedade
        dev = await Dev.create({
            github_username,
            name,
            avatar_url,
            bio,
            techs: techsArray,
            location,
        });

        //Filtrar as conexões que estão há no máximo 10km de distância
        //e que o novo dev tenha pelo menos uma das tecnologias filtradas
        const sendSocketMessageTo = findConnections(
            { latitude, longitude },
            techsArray,
        )

        sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return response.json(dev);
    }
}