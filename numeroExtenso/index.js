const numero = require('numero-por-extenso');

const monetario = 37.49;
const porcentagem = 45;

//monetário
console.log(numero.porExtenso(monetario, numero.estilo.monetario));

//porcentagem
console.log(numero.porExtenso(porcentagem, numero.estilo.porcentagem));