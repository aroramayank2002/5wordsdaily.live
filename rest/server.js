// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var dbService = require('./db/modules/dbService.js');
var authService = require('./db/modules/authenticationService.js');
var tranService = require('./db/modules/translationService.js');
var verifyGoogleLogin = require('./db/modules/verifyGoogleLogin.js');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


app.use(express.static('static'))
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});



// more routes for our API will happen here
router.route('/meaning/:word')

    // get the bear with that id (accessed at GET http://localhost:8080/api/meaning/:bear_id)
    .get(function(req, res) {
        console.log(req.params.word);
        res.json({"meaning":"Ha"});
    });

// more routes for our API will happen here
router.route('/user/:email')

    // post email and get id (accessed at GET http://localhost:8080/api/user/arora@gmail.com)
    .post(function(req, res) {
        console.log(`Req param: ${req.params.email}`);
        // console.log();
        dbService.getUserId(req.params.email).then((result)=>{
            res.json(result);
        });
    });

    router.route('/meaning/')

    // post email and get id (accessed at GET http://localhost:8080/api/user/arora@gmail.com)
    .put(function(req, res) {
        // console.log(`Req param: ${req.params.email}, ${req.params.word}, ${req.params.meaning}`);
        console.log(`Req param: ${req.body.sessionId}, ${req.body.word}, ${req.body.meaning}`);
        tranService.saveWord({sessionId: req.body.sessionId, word: req.body.word, meaning: req.body.meaning}).then((result)=>{
            console.log(`Result: ${result}`);
            res.json({"result":result});
        });
    });

    router.route('/login/')

    // post email and get id (accessed at GET http://localhost:8080/api/user/arora@gmail.com)
    .post(function(req, res) {
        // console.log(`Req param: ${req.params.email}, ${req.params.word}, ${req.params.meaning}`);
        // console.log(`Req param: ${req.body.email}, ${req.body.name} ${req.body.token}`);
        console.log(`Login src: ${req.body.src}`);
        
        // authService.login({email: req.body.email, name: req.body.name}).then((result)=>{
        //     console.log(`Result: ${JSON.stringify(result)}`);
        //     res.json({"result":result});
        // });
        
        // var verifyPromoise = null;
        if(req.body.src === "facebook"){
            authService.login({email: req.body.email, name: req.body.name})    
            .then((result)=>{
                    console.log(`Result: ${JSON.stringify(result)}`);
                    res.json({"result":result});
            });
        }else if(req.body.src === "google"){
            
            verifyGoogleLogin.verifyUser({token: req.body.token})
            .then( (email) =>{
                console.log(`Email from google verify: ${email}`)
                if(email === req.body.email){
                    return authService.login({email: req.body.email, name: req.body.name});    
                }else{
                    res.json({"result":"Failed login"});
                }
            })
            .then((result)=>{
                    console.log(`Result: ${JSON.stringify(result)}`);
                    res.json({"result":result});
            });
        
        }else{
            console.log(`Invalid source`);
            res.json({"result":"Failed login, no source"});
        }

            
    });

    router.route('/allWords/')
        .post(function(req, res) {
            console.log(`Req param: ${req.body.sessionId}`);
            tranService.getWords({sessionId: req.body.sessionId}).then((result)=>{
                console.log(`Result: ${JSON.stringify(result)}`);
                res.json({"result":result});
            });
    });

    router.route('/translate/')
        .post(function(req, res) {
            console.log(`translate req param: ${req.body.word}`);
            tranService.getTranslation({word: req.body.word}).then((result)=>{
                console.log(`Result: ${JSON.stringify(result)}`);
                res.json({"result":result});
            });
    });

    router.route('/wordMeaning/')
        .post(function(req, res) {
            console.log(`wordMeaning req param: ${req.body.wordId}`);
            tranService.getWord({wordId: req.body.wordId}).then((result)=>{
                console.log(`Result: ${JSON.stringify(result)}`);
                res.json({"result":result});
            });
    });

    router.route('/delete/')
        .post(function(req, res) {
            console.log(`delete req param: sess: ${req.body.sessionId}, ${req.body.wordId}`);
            tranService.deleteWord({wordId: req.body.wordId}).then((result)=>{
                console.log(`Result: ${JSON.stringify(result)}`);
                res.json({"result":result});
            });
    });

    router.route('/monthlyWords/')
        .post(function(req, res) {
            console.log(`monthlyWords req param: sess: ${req.body.sessionId}, ${req.body.month}, ${req.body.year}`);
            tranService.getWordCountForMonth({sessionId: req.body.sessionId, month: req.body.month, year: req.body.year}).then((result)=>{
                console.log(`Result: ${JSON.stringify(result)}`);
                res.json({"result":result});
                // res.json({"result":null});
            });
            // res.json({"result":null});
    });

    router.route('/quiz/')
        .get(function(req, res) {
            console.log(`quiz req param: sessionId: ${req.query.sessionId}`);
            tranService.getQuiz({sessionId: req.query.sessionId}).then((result)=>{
                console.log(`Result: ${JSON.stringify(result)}`);
                res.json({"result":result});
            });
    });

    router.route('/submitQuiz/')
        .post(function(req, res) {
            console.log(`submitQuiz req param: sessionId:  ${req.body.sessionId},  ${JSON.stringify(req.body.result)}`);
            tranService.updateQuiz({sessionId: req.body.sessionId, result: req.body.result}).then((result)=>{
                console.log(`Result: ${JSON.stringify(result)}`);
                res.json({"result":result});
            });
    });

    
    router.route('/getWordsForDate/')
        .get(function(req, res) {
            console.log(`getWordsForDate req param: sessionId:  ${req.query.sessionId},  ${req.query.date}`);
            tranService.getWordsForDate({sessionId: req.query.sessionId, date: req.query.date}).then((result)=>{
                console.log(`Result: ${JSON.stringify(result)}`);
                res.json({"result":result});
            });
    });
    
    router.route('/suggest/')
        .get(function(req, res) {
            console.log(`suggest req param: ${req.query.word}`);
            tranService.getSuggestion({word: req.query.word}).then((result)=>{
                console.log(`Result: ${JSON.stringify(result)}`);
                res.json({"result":result});
            });
    });
    
    router.route('/ping/')
        .get(function(req, res) {
            console.log(`ping req`);
            dbService.ping().then((result)=>{
                res.json(result);
            });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
