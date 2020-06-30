var Imap = require("imap");
var MailParser = require("mailparser").MailParser;
// var Promise = require("bluebird");
// Promise.longStackTraces();

var imapConfig = {
    user: 'ayrton.krizan@gruposkill.com.br',
    password: 'JVciUll8vw',
    host: 'email-ssl.com.br',
    port: 993,
    tls: true
};

var imap = new Imap(imapConfig);
// Promise.promisifyAll(imap);

imap.once("ready", execute);
imap.once("error", function (err) {
    console.error("Connection error: " + err.stack);
});

imap.connect();

function execute() {
    imap.openBox("INBOX", false, function (err, mailBox) {
        if (err) {
            console.error(err);
            return;
        }
        imap.search(["UNSEEN"], function (err, results) {
            if (!results || !results.length) {
                console.log("No unread mails");
                imap.end();
                return;
            }

            // imap.setFlags(results, ['\\Seen'], function (err) {
            //     if (!err) {
            //         console.log("marked as read");
            //     } else {
            //         console.log(JSON.stringify(err, null, 2));
            //     }
            // });

            var f = imap.fetch(results, { bodies: "TEXT"});
            f.on("message", processMessage);
            f.once("error", function (err) {
                console.error(err);
            });
            f.once("end", function () {
                console.log("Done fetching all unseen messages.");
                imap.end();
            });
        });
    });
}


function processMessage(msg, seqno) {
    console.log("Processing msg #" + seqno);
    // console.log(msg);

    var parser = new MailParser();
    parser.on("headers", function (headers) {
        console.log("Header: ", headers);
    });

    parser.on('data', data => {
        console.log(Object.keys(data))
        console.log(data.type)
        console.log(data.headers)
        if (data.type === 'text') {
            console.log(seqno);
            console.log(data.textAsHtml);  /* data.html*/
        }

        // if (data.type === 'attachment') {
        //     console.log(data.filename);
        //     data.content.pipe(process.stdout);
        //     // data.content.on('end', () => data.release());
        // }
    });

    msg.on("body", function (stream) {
        stream.on("data", function (chunk) {
            parser.write(chunk.toString("utf8"));
        });
    });
    msg.once("end", function () {
        // console.log("Finished msg #" + seqno);
        parser.end();
    });
}