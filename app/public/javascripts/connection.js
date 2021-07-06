const hana = require("@sap/hana-client");
const conn = hana.createConnection();

const vcap_services = {"hana": [{  "binding_name": null,"credentials": { "driver": "com.sap.db.jdbc.Driver", "hdi_password": "Fb9b9mEwxujqh_pC4obOD.Sa2VKJacDdQWp3-5XZIfbYhgFd0n6lD35Em3YcDroNa8NpINJKDOxNo6VxtphN-mC95iafgaxMS35jQftWF84NtN4oV5o6_IvchktrHk9I", "hdi_user": "SWA_7392W2REQ9XXEL41GKKWR8ITM_DT", "host": "9d8df5b6-b610-41a0-a4f2-0ea06a655786.hana.prod-eu10.hanacloud.ondemand.com", "password": "Dt2lsX9LQeVQdMa7fGJK8ulbZOthHsze2N70NVc6uG88mdtGM_CtoEyimXN.pZtYJRnRMZQLXqYT7dDkF_c1O3VW4KBgUggo202NTnHJ3LgLnjvRAUyD.f.x4MAbD6Zw", "port": "443", "schema": "SWA", "url": "jdbc:sap://9d8df5b6-b610-41a0-a4f2-0ea06a655786.hana.prod-eu10.hanacloud.ondemand.com:443?encrypt=true&validateCertificate=true&currentschema=SWA", "user": "SWA_7392W2REQ9XXEL41GKKWR8ITM_RT" }}]};

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
