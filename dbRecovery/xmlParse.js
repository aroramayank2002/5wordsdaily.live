// npm install --save node-xml-stream
// node dbRecovery/xmlParse.js
let Parser = require('node-xml-stream');
let fs = require('fs');
const db = require("../rest/db/modules/dbService.js");

let parser = new Parser();
var csvStream = fs.createWriteStream("./dbRecovery/dictionary.csv", {flags:'a'});

// <tag attr="hello">
var word = "";
var meaning = "";
parser.on('opentag', (name, attrs) => {
    // name = 'tag'
    // attrs = { attr: 'hello' }
    if(name == "word"){
        //console.log(attrs.value)
        word = attrs.value;
    }
    if(name == "translation"){
        //console.log(attrs.value)

        let val = attrs.value.replace("/", "").trim();
        if(meaning==""){
            meaning = val;
        }
        else{
            if(meaning.split(',').length < 2){
                meaning = meaning + "," + val;
            }
        }
        //console.log(meaning)
    }
});

// </tag>
var count = 0;
parser.on('closetag', name => {
    // name = 'tag'
     if(name == "word"){
          //console.log(`${word};${meaning}`)
          let line =  `${word.replace('|',':')}|${meaning.replace('|',':')} \n`;
          if(line.split('|').length == 2){
            csvStream.write(line);
            //console.log(count++);
            meaning = "";
          }else{
            console.log(line);
            meaning = "";
          }

          /*return new Promise((resolve, reject) => {

               db.executeQueryPromise(`INSERT INTO public.dictionary(word, meaning) VALUES ('${word}', '${meaning}')`)
                .then((res) => {
                    //console.log(`Promis res ${JSON.stringify(res)}`);
                    //console.log(res.rowCount);
                    console.log(count++);
                    resolve();

                });
                meaning = "";
          })*/



     }
});

// <tag>TEXT</tag>
parser.on('text', text => {
    // text = 'TEXT'
});

// <[[CDATA['data']]>
parser.on('cdata', cdata => {
    // cdata = 'data'
});

// <?xml version="1.0"?>
parser.on('instruction', (name, attrs) => {
    // name = 'xml'
    // attrs = { version: '1.0' }
});

// Only stream-errors are emitted.
parser.on('error', err => {
    // Handle a parsing error
});

parser.on('finish', () => {
    // Stream is completed
    csvStream.end();
});

// Write data to the stream.
//parser.write('<root>TEXT</root>');

// Pipe a stream to the parser
//let stream = fs.createReadStream('./dbRecovery/folkets_sv_en_public_for_dev.xml');
let stream = fs.createReadStream('./dbRecovery/folkets_sv_en_public.xml');
stream.pipe(parser);







