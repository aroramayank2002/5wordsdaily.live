const db = require("./dbService.js");
const translation = require("./authenticationService");
const calendar = require('node-calendar');
// let docClient = new AWS.DynamoDB.DocumentClient();


function getUserId(sessionId) {
    return new Promise((resolve, reject) => {
        // console.log(`getUserId ${sessionId}`)
        queryStr = `select u.id from public.login l, public.user u where l."sessionId"='${sessionId}' AND l.email=u.email`;
        console.log(`getUserId query ${queryStr}`);
        db.executeQueryPromise(queryStr).then((res) => {
            console.log(`Promis res ${JSON.stringify(res)}`);
            resolve(res.rowData[0].id);
        });
    })

}

function saveWord(userObject) {
    return new Promise((resolve, reject) => {
        console.log(`saveWord ${userObject.sessionId}, ${userObject.word}, ${userObject.meaning}`)
        const today = new Date().toISOString().split("T")[0];
        getUserId(userObject.sessionId).then((user_id) => {
            console.log(`UserId: ${user_id}`)
            queryStr = `INSERT INTO public.meaning(meaning, word, date, user_id) VALUES ('${userObject.meaning}', '${userObject.word}', '${today}', ${user_id});`
            return db.executeQueryPromise(queryStr)
                .then((res) => {
                    console.log(`saveWord Promis res ${JSON.stringify(res)}`);
                }).then(() => {
                    return db.executeQueryPromise(`SELECT count(word) FROM public.meaning where date='${today}' AND user_id='${user_id}'`)
                }).then((res) => {
                    console.log(`saveWord Promis res count ${JSON.stringify(res)}`);
                    resolve({ "msg": "saved", "totalWordsToday": res.rowData[0].count });
                }).catch((err) => {
                    reject(err);
                });
        });
    });
}

function getWords(reqObject) {
    return new Promise((resolve, reject) => {
        console.log(`saveWord ${reqObject.sessionId}`)

        db.executeQueryPromise(`select m.id,m.word from public.meaning m WHERE m.user_id=(select u.id as id from public.login l,
                                    public.user u where l."sessionId"='${reqObject.sessionId}' AND l.email=u.email)`)
            .then((res) => {
                console.log(`getWords Promis res ${JSON.stringify(res)}`);
                resolve({ "msg": "fetched", "words": res.rowData });
            }).catch((err) => {
                reject(err);
            });
    });
}

function getTranslation(reqObject) {
    return new Promise((resolve, reject) => {
        console.log(`getTranslation ${reqObject.word}`)
        db.executeQueryPromise(`select meaning from public.dictionary where word='${reqObject.word.toLowerCase()}'`)
            .then((res) => {
                console.log(`getTranslation Promis res ${JSON.stringify(res)}`);
                resolve({ "msg": "fetched", "meaning": res.rowData });
            }).catch((err) => {
                reject(err);
            });
    });
}

function getWord(reqObject) {
    return new Promise((resolve, reject) => {
        console.log(`getWord ${reqObject.wordId}`)
        db.executeQueryPromise(`select meaning from public.meaning where id='${reqObject.wordId}'`)
            .then((res) => {
                console.log(`getWord Promis res ${JSON.stringify(res)}`);
                resolve({ "msg": "fetched", "meaning": res.rowData });
            }).catch((err) => {
                reject(err);
            });
    });
}

function deleteWord(reqObject) {
    return new Promise((resolve, reject) => {
        console.log(`deleteWord ${reqObject.wordId}`)
        db.executeQueryPromise(`delete from public.meaning where id='${reqObject.wordId}'`)
            .then((res) => {
                console.log(`deleteWord Promis res ${JSON.stringify(res)}`);
                resolve({ "msg": "fetched", "deleted": res.rowData });
            }).catch((err) => {
                reject(err);
            });
    });
}

function getWordCountForMonth(reqObject) {
    return new Promise((resolve, reject) => {
        // console.log(`getWordCountForMonth ${reqObject.sessionId} '${reqObject.month}' '${reqObject.year}'`)
        translation.getUserId(reqObject.sessionId)
            .then((result) => {
                let arr1 = new calendar.Calendar(0).itermonthdates(reqObject.year, reqObject.month + 1);
                return db.executeQueryPromise(`SELECT count(word), date  FROM public.meaning where user_id='${result.id}' and date between '${arr1[0].toDateString()}' and '${arr1[arr1.length - 1].toDateString()}' group by date;`)
            })
            .then((res) => {
                console.log(`Promis res getWordCountForMonth ${JSON.stringify(res)}`);
                resolve({ "msg": "fetched", "data": res.rowData });
            }).catch((err) => {
                reject(err);
            });
    });
}

function getQuiz(reqObject) {
    return new Promise((resolve, reject) => {
        console.log(`getQuiz ${reqObject.sessionId}`)
        translation.getUserId(reqObject.sessionId)
            .then((result) => {
                return db.executeQueryPromise(`select id, word,meaning,getRandomMeanings('${result.id}',id) as
                optional_meanings from public.meaning as words where user_id='${result.id}' ORDER BY random() limit 5 ;`);
            })
            .then((res) => {
                console.log(`Promis res getQuiz ${JSON.stringify(res.rowData)}`);
                resolve({ "msg": "fetched", "data": res.rowData });
            }).catch((err) => {
                reject(err);
            });
    });
}

