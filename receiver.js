// includes
const cmd = require("commander");
const express = require("express");
const basicAuth = require("express-basic-auth");
const bodyParser = require("body-parser");

// define command line parameters
cmd.version("0.1.0")
    .option(
        "-p, --port <integer>",
        `PORT. The port to host the web services on. Defaults to "8100".`,
        parseInt
    )
    .option(
        "-f, --format <string>",
        `FORMAT. The format of the body ("text" or "json"). Defaults to "json".`,
        /^(text|json)$/i
    )
    .option(
        "-s, --show <string>",
        `SHOW. Can be "full" (show headers+body) or "body" (show body only) Defaults to "full".`
    )
    .option(
        "-r, --response-code <integer>",
        `RESPONSE_CODE. The HTTP response code that should be returned.`,
        parseInt
    )
    .option(
        "-u, --username <string>",
        `USERNAME. The server will require the specified username using Basic Auth. If you specify this you must also specify the PASSWORD.`
    )
    .option(
        "-p, --password <string>",
        `PASSWORD. The server will require the specified password using Basic Auth. If you specify this you must also specify the USERNAME.`
    )
    .parse(process.argv);

// globals
const PORT = cmd.port || process.env.PORT || 8100;
const FORMAT = cmd.format || process.env.FORMAT || "json";
const SHOW = cmd.show || process.env.SHOW || "full";
const RESPONSE_CODE = cmd.responseCode || process.env.RESPONSE_CODE || 200;
const USERNAME = cmd.username || process.env.USERNAME;
const PASSWORD = cmd.password || process.env.PASSWORD;

// log
console.log(`PORT          = "${PORT}"`);
console.log(`FORMAT        = "${FORMAT}"`);
console.log(`SHOW          = "${SHOW}"`);
console.log(`RESPONSE_CODE = "${RESPONSE_CODE}"`);
console.log(`USERNAME      = "${USERNAME}"`);
console.log(`PASSWORD      = "${PASSWORD}"`);

// startup express
const app = express();
switch (FORMAT) {
    case "json":
        app.use(
            bodyParser.json({
                limit: "50mb",
                type: "*/*"
            })
        );
        break;
    case "text":
        app.use(
            bodyParser.text({
                limit: "50mb",
                type: "*/*"
            })
        );
        break;
    default:
        app.use(
            bodyParser.raw({
                limit: "50mb",
                type: "*/*"
            })
        );
        break;
}

// support basic authentication
function mayRequireAuth(req, res, next) {
    if (USERNAME && PASSWORD) {
        const users = {};
        users[USERNAME] = PASSWORD;
        return basicAuth({
            users: users,
            challenge: true
        })(req, res, next);
    } else {
        next();
    }
}

// receive
app.all("*", mayRequireAuth, (req, res) => {
    console.log(new Date());
    if (SHOW !== "body") {
        console.log(`PATH = "${req.path}"`);
        console.log(`METHOD = "${req.method}"`);
        console.log(req.headers);
    }
    console.log(req.body);
    console.log("");
    res.status(RESPONSE_CODE).end();
});

// for health probes
app.all("/health", (_, res) => {
    res.status(200).end();
});

// listen for web traffic
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
    if (USERNAME && PASSWORD) console.log("Basic Auth will be required.");
    console.log("");
});
