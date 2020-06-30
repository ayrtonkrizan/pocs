const rp = require('request-promise');
rp('https://www.receitaws.com.br/v1/cnpj/61750345000157').then(console.log).catch(console.error)