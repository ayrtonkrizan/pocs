var crypto = require('crypto'), 
    shasum = crypto.createHash('sha256'),
    dt = require('node-datetime'),
    rp = require("request-promise"),
    fs = require("fs");
/** Constantes do programa **/
const CONFIG = {
    authClientId: 7,
    secretAPIKey: '0cyUoO3R',
    // APIurl: 'https://palmeirastest.roboticket.com/Api/'
    APIurl: 'https://ingressospalmeiras.com.br/Api/'
}

///Exemplo de entrada e saída
///authClientId=1&accountId=123&authDateTime=2015-09-16 08:47:24Pas5pr@se
///fZUMHrNd6xh26TQz8c7pClCkdp7RBxyTMJGoFVjAY74=
const generateChave = (str) => shasum.update(str).digest('base64');

const callAPI = (action, params) => {
    let data = dt.create(new Date().toLocaleString('en-US', {timeZone: 'UTC'}));
    let dataEnvio = data.format('Y/m/d H:M:S');
    params = params || [];
    let paramsString = params.map(y=> `${y.chave}=${y.valor}`).join('&');
    paramsString = paramsString? paramsString+'&':'';
    let linkParam = `authClientId=${CONFIG.authClientId}&${paramsString}authDateTime=${dataEnvio}`;
    let link = `${CONFIG.APIurl}${action}?${linkParam}&authHash=${generateChave(`${linkParam}${CONFIG.secretAPIKey}`)}`;
    
    console.log(link);

    rp(link)
        .then(JSON.parse)
        .then(json => {
            console.log(JSON.stringify(json))
            fs.writeFile(`./retornos/${action}_${data.format('YmdHMS')}.js`, JSON.stringify(json), 'utf8')
            // fs.writeFile('message.txt', 'Hello Node.js', 'utf8');
        })
        .catch((res) => console.error('error: ', res.error || res))
}

//callAPI('GetAccountById', [{chave:'id', valor: 2}]);
// callAPI('GetEvent', [{chave:'id', valor: 405}]);
//callAPI('GetTransaction');
//callAPI('GetSeasonTicket', 'id', 1); como saber o id correto da season?
// callAPI('BulkTransactions', [{chave: 'since', valor: '2019/10/28 00:00:00'}, {chave: 'to', valor: '2019/10/31 23:59:59'}]); //Sem autorização 
callAPI('BulkTransactions', [{chave: 'since', valor: '2019/10/05 00:00:00'}, {chave: 'to', valor: '2019/11/05 23:59:59'}]); //Sem autorização 
// callAPI('BulkBoughtProducts', [{chave: 'since', valor: '2019/10/05 00:00:00'}, {chave: 'to', valor: '2019/11/05 23:59:59'}]); //Sem autorização 
// callAPI('GetUserProductsEx');
// callAPI('GetCards');



// console.log(dt.create(nDate).format('Y/m/d H:M:S'));  
//console.log(nDate)
