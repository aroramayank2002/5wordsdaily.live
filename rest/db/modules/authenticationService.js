const db = require("./dbService.js");
const { v4: uuidv4 } = require('uuid');


// let docClient = new AWS.DynamoDB.DocumentClient();

function insertToLoginTable(userObject){
    return new Promise((resolve, reject) =>{
        console.log("userObject: " + JSON.stringify(userObject));
        let sessionId = `${Math.random().toString(36).substring(4)}-${new Date().toISOString()}`;
        // let sessionId = `asasaaasasa`;
        let queryStr = `INSERT INTO public.login(email, login_at, "sessionId") VALUES ('${userObject.email}', '${new Date().toISOString()}', '${sessionId}')`
        console.log(queryStr);
        db.executeQueryPromise(queryStr).then((res) =>{
            console.log(`Promis res ${res}`);
            resolve({"msg":"saved", "email": userObject.email, "name": userObject.name,"sessionId" : sessionId});
        }).catch((err) => {
            console.log("Error: " + JSON.stringify(err));
            reject(err);
        });
    });
}

function insertUserIfDoesNotExists(paramsObj){
    console.log("insertUserIfDoesNotExists:", JSON.stringify(paramsObj));
    return new Promise((resolve, reject) =>{
        // INSERT INTO public.user (email, session_id) VALUES ('areor@fadf.com', 'dsfdsfsdfsdfsdfs') ON CONFLICT (email) DO UPDATE SET session_id = 'dsfdsfsdfsdfsdfs'
        let queryStr = `INSERT INTO public.user (email, name, session_id) VALUES ('${paramsObj.email}', '${paramsObj.name}', '${paramsObj.sessionId}') ON CONFLICT (email) DO UPDATE SET session_id = '${paramsObj.sessionId}'`;
        db.executeQueryPromise(queryStr).then((res) =>{
            console.log(`Promis res ${res}`);
            resolve({"msg":"saved", sessionId:paramsObj.sessionId});
        }).catch((err) =>{
            reject(err);
        });
    });
}

function login(userObject){
    return new Promise((resolve, reject) => {
        insertToLoginTable(userObject).then((params) => {
            console.log("Added userObject:", JSON.stringify(params));
            return insertUserIfDoesNotExists(params);
        }).then( (data) => {
            console.log("Added user:", JSON.stringify(data));
            resolve(data);
        }).catch((err) => {
            console.log("Error login:", err);
            reject(err);
        });
    });
}

function insertToLoginTableIfOld(paramsObj){
    console.log("insertToLoginTableIfOld:", JSON.stringify(paramsObj));
        return new Promise((resolve, reject) =>{
            //INSERT INTO public.user (email, session_id) VALUES ('areor@fadf.com', 'dsfdsfsdfsdfsdfs') ON CONFLICT (email) DO UPDATE SET session_id = 'dsfdsfsdfsdfsdfs'
            let selectUsr = `SELECT count(*) FROM public.login WHERE email='${paramsObj.name}'`;
            db.executeQueryPromise(selectUsr).then((res) =>{
                //console.log(`select from login res ${JSON.stringify(res)}`);
                //console.log(`select login res ${res.rowData[0].count}`);
                if(parseInt(res.rowData[0].count) >= 1){
                    resolve({"msg":"saved", sessionId:paramsObj.sessionId});
                }else{
                    console.log("inserting into login");
                    //let queryStr = `INSERT INTO public.login (email, name, session_id) VALUES ('${paramsObj.name}', '${paramsObj.name}', '${paramsObj.sessionId}') ON CONFLICT (email) DO UPDATE SET session_id = '${paramsObj.sessionId}'`;
                    let queryStr = `INSERT INTO public.login(email, login_at, "sessionId") VALUES ('${paramsObj.name}', '${new Date().toISOString()}', '${paramsObj.sessionId}')`
                    //console.log(`${queryStr}`);
                    db.executeQueryPromise(queryStr).then((res) =>{
                        //console.log(`Insert into login res ${JSON.stringify(res)}`);
                        resolve({"msg":"saved", sessionId:paramsObj.sessionId});
                    }).catch((err) =>{
                        console.log("ERROR on insert into login")
                        reject(err);
                    });
                }

            }).catch((err) =>{
                console.log("ERROR on select from login")
                reject(err);
            });

        });
}

