const hana = require("@sap/hana-client");
const conn = hana.createConnection();

const vcap_services = {};

const conn_params = {
    serverNode: vcap_services.hana[0].credentials.host + ":" + vcap_services.hana[0].credentials.port,
    encrypt: true,
    currentschema: vcap_services.hana[0].credentials.schema,
    uid: vcap_services.hana[0].credentials.user,
    pwd: vcap_services.hana[0].credentials.password
};

module.exports = {
    getConnection : function() {
        return new Promise((resolve, reject) => {
            try{
                conn.connect(conn_params, (err) =>{
                    if(err){
                        console.error("Error:"+err);
                        reject(err);
                    }
                    resolve(conn);
                });
            }
            catch(err){
                console.error("Error:"+err);
                reject(err);
            }
        });
    }
}
