const express = require('express');
const fibrous = require('@sap/fibrous');
const path = require('path');
const fs = require('fs')
const zip = require('express-zip');
const app = express();

app.use(fibrous.middleware);

const csvWriter = require('./public/javascripts/csvWriter');
const port = process.env.PORT || 3000;

app.get("/fetchData", async (req, resp) => {
    //Clear the files before writing again
    fs.truncate(path.resolve(__dirname, './public/data/data.csv'), 0, function(){
        console.log('Cleared data.csv');
    });
    fs.truncate(path.resolve(__dirname, './public/data/data1.csv'), 0, function(){
        console.log('Cleared data1.csv');
    });
    fs.truncate(path.resolve(__dirname, './public/data/data2.csv'), 0, function(){
        console.log('Cleared data2.csv');
    });
    fs.truncate(path.resolve(__dirname, './public/data/data3.csv'), 0, function(){
        console.log('Cleared data3.csv');
    });
    fs.truncate(path.resolve(__dirname, './public/data/data4.csv'), 0, function(){
        console.log('Cleared data4.csv');
    });

    let res = await csvWriter.readDataAndWriteIntoCSV(req.query.siteId, req.query.date);
    
    if(res)
        resp.zip([
            {path: path.resolve(__dirname, './public/data/data.csv'), name: "1-" + req.query.siteId + " " + req.query.date + ".csv"},
            {path: path.resolve(__dirname, './public/data/data1.csv'), name: "2-" + req.query.siteId + " " + req.query.date + ".csv"},
            {path: path.resolve(__dirname, './public/data/data2.csv'), name: "3-" + req.query.siteId + " " + req.query.date + ".csv"},
            {path: path.resolve(__dirname, './public/data/data3.csv'), name: "4-" + req.query.siteId + " " + req.query.date + ".csv"},
            {path: path.resolve(__dirname, './public/data/data4.csv'), name: "5-" + req.query.siteId + " " + req.query.date + ".csv"}
        ]);
    else
        resp.send("Either there is no data or you've passed invalid siteId or date value. Allowed date range is March 1st to June 20, 2021");
});

const server = app.listen(port, () => {
    console.log("Application is listening at port:"+port);
});

server.timeout = 0;