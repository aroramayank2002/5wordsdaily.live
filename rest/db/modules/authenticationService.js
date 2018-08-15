const db = require("./dbService.js");

// let docClient = new AWS.DynamoDB.DocumentClient();

function insertToLoginTable(userObject){
    return new Promise((resolve, reject) =>{
        let sessionId = `${Math.random().toString(36).substring(4)}-${new Date().toISOString()}`;
        // let sessionId = `asasaaasasa`;
        let queryStr = `INSERT INTO public.login(email, login_at, "sessionId") VALUES ('${userObject.email}', '${new Date().toISOString()}', '${sessionId}')`
        db.executeQueryPromise(queryStr).then((res) =>{
            console.log(`Promis res ${res}`);
            resolve({"msg":"saved", "email": userObject.email, "name": userObject.name,"sessionId" : sessionId});
        }).catch((err) => {
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

function getUserId(sessionId){
    return new Promise((resolve, reject) =>{
        // console.log(`getUserId ${email}`)
        queryStr = "select id from public.user where session_id='"+sessionId+"'";
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
    getUserId, getUserId
}

// login({email: "areor@fadf.com", name: "Mayank"});
// node ./rest/db/modules/authenticationService.js