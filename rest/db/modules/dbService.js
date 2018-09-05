const pg = require('pg');
const { Client, Query } = require('pg')
pg.defaults.poolSize = 25;
var connectionString_local = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
  };

  var connectionString_aws = {
    user: 'adminadmin',
    // host: 'postgreinstance.cjwh4o87vc70.us-west-2.rds.amazonaws.com',
    host: '54.244.135.205',    
    database: 'postgres',
    password: '12345678',
    port: 5432,
  };

  var connectionString_aws2 = {
    user: process.env.RDS_USERNAME || 'adminadmin',
    host: process.env.RDS_HOSTNAME || 'myrestoreddb.cjwh4o87vc70.us-west-2.rds.amazonaws.com',
    database: 'ebdb',
    password: process.env.RDS_PASSWORD || '12345678',
    port: process.env.RDS_PORT || 5432,
  };

  let conn = connectionString_local;
  if(process.env.RDS_USERNAME){
    conn = connectionString_aws2;
  }
  
  var client = new pg.Client(conn);
  client.connect();
  
  var pool = new pg.Pool(conn);
  
  let queryStr = "SELECT NOW();"

  function executeQueryPromise1(queryStr){
    // console.log(`Executing promis query version 2: ${queryStr}, conn: ${conn}`);
      return new Promise((resolve, reject) =>{
        
        //var id = event.id;
        // console.log("Connected to PostgreSQL database: client: " +client);
        var query = client.query(queryStr);
        query.then((res) => {
            // console.log(JSON.stringify(res.rows));
            // client.end(res);
            res.rowData = res.rows;
            resolve(res);
        }).catch((err) =>{
            console.log(`Error executing query: ${err}`)
            reject(err);
      });
    });
}

  function executeQueryPromise(queryStr){
    console.log(`Executing promis query version 1: ${queryStr}`);
    // console.log(`Executing promis query version 1: ${queryStr}`);
    
    var rowData = [];
    return new Promise((resolve, reject) =>{
        pool.connect(
            function(err, client, done) {
            // console.log(`client: ${client}`)
            const query = client.query(new pg.Query(queryStr))

            query.on('row', (row) => {
                console.log(`row: ${JSON.stringify(row)}`);
                // resolve(row);
                rowData.push(row);
            })
            query.on('end', (res) => {
                // pool shutdown
                // {"command":"INSERT","rowCount":1,"oid":0,"rows":[],"fields":[],"_parsers":[],"RowCtor":null,"rowAsArray":false}
                console.log(`query end ${JSON.stringify(res)}`);
                res.rowData = rowData;
                resolve(res);
                // pool.end()
            })
            query.on('error', (res) => {
                reject(res);
                console.log(res);
            })    
            done()
        })
    })
    
  }
  
  function getUserId(email){
    return new Promise((resolve, reject) =>{
        // console.log(`getUserId ${email}`)
    queryStr = "select id from public.user where email='"+email+"'";
    executeQueryPromise(queryStr).then((res) =>{
        // console.log(`Promis res ${res.id}`);
        resolve(res.id);
    });
    })
}

// function saveWord(email, word, meaning){
//     return new Promise((resolve, reject) =>{
//         // console.log(`saveWord ${email}, ${word}, ${meaning}`)
//         getUserId(email).then((user_id)=>{
//             queryStr = `INSERT INTO public.meaning(meaning, word, date, user_id) VALUES ('get', 'far', '${new Date().toISOString().split("T")[0]}', ${user_id});`
//             executeQueryPromise(queryStr).then((res) =>{
//                 console.log(`Promis res ${res}`);
//                 resolve({"msg":"saved"});
//             }).catch((err) =>{
//                 reject(err);
//             });
//         });
//     });
// }



module.exports = {
    // saveWord: saveWord,
    getUserId:getUserId,
    // executeQueryPromise: executeQueryPromise
    executeQueryPromise: executeQueryPromise1
}

// getUserId("arora@gmail.com");
// saveWord("arora@gmail.com","mycket","much")
// executeQueryPromise1("select * from public.meaning;")