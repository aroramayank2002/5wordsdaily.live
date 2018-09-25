const pg = require('pg');
const { Client, Query } = require('pg')
pg.defaults.poolSize = 25;
var connectionString_local = {
    user: 'mayank',
    host: 'aan5srvu48sd9s.cjwh4o87vc70.us-west-2.rds.amazonaws.com',
    database: 'ebdb',
    password: '12345678',
    port: 5432,
};


var connectionString_aws2 = {
    user: process.env.RDS_USERNAME || 'postgres',
    host: process.env.RDS_HOSTNAME || 'localhost',
    database: process.env.RDS_DB_NAME || 'postgres',
    password: process.env.RDS_PASSWORD || 'admin',
    port: process.env.RDS_PORT || 5432,
};

let conn = connectionString_local;
if (process.env.RDS_USERNAME) {
    conn = connectionString_aws2;
    console.log(`${conn.user}, ${conn.host}, ${conn.database}, ${conn.password}`)
}

var client = new pg.Client(conn);
client.connect();

var pool = new pg.Pool(conn);

let queryStr = "SELECT NOW();"

function executeQueryPromise1(queryStr) {
    // console.log(`Executing promis query version 2: ${queryStr}, conn: ${conn}`);
    return new Promise((resolve, reject) => {

        //var id = event.id;
        // console.log("Connected to PostgreSQL database: client: " +client);
        var query = client.query(queryStr);
        query.then((res) => {
            // console.log(JSON.stringify(res.rows));
            // client.end(res);
            res.rowData = res.rows;
            resolve(res);
        }).catch((err) => {
            console.log(`Error executing query: ${err}`)
            reject(err);
        });
    });
}

function executeQueryPromise(queryStr) {
    console.log(`Executing promis query version 1: ${queryStr}`);
    // console.log(`Executing promis query version 1: ${queryStr}`);

    var rowData = [];
    return new Promise((resolve, reject) => {
        pool.connect(
            function (err, client, done) {
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

function getUserId(email) {
    return new Promise((resolve, reject) => {
        // console.log(`getUserId ${email}`)
        queryStr = "select id from public.user where email='" + email + "'";
        executeQueryPromise(queryStr).then((res) => {
            // console.log(`Promis res ${res.id}`);
            resolve(res.id);
        });
    })
}


function ping() {
    return new Promise((resolve, reject) => {
        queryStr = "select count(id) as status from public.user";
        executeQueryPromise(queryStr).then((res) => {
            console.log(`Promis res ${JSON.stringify(res.rowData[0])}`);
            resolve(res.rowData[0]); //{"status":1}
        });
    })
}

module.exports = {
    getUserId: getUserId,
    executeQueryPromise: executeQueryPromise1,
    ping: ping
}

// getUserId("arora@gmail.com");
// saveWord("arora@gmail.com","mycket","much")
// executeQueryPromise1("select * from public.meaning;")