function getWordsForDate(reqObject) {
    return new Promise((resolve, reject) => {
        console.log(`getWordsForDate ${reqObject.sessionId} ${reqObject.date}`)
        // resolve({"msg":"saved"});
        translation.getUserId(reqObject.sessionId)
            .then((result) => {
                // console.log(`getWordsForDate ${result.id}`)
                // let date = new Date(reqObject.date)
                return db.executeQueryPromise(`SELECT word, meaning FROM public.meaning where user_id='${result.id}' AND date='${reqObject.date}';`);
            })
            .then((res) => {
                // console.log(`Promis getWordsForDate res.rowData ${JSON.stringify(res.rowData)}`);
                resolve({ "msg": "fetched", "data": res.rowData });
            }).catch((err) => {
                console.log(`Error: ${err}`)
                reject(err);
            });
    });
}


function getSuggestion(reqObject) {
    return new Promise((resolve, reject) => {
        console.log(`getSuggestion ${reqObject.sessionId} ${reqObject.word}`)
        // Possible improvement
        // select distinct word, char_length(word) length from public.dictionary where word like'%gor%' order by length limit 10;
        db.executeQueryPromise(`select distinct word, char_length(word) as length from public.dictionary where word like'%${reqObject.word.toLowerCase()}%' order by length limit 10 ;`)
            .then((res) => {
                console.log(`Promis getSuggestion res.rowData ${JSON.stringify(res.rowData)}`);
                resolve({ "msg": "fetched", "data": res.rowData });
            }).catch((err) => {
                console.log(`Error: ${err}`)
                reject(err);
            })
    });
}

function getWordsFromIds() {

}

function updateQuiz(reqObject) {
    return new Promise((resolve, reject) => {
        console.log(`updateQuiz ${reqObject.sessionId} ${JSON.stringify(reqObject.result)}`)
        // [{"wordId":146,"isCorrect":0},{"wordId":247,"isCorrect":0},{"wordId":216,"isCorrect":0},{"wordId":122,"isCorrect":1},{"wordId":82,"isCorrect":0}]
        // 1. Fetch the  id,asked_count,correct_count from meaning table.
        // 2. Increment the asked_count by one
        // 3. Update the correct_count for correct words

        let wordIds = [];
        let submittedResult = JSON.parse(JSON.stringify(reqObject.result));
        // console.log(`Total words submitted ${submittedResult.length}`);
        submittedResult.forEach(element => {
            wordIds.push(element.wordId);
        });
        let commaSeparatedWords = wordIds.join(',');
        // console.log(`WordId's comma separated: ${commaSeparatedWords}`);

        let dbWordDetails = null;
        let correctWords = null;
        db.executeQueryPromise(`select id,asked_count,correct_count from public.meaning where id in (${commaSeparatedWords});`)
            .then((res) => {
                // console.log(`Promis updateQuiz res.rowData ${JSON.stringify(res.rowData)}`);
                dbWordDetails = res.rowData;

                let queryStringPart = "";
                dbWordDetails.forEach(word => {
                    // console.log(`id, asked count ${word.id}, ${word.asked_count}`)
                    queryStringPart += `(${word.id},${word.asked_count + 1}),`;
                });
                // Remove last comma:
                queryStringPart = queryStringPart.replace(/,\s*$/, "");

                // console.log(`queryStringPart ${JSON.stringify(queryStringPart)}`);


                return db.executeQueryPromise(`update public.meaning as m 
                                    set asked_count = c.asked_count
                                    from (values ${queryStringPart}) as c(id, asked_count) 
                                    where c.id = m.id;`);
            })
            .then((res) => {
                console.log(`Updated asked count result ${JSON.stringify(res.command)}, total rows: ${res.rowCount}`);
                if (submittedResult.length != res.rowCount) {
                    let errMsg = `Submitted results (${submittedResult.length}) not equal to db updated results (${res.rowCount})`;
                    console.error(errMsg);
                    reject(errMsg);
                }

                let queryStringPart = "";

                correctWords = submittedResult.filter(word => word.isCorrect === 1);
                // console.log(`correctWordCount: ${correctWords.length}`);
                if (correctWords.length === 0) {
                    console.log(`No correct words`);
                    resolve({ "msg": "saved" });
                    return null;
                } else {
                    correctWords.forEach(word => {
                        var wordFromDb = dbWordDetails.find(function (element) {
                            // console.log(`element ${JSON.stringify(element)}, ${element.id} ${JSON.stringify(word)} ${word.wordId}`);
                            return element.id === word.wordId;
                        });

                        // console.log(`id, correct count ${wordFromDb}, ${wordFromDb}`);
                        // if(word.isCorrect === 1){
                        queryStringPart += `(${wordFromDb.id},${wordFromDb.correct_count + 1}),`;

                    });
                }
                queryStringPart = queryStringPart.replace(/,\s*$/, "");

                // console.log(`queryStringPart ${JSON.stringify(queryStringPart)}`);

                return db.executeQueryPromise(`update public.meaning as m 
                                    set correct_count = c.correct_count
                                    from (values ${queryStringPart}) as c(id, correct_count) 
                                    where c.id = m.id;`);
            })
            .then((res) => {
                if (null != res) {
                    console.log(`Updated correct count result ${JSON.stringify(res.command)}, total rows: ${res.rowCount}`);
                    if (correctWords.length != res.rowCount) {
                        let errMsg = `Submittet correct rows (${correctWords.length}) not equal to db updated results (${res.rowCount})`;
                        console.error(errMsg);
                        reject(errMsg);
                    } else {
                        resolve({ "msg": "saved" });
                    }
                }else{
                    console.log(`No correct words found, expected null:  ${res}`)
                }

            })
            .catch((err) => {
                console.log(`Error: ${err} ${err.stack}`)
                reject(err);
            })
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
// updateQuiz({sessionId: 'n7065chm8-2018-08-06T13:45:09.795Z', result: [{"wordId":146,"isCorrect":0},{"wordId":247,"isCorrect":0},{"wordId":216,"isCorrect":0},{"wordId":122,"isCorrect":1},{"wordId":82,"isCorrect":0}]});
// node ./rest/db/modules/translationService.js