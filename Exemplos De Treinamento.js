var cars = [
    {
        'make': 'audi',
        'model': 'r8',
        'year': '2012'
    }, {
        'make': 'audi',
        'model': 'rs5',
        'year': '2013'
    }, {
        'make': 'ford',
        'model': 'mustang',
        'year': '2012'
    }, {
        'make': 'ford',
        'model': 'fusion',
        'year': '2015'
    }, {
        'make': 'kia',
        'model': 'optima',
        'year': '2012'
    },
];

cars.map(c=> {
    let newObj = {...c}
    newObj['label'] = fields.reduce((prev, current) => `${prev} - ${c[current]}`, '')
    return newObj
});

cars.map(c=> ({...c, label: fields.reduce((prev, current) => `${prev? `${prev} - `: ''}${c[current]}`, '')}));

let obj = cars.reduce((acumulador, atual) => {
	if(!acumulador[atual.make]) acumulador[atual.make] = []
	acumulador[atual.make] = acumulador[atual.make].concat({
		...atual,
		LineNum: acumulador[atual.make].length
	})
	return acumulador
} , {})

cars.reduce((acumulador, atual)=>{
    acumulador[atual.model] = atual.year;
    return acumulador;
}, {});

var timeOut = ()=>{
return new Promise((resolve, reject)=>{
	setTimeout( ()=>{
		resolve('uhul!!!')
	}, 1000)
})

}


var objetos = {
    obj1 :{
        a:{
            b:3
        }
    },
    obj2:{
        b:25
    }
}