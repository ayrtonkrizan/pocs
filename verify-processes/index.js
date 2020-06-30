const exec = require('child_process').exec;
const {processes, interval} = require('./config');

setInterval(()=>{
    var cmd = '';
    switch(process.platform){
        case 'linux':
            processes.map(p=>{
                exec(linuxFunction(p), (error, stdout, stderr) => handleCmdResult(error, stdout, stderr, p))
            })
            break;
        case 'win32':
            processes.map(p=>{
                exec(linuxFunction(p), (error, stdout, stderr) => handleCmdResult(error, stdout, stderr, p))
            })
            break;
    }
}, interval*1000)

const windowsFunction = (service) =>{
    return `service ${service} status`
}

const linuxFunction = (service) =>{
    return `service ${service} status`
}

const handleCmdResult = (error, stdout, stderr,service) => {
    console.log(service)
    if(error){
        console.log('aqui')

    }
}