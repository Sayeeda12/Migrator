const express = require('express');
const fibrous = require('@sap/fibrous');
const path = require('path');
const app = express();

app.use(fibrous.middleware);

const csvWriter = require('./public/javascripts/csvWriter');
const port = process.env.PORT || 3000;

app.get("/fetchData/:offset", async (req, resp) => {
    let res = await csvWriter.readDataAndWriteIntoCSV(req.params.offset, req.query.siteId, req.query.from, req.query.to);
    resp.download(path.resolve(__dirname, './public/data/data.csv')).send("Download complete");
});

const server = app.listen(port, () => {
    console.log("Application is listening at port:"+port);
});

server.timeout = 0;