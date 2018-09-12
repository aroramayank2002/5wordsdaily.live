const db = require("./dbService.js");
const translation = require("./authenticationService");
const calendar =require('node-calendar');
// let docClient = new AWS.DynamoDB.DocumentClient();


function getUserId(sessionId){
    return new Promise((resolve, reject) =>{
        // console.log(`getUserId ${sessionId}`)
    queryStr = "select id from public.user where session_id='"+sessionId+"'";
    db.executeQueryPromise(queryStr).then((res) =>{
        console.log(`Promis res ${JSON.stringify(res)}`);
        resolve(res.rowData[0].id);
    });
    })
    
}

function saveWord(userObject){
    return new Promise((resolve, reject) =>{
        console.log(`saveWord ${userObject.sessionId}, ${userObject.word}, ${userObject.meaning}`)
        const today = new Date().toISOString().split("T")[0];
        getUserId(userObject.sessionId).then((user_id)=>{
            console.log(`UserId: ${user_id}`)
            queryStr = `INSERT INTO public.meaning(meaning, word, date, user_id) VALUES ('${userObject.meaning}', '${userObject.word}', '${today}', ${user_id});`
            return db.executeQueryPromise(queryStr)
            .then((res) =>{
                console.log(`saveWord Promis res ${JSON.stringify(res)}`);
            }).then(()=> {
                return db.executeQueryPromise(`SELECT count(word) FROM public.meaning where date='${today}' AND user_id='${user_id}'`)  
            }).then((res)=> {
                console.log(`saveWord Promis res count ${JSON.stringify(res)}`);
                resolve({"msg":"saved", "totalWordsToday":res.rowData[0].count});
            }).catch((err) =>{
                reject(err);
            });
        });
    });
}

function getWords(reqObject){
    return new Promise((resolve, reject) =>{
        console.log(`saveWord ${reqObject.sessionId}`)
        db.executeQueryPromise(`select id,word from public.meaning where user_id=(select id from public.user where session_id='${reqObject.sessionId}') order by id desc`)
        .then((res) =>{
            console.log(`getWords Promis res ${JSON.stringify(res)}`);
            resolve({"msg":"fetched", "words":res.rowData});
        }).catch((err) =>{
            reject(err);
        });
    });
}

function getTranslation(reqObject) {
    return new Promise((resolve, reject) =>{
        console.log(`getTranslation ${reqObject.word}`)
        db.executeQueryPromise(`select meaning from public.dictionary where word='${reqObject.word.toLowerCase()}'`)
        .then((res) =>{
            console.log(`getTranslation Promis res ${JSON.stringify(res)}`);
            resolve({"msg":"fetched", "meaning":res.rowData});
        }).catch((err) =>{
            reject(err);
        });
    });
}

function getWord(reqObject) {
    return new Promise((resolve, reject) =>{
        console.log(`getWord ${reqObject.wordId}`)
        db.executeQueryPromise(`select meaning from public.meaning where id='${reqObject.wordId}'`)
        .then((res) =>{
            console.log(`getWord Promis res ${JSON.stringify(res)}`);
            resolve({"msg":"fetched", "meaning":res.rowData});
        }).catch((err) =>{
            reject(err);
        });
    });
}

function deleteWord(reqObject) {
    return new Promise((resolve, reject) =>{
        console.log(`deleteWord ${reqObject.wordId}`)
        db.executeQueryPromise(`delete from public.meaning where id='${reqObject.wordId}'`)
        .then((res) =>{
            console.log(`deleteWord Promis res ${JSON.stringify(res)}`);
            resolve({"msg":"fetched", "deleted":res.rowData});
        }).catch((err) =>{
            reject(err);
        });
    });
}

function  getWordCountForMonth(reqObject){
    return new Promise((resolve, reject) =>{
        // console.log(`getWordCountForMonth ${reqObject.sessionId} '${reqObject.month}' '${reqObject.year}'`)
        translation.getUserId(reqObject.sessionId)
        .then((result) =>{
            let arr1 = new calendar.Calendar(0).itermonthdates(reqObject.year, reqObject.month + 1);
            return db.executeQueryPromise(`SELECT count(word), date  FROM public.meaning where user_id='${result.id}' and date between '${arr1[0].toDateString()}' and '${arr1[arr1.length - 1 ].toDateString()}' group by date;`)
        })
        .then((res) =>{
            console.log(`Promis res getWordCountForMonth ${JSON.stringify(res)}`);
            resolve({"msg":"fetched", "data":res.rowData});
        }).catch((err) =>{
            reject(err);
        });
    });
}

