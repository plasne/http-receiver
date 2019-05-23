// includes
const cmd = require('commander');
const axios = require('axios');

// define command line parameters
cmd.version('0.1.0')
    .option(
        '-m, --method <string>',
        `METHOD. The method to use when sending a packet. Defaults to "POST".`
    )
    .option('--url <string>', `[REQUIRED] URL. The URL to send the packet to.`)
    .option(
        '-f, --format <string>',
        `FORMAT. The format to use when sending a packet ("text", "json", or "xml"). Defaults to "json".`
    )
    .option(
        '-u, --username <string>',
        `USERNAME. The username to send. If you specify this you must also specify the PASSWORD.`
    )
    .option(
        '-p, --password <string>',
        `PASSWORD. The password to send. If you specify this you must also specify the USERNAME.`
    )
    .parse(process.argv);

// globals
const METHOD = cmd.method || process.env.METHOD || 'POST';
const URL = cmd.url || process.env.URL;
const FORMAT = cmd.format || process.env.FORMAT || 'json';
const USERNAME = cmd.username || process.env.USERNAME;
const PASSWORD = cmd.password || process.env.PASSWORD;

// log
console.log(`METHOD   = "${METHOD}"`);
console.log(`URL      = "${URL}"`);
console.log(`FORMAT   = "${FORMAT}"`);
console.log(`USERNAME = "${USERNAME}"`);
console.log(`PASSWORD = "${PASSWORD}"`);

// generate the body
let data = null;
switch (FORMAT) {
    case 'text':
        data = 'test message.';
        break;
    case 'json':
        data = { msg: 'test message.' };
        break;
    case 'xml':
        data = '<msg>test message<msg>';
        break;
}

// add authetication
let auth = null;
if (USERNAME && PASSWORD)
    auth = {
        username: USERNAME,
        password: PASSWORD
    };

// send the message
axios({
    method: METHOD,
    url: URL,
    data: data,
    auth: auth
})
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
