/**
 * A server using 'express' (npm install express)
 */
const express = require("express");
const fs = require("fs");
//const pth = require("path");

const PORT = process.env.PORT || 5000;

// Initialise
const app = express();

app.listen(PORT);

// Set "public" as files to be served statically
app.use(express.static("public"));


/**
 * Set specific routes
 */
/*
app.get("/", function (req, res) {

    let path = req.path;
    if(path === "/") path = "/index.html";

    path = "." + path;

    console.log("req = " + path);

    fs.exists(path, (exists) => {
        if(exists) {
            res.status(200);

            const ext = pth.extname(path);
            console.log("ext=" + ext + " contentType=" + getContentType(ext));

            res.contentType(getContentType(ext));

            res.sendFile(path, { root: "." });
        } else {

        }
    });

    //console.log(util.inspect(req));

    //console.dir(req);


});

function getContentType(ext) {
    let contentType;
    switch(ext) {
        case ".js":
        case ".mjs":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".html":
            contentType = "text/html";
            break;
        default:
            contentType = "text/plain";
            break;
    }
    return contentType;
}
*/