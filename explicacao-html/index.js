var divList = document.getElementById('lista');

const funcPreencheLista = (results)=>{
    
    divList.innerHTML = results.map( function(d) {
        return `
        <li>
            <h1>${d.name}</h1>
            <p>${d.birth_year}</p>
        </li>
        `
    } ).join('')

}

// fetch('https://swapi.co/api/people').then(res=>res.json()).then(data=> funcPreencheLista(data.results))

