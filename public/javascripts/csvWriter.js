const connection = require('./connection');
const objToCsv = require('objects-to-csv');
const {response} = require('express');
const path = require('path');
const ObjectsToCsv = require('objects-to-csv');
const e = require('express');
var conn;

module.exports = {
    writeIntoCsv: async function(offset){
        if(conn == undefined)
            conn = await connection.getConnection();
        var result = [];
        let query = "SELECT  \"pageUrl\", \"pageTitle\", \"customEventValue\", \"eventType\", \"createdDate\", \"ipAdr\", \"visitCount\", \"custom1\", \"custom2\", \"siteId\", \"subSiteId\", \"custom10\", \"visitorUUID\", \"custom15\" FROM \"com.sap.swa::WEBEVENT_VIEW\" where \"siteId\" = '2bcdec4d-0cbd-440f-9602-6bdee004700f' and \"created\" >= '2021-03-01 00:00:01' and \"created\" <= '2021-03-01 23:59:59' limit 3000 offset " + offset;

        console.log("beginning: "+offset);
        return new Promise((resolve, reject) => {
            let prepStmt = conn.prepare(query);
            
            prepStmt.execQuery([], async (err, rows) =>{
                if(err){
                    console.error("Error:"+err);
                    resolve(false);
                }
            
                console.log("Query executed");
                while (rows.next()) {
                    result.push(rows.getValues());
                }
                console.log("Push complete. Writing into file...");
            
                const csv = new ObjectsToCsv(result);
                console.log("CSV data created");
                await csv.toDisk(path.resolve(__dirname, '../data/data.csv'), {append: true});
                console.log("Writing complete for offset:"+offset);
                resolve(true);
            });
        }); 
    },

    readDataAndWriteIntoCSV : async function(off){
        var offset = parseInt(off);        
        while(offset < 1000000){
            console.log("good to go!");
            let result = await this.writeIntoCsv(offset);
            if(result)
                offset += 3000;
            else
                process.exit(1);
        }
        return;
    }
}