function getLatestSessionId(paramsObj){
    console.log("getLatestSessionId:", JSON.stringify(paramsObj));
        return new Promise((resolve, reject) =>{
            //INSERT INTO public.user (email, session_id) VALUES ('areor@fadf.com', 'dsfdsfsdfsdfsdfs') ON CONFLICT (email) DO UPDATE SET session_id = 'dsfdsfsdfsdfsdfs'
            let selectUsr = `SELECT * FROM public.login WHERE email='${paramsObj.name}' order by login_at desc limit 1`;
            db.executeQueryPromise(selectUsr).then((res) =>{
                //console.log(`Promis res ${JSON.stringify(res)}`);
                resolve({"msg":"saved", sessionId:res.rowData[0].sessionId});
            }).catch((err) =>{
                reject(err);
            });
        });
}





function checkIfExists(paramsObj){
    console.log("checkIfExists:", JSON.stringify(paramsObj));
        return new Promise((resolve, reject) =>{
            // INSERT INTO public.user (email, session_id) VALUES ('areor@fadf.com', 'dsfdsfsdfsdfsdfs') ON CONFLICT (email) DO UPDATE SET session_id = 'dsfdsfsdfsdfsdfs'
            let queryStr = `SELECT count(user) FROM public.user WHERE name='${paramsObj.username}' AND password='${paramsObj.password}'`;
            db.executeQueryPromise(queryStr).then((res) =>{
                //console.log(`Select res ${(res.rowData[0].count)}`);
                //console.log(`Select res ${(JSON.stringify(res))}`);
                if(res.rowData[0].count == 1){
                    let sessionId = uuidv4();
                    //console.log(`generated sessionId ${sessionId}`);

                    insertToLoginTableIfOld({name: paramsObj.username, sessionId: sessionId})
                    .then((res) => {
                        //console.log(`insert res ${JSON.stringify(res)}`);
                        resolve({"msg":"saved", sessionId:sessionId});
                    })
                    .catch((err) => {
                        console.log(`err ${JSON.stringify(err)}`);
                        reject({"msg":"Login failed", "status": "error"})
                    });

                }else{
                    reject({"msg":"Login failed", "status": "error"})
                }
            }).catch((err) =>{
                reject(err);
            });
        });
}

function loginUsername(userObject){
    return new Promise((resolve, reject) => {
        checkIfExists(userObject)
        .then((response) => {
            //console.log("Login userObject:", JSON.stringify(response));
            resolve(response);
        }).catch((err) => {
            console.log("Error login:", err);
            reject(err);
        });
    });
}

function verifyUsernameLogin(userObject){
    console.log(`verifyUsernameLogin ${JSON.stringify(userObject)}`);
    return getLatestSessionId(userObject);
}

function getUserId(sessionId){
    return new Promise((resolve, reject) =>{
        // console.log(`getUserId ${email}`)
        //queryStr = "select id from public.user where session_id='"+sessionId+"'";
        queryStr = `select u.id from public.login l, public.user u where l."sessionId"='${sessionId}' AND l.email=u.email`;
        db.executeQueryPromise(queryStr)
        .then((res) =>{
            // console.log(`Promis res ${JSON.stringify(res)}`);
            // console.log(`Promis res ${res.rowData}`);
            // console.log(`Promis res ${res.rowData[0].id}`);
            if(res.rowData && res.rowData[0]){
                resolve({id: res.rowData[0].id});
            }else{
                reject(`User id not found for sessionId '${sessionId}'`)
            }

        }).catch((err) =>{
            console.log(`err ${err}`)
            reject(err);
        });
    })
}

module.exports = {
    login: login,
    getUserId: getUserId,
    loginUsername: loginUsername,
    verifyUsernameLogin: verifyUsernameLogin
}

// login({email: "areor@fadf.com", name: "Mayank"});
// node ./rest/db/modules/authenticationService.js
