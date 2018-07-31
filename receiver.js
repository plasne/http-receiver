
// includes
const cmd = require("commander");
const express = require("express");
const bodyParser = require("body-parser");

// define command line parameters
cmd
    .version("0.1.0")
    .option("-p, --port <integer>", `PORT. The port to host the web services on. Defaults to "8100".`, parseInt)
    .option("-f, --format <string>", `FORMAT. The format of the body ("text" or "json"). Defaults to "json".`, /^(text|json)$/i)
    .parse(process.argv);

// globals
const port       = cmd.port       || process.env.PORT                || 8100;
const format     = cmd.format     || process.env.FORMAT              || "json";

// log
console.log(`FORMAT = "${format}"`);

// startup express
const app = express();
switch (format) {
    case "json":
        app.use(bodyParser.json({
            limit: "50mb"
        }));
        break;
    case "text":
        app.use(bodyParser.text({
            limit: "50mb"
        }));
        break;
    default:
        app.use(bodyParser.raw({
            limit: "50mb"
        }));
        break;
}

// receive
app.all("/", (req, res) => {
    console.log(`METHOD = "${req.method}"`);
    console.log(req.headers);
    console.log(req.body);
    console.log("");
    res.status(200).end();
});

// listen for web traffic
app.listen(port, () => {
    console.log("info", `Listening on port ${port}...\n`);
});