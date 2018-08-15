const axios = require('axios');

function getWordsForDate(sessionId, selectedDate){
    return new Promise((resolve, reject) =>{
        // console.log(`getWordsForDate:  ${selectedDate}`);
        //Add 1 day to date
        let date = new Date(Date.parse(selectedDate))
        date.setDate(date.getDate() + 1);
        date = date.toISOString();
        // console.log(`added 1 day in getWordsForDate:  ${date}`);
        axios.get('/api/getWordsForDate', {
        params: {
            sessionId: sessionId,
            date: date,
        }
        })
        .then(function (response) {
            // console.log(response.data.result);
            resolve(response.data.result.data);
        })
        .catch(function (error) {
            console.log(error);
            reject(error);
        });
        })
}

module.exports = {
    getWordsForDate: getWordsForDate
}

// login({email: "areor@fadf.com", name: "Mayank"});
// node ./rest/db/modules/authenticationService.js