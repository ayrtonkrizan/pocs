var imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');

// var config = {
//     imap: {
//         user: 'ayrton.krizan@gruposkill.com.br',
//         password: 'JVciUll8vw',
//         host: 'email-ssl.com.br',
//         port: 993,
//         tls: true,
//         authTimeout: 3000
//     },
//     onmail: (...params) => console.log('aqui só vem a qtde que chegou', params)
// };

var config = {
    imap: {
        user: 'ouvidoriasocial@palmeiras.com.br',
        password: 'Os1914@',
        host: 'imap.idc2.mandic.com.br',
        port: 993,
        tls: true,
        authTimeout: 3000
    },
    onmail: (...params) => console.log('aqui só vem a qtde que chegou', params)
};

imaps.connect(config).then(function (connection) {
    console.log('conectei');
    return connection.openBox('INBOX').then(function () {
        var searchCriteria = ['UNSEEN'];
        var fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
        };
        return connection.search(searchCriteria, fetchOptions).then(function (messages) {
            messages.forEach(function (item) {
                var all = _.find(item.parts, { "which": "" })
                var id = item.attributes.uid;
                var idHeader = "Imap-Id: " + id + "\r\n";
                simpleParser(idHeader + all.body, (err, mail) => {
                    // access to the whole mail object
                    console.log(mail.subject)
                    console.log(mail.html)
                });
            });
        });
    });
});

// Esse de baixo deu ruim
// imaps.connect(config).then(function (connection) {
//     return connection.openBox('INBOX').then(function () {
//         var searchCriteria = ['UNSEEN'];
//         var fetchOptions = {
//             bodies: ['HEADER', 'TEXT'],
//         };
//         return connection.search(searchCriteria, fetchOptions).then(function (messages) {
//             messages.forEach(function (item) {
//                 var all = _.find(item.parts, { "which": "TEXT" })
//                 var html = (Buffer.from(all.body, 'base64').toString('ascii'));
//                 console.log(html)
//             });
//         });
//     });
// });

// imaps
//     .connect(config)
//     .then(function (connection) {

//         return connection
//             .openBox('INBOX')
//             .then(function () {
//                 var searchCriteria = [
//                     'UNSEEN'
//                 ];

//                 var fetchOptions = {
//                     bodies: ['HEADER', 'TEXT'],
//                     markSeen: false
//                 };

//                 return connection.search(searchCriteria, fetchOptions).then(function (results) {
//                     var subjects = results.map(function (res) {
//                         return res.parts.filter(function (part) {
//                             return part.which === 'HEADER';
//                         })[0].body.subject[0];
//                     });

//                     console.log(subjects);
//                 });
//             });
//     });