function getQuiz(reqObject){
    return new Promise((resolve, reject) =>{
        console.log(`getQuiz ${reqObject.sessionId}`)
        translation.getUserId(reqObject.sessionId)
        .then((result) =>{
            return db.executeQueryPromise(`select id, word,meaning,getRandomMeanings('${result.id}',id) as optional_meanings from public.meaning as words where user_id='${result.id}' ORDER BY random() limit 5 ;`);
        })
        .then((res) =>{
            console.log(`Promis res getQuiz ${JSON.stringify(res.rowData)}`);
            resolve({"msg":"fetched", "data":res.rowData});
        }).catch((err) =>{
            reject(err);
        });
    });
}

function getWordsForDate(reqObject){
    return new Promise((resolve, reject) =>{
        console.log(`getWordsForDate ${reqObject.sessionId} ${reqObject.date}`)
        // resolve({"msg":"saved"});
        translation.getUserId(reqObject.sessionId)
        .then((result) =>{
            // console.log(`getWordsForDate ${result.id}`)
            // let date = new Date(reqObject.date)
            return db.executeQueryPromise(`SELECT word, meaning FROM public.meaning where user_id='${result.id}' AND date='${reqObject.date}';`);
        })
        .then((res) =>{
            // console.log(`Promis getWordsForDate res.rowData ${JSON.stringify(res.rowData)}`);
            resolve({"msg":"fetched", "data":res.rowData});
        }).catch((err) =>{
            console.log(`Error: ${err}`)
            reject(err);
        });
    });
}


function getSuggestion(reqObject){
    return new Promise((resolve, reject) =>{
    console.log(`getSuggestion ${reqObject.sessionId} ${reqObject.word}`)
    // Possible improvement
    // select distinct word, char_length(word) length from public.dictionary where word like'%gor%' order by length limit 10;
    db.executeQueryPromise(`select distinct word, char_length(word) as length from public.dictionary where word like'%${reqObject.word.toLowerCase()}%' order by length limit 10 ;`)
        .then((res) =>{
            console.log(`Promis getSuggestion res.rowData ${JSON.stringify(res.rowData)}`);
            resolve({"msg":"fetched", "data":res.rowData});
        }).catch((err) =>{
            console.log(`Error: ${err}`)
            reject(err);
        })
    }); 
}


function updateQuiz(reqObject){
    return new Promise((resolve, reject) =>{
        console.log(`updateQuiz ${reqObject.sessionId} ${JSON.stringify(reqObject.result)}`)
        resolve({"msg":"saved"});
        // translation.getUserId(reqObject.sessionId)
        // .then((result) =>{
        //     return db.executeQueryPromise(`select id, word,meaning,getRandomMeanings(16,'${result.id}') as optional_meanings from public.meaning as words where user_id='${result.id}' ORDER BY random() limit 5 ;`);
        // })
        // .then((res) =>{
        //     console.log(`Promis res getQuiz ${JSON.stringify(res.rowData)}`);
        //     resolve({"msg":"fetched", "data":res.rowData});
        // }).catch((err) =>{
        //     reject(err);
        // });
    });
}

module.exports = {
    saveWord: saveWord,
    getWords: getWords,
    getTranslation: getTranslation,
    getWord: getWord,
    deleteWord: deleteWord,
    getWordCountForMonth: getWordCountForMonth,
    getQuiz: getQuiz,
    updateQuiz: updateQuiz,
    getWordsForDate: getWordsForDate,
    getSuggestion: getSuggestion
}

// saveWord({sessionId: "7cqeejtmb-2018-07-23T14:56:52.385Z", word: "pojke", meaning: "boy"});
// getWords({sessionId: "p4l5pm4mo-2018-07-23T13:58:53.760Z"});
// getWordCountForMonth({sessionId: '7rpkby0p-2018-08-01T13:38:21.628Z', month: 5, year: 2018}).then(()=>{return;});;
// getQuiz({sessionId: '7rpkby0p-2018-08-01T13:38:21.628Z'});
// getWordsForDate({sessionId: '7rpkby0p-2018-08-01T13:38:21.628Z', date: '2018-07-27'});
// getSuggestion({sessionId: 'n7065chm8-2018-08-06T13:45:09.795Z', word: 'myck'});
// node ./rest/db/modules/translationService.js