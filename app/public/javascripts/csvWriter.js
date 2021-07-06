const connection = require('./connection');
const path = require('path');
const ObjectsToCsv = require('objects-to-csv');
var conn;
var count = 0;

module.exports = {
    writeIntoCsv: function(offset, siteId, date){
        // if(conn == undefined)
        //     conn = await connection.getConnection();
        var result = [];
        let query = "SELECT  \"pageUrl\", \"pageTitle\", \"customEventValue\", \"eventType\", \"createdDate\", \"ipAdr\", \"visitCount\", \"custom1\","
            query += " \"custom2\", \"siteId\", \"subSiteId\", \"custom10\", \"visitorUUID\", \"custom15\" FROM \"com.sap.swa::WEBEVENT_VIEW\""
            query += " where \"siteId\" = '" + siteId + "' and \"createdDate\" = '" + date +"' limit 10000 offset " + offset;

        console.log("beginning: "+offset);
        return new Promise((resolve, reject) => {
            let prepStmt = conn.prepare(query);
            
            try{
                prepStmt.execQuery([], async (err, rows) =>{
                    if(err){
                        console.error("Error:"+err);
                        resolve(false);
                    }
                
                    while (rows.next()) {
                        result.push(rows.getValues());
                    }
                    console.log("Query execution complete. Writing into file...:"+result.length);
                
                    var csv = new ObjectsToCsv(result);
                    var paths = {path : '../data/data.csv'};

                    if(offset > 4000000)
                        paths.path = '../data/data8.csv';
                    else if(offset > 3500000)
                        paths.path = '../data/data7.csv';
                    else if(offset > 3000000)
                        paths.path = '../data/data6.csv';
                    else if(offset > 2500000)
                        paths.path = '../data/data5.csv';
                    else if(offset > 2000000)
                        paths.path = '../data/data4.csv';
                    else if(offset > 150000)
                        paths.path = '../data/data3.csv';
                    else if(offset > 1000000)
                        paths.path = '../data/data2.csv';
                    else if(offset > 500000)
                        paths.path = '../data/data1.csv';
        
                    await csv.toDisk(path.resolve(__dirname, paths.path), {append: true});
                    console.log("Writing complete for offset:"+offset);
                    resolve(true);
                });
            }
            catch(error) {
                console.log("ERROR:"+error);
                reject(false);
            };

        })
        .catch(error => {
            console.log("ERROR:"+error);
            reject(false);
        }); 
    },

    getCount: async function(siteId, from){
        if(conn == undefined)
            conn = await connection.getConnection();

        let sql = "SELECT COUNT(1) AS COUNT FROM \"com.sap.swa::WEBEVENT_VIEW\"";
            sql += " where \"siteId\" = '" + siteId + "' and \"createdDate\" = '" + from + "'";

        return new Promise((resolve, reject) => {

            let prepStmt = conn.prepare(sql);
            let result = [];
                
            prepStmt.execQuery([], async (err, rows) =>{
                if(err){
                    console.error("Error:"+err);
                    reject(false);
                }

                while(rows.next()){
                    result.push(rows.getValues());
                }

                count = result[0].COUNT;
                resolve(count);
            });
        })
        .catch(error => {
            console.log("ERROR:"+error);
        });
    },

    readDataAndWriteIntoCSV : async function(siteId, date){
        let sites = ['32b13764-4aee-4ff5-9f6e-a53644324251','eb25f4f0-3a20-4864-be8f-faceb551edb6','0f229b98-84a5-d10c-502c-487a6fbffd16','6580bf0c-90f2-b4cd-ceb3-91262246d61d','ca7efed4-82d8-4a00-bbae-a740001d54ea','4ba983f3-ec6d-5321-b83d-416f55f7ab91','1a6f9906-cff2-a978-24ad-3d3e604559b3','52976f43-bcdf-78f8-18a5-f24fa8fce091','2e0e56c0-2392-b99f-ea7b-5e8589c67bd0','2bcdec4d-0cbd-440f-9602-6bdee004700f'];
        if(sites.indexOf(siteId) == -1)
            return false;
        count = await this.getCount(siteId, date);
        if(count == 0)
            return false;
        console.log("count:"+count);
        var offset = 0;  
        if(date < '2021-03-01' || date > '2021-06-20')
            return false;      
        while(offset < count){
            let result = await this.writeIntoCsv(offset, siteId, date);
            if(result)
                offset += 10000;
            else
                process.exit(1);
        }
        return true;
    }
}