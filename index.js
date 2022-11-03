const express = require("express");
const cors = require("cors");

var nunjucks = require("nunjucks");

const app = express();
const fs = require("fs");

var expressWinston = require("express-winston");
var winston = require("winston");

http_codes = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  103: "Early Hints",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a Teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  509: "Bandwidth Limit Exceeded",
  510: "Not Extended",
  511: "Network Authentication Required",
};

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "{{req.method}} {{req.url}} {{req.status}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  })
);

var imgs = fs.readdirSync(`${__dirname}/imgs`);

//remove the dir name from the img path
imgs = imgs.map(function (file) {
  return file.split("/").pop();
});

nunjucks.configure(".", {
  autoescape: true,
  express: app,
});

app.get("/", (req, res) => {
  res.render(`${__dirname}/static/index.html`, {
    urls: imgs,
    statuscodes: http_codes,
  });
});

app.get("/:code", cors(), (req, res) => {
  try {
    //check if file exists
    var fp =
      __dirname + "/imgs/" + req.params.code.replace(".jpg", "") + ".jpg";
    if (fs.existsSync(fp)) {
      res.sendFile(fp);
    } else {
      throw "e";
    }
  } catch (err) {
    console.error(err);
    res.status(404).sendFile(__dirname + "/imgs/404.jpg");
  }
});

//static handling
app.get("/static/:path", (req, res) => {
  try {
    var fp = `${__dirname}/static/${req.params.path}`;
    if (fs.existsSync(fp)) {
      res.sendFile(fp);
    } else {
      throw "e"; //cq: ignore
    }
  } catch (err) {
    console.error(err);
    res.status(404).sendFile(`${__dirname}/imgs/404.jpg`);
  }
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(`${__dirname}/static/favicon.jpg`);
});

app.get("/static/favicon.ico", (req, res) => {
  res.sendFile(`${__dirname}/static/favicon.jpg`);
});

//print every request
app.on("response", (req, res) => {
  console.log("Request:" + req.url);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
