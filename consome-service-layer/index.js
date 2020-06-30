var fs = require('fs');
var admin = require('service-layer-admin');
var sl = new admin({
    server: 'https://192.168.1.24:50000/b1s/v1/',
    database: 'SBODEMOBRGO',
    sapUser: 'manager',
    sapPassword: '1234'
});


const insereNFS = () =>{
    var nfs = {
        "DocDate" : "2012-01-22",
        "TaxDate" : "2012-01-22",
        "DocDueDate" : "2012-02-22",
        "CardCode" : "C20000",
        "Comments" : "Based On Sales Quotations 1. Based On Sales Orders 1. Based On Deliveries 1.",
        "PaymentGroupCode" : 16,
        "SalesPersonCode" : 2,
        "SeriesString" : "1",
        "PaymentMethod" : null,
        "BPL_IDAssignedToInvoice" : null,
        "SequenceCode" : 27,
        "SequenceSerial" : 194,
        "SequenceModel" : "39",
        "OpeningRemarks" : "",
        "ClosingRemarks" : "",
     
        "U_SKILL_EndServ": "",
        "U_SKILL_ServRua": "",
        "U_SKILL_ServNumero": "",
        "U_SKILL_ServComple": "",
        "U_SKILL_ServBairro": "",
        "U_SKILL_ServCEP": "",
        "U_SKILL_ServTipLog": "",
        "U_SKILL_ObraPref": "",
        "U_SKILL_NumEncapsula": "",
        "U_SKILL_TipoTrib": "",
        "U_SKILL_tsCodigoObra": "",
        "U_SKILL_tsART": "",
        "DocumentLines" : [
           {
              "ItemCode" : "A00001",
              "ItemDescription" : "J.B. Impressora Officeprint 1420",
              "Quantity" : 5.0,
              "Price" : 1255.0,
              "Usage" : 9,
              "TaxCode" : "5101-001",
              "CSTforPIS" : "01",
              "CSTforCOFINS" : "01",
              "WTLiable" : "tYES",
              "U_SKILL_TotTribIBPT":""
           }
        ]
     }

     sl.insertNFS(nfs)
        .then(console.log)
        .catch(console.error)
}
const getPN = () =>{
    sl.getPN('C20000')
        //.then(JSON.parse)
        .then(json => {
            fs.writeFileSync('./pns.json', json, 'utf-8')
        })
        .catch(err => console.error('GETPN', err))
}

const insertLCM = () =>{
    var debito = {"ShortName": 'C20000', "Debit": 10};
    var credito = {"ShortName": 'C20000', "Credit": 10};
    var obj = {JournalEntryLines: []};

    for(var i = 0; i< 10000; i++){
        obj.JournalEntryLines.push(debito);
        obj.JournalEntryLines.push(credito);
    }

    sl.insertLCM(obj)
        .then(console.log('foi'))
        .catch(console.error)
}


setTimeout( insertLCM, 7000)
// setTimeout( () => 
//     sl.getNFS('1')
//         //.then(JSON.parse)
//         .then(json => {
//             fs.writeFileSync('./nfs.json', json, 'utf-8')
//         })
//         .catch(err => console.error('GETPN', err))
// , 7000)
