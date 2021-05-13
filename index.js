const express = require('express')
const bodyParser = require('body-parser')
const {WebhookClient}= require('dialogflow-fulfillment');
const axios =require('axios')
const mysql = require('mysql')
const {
    Card
} = require('dialogflow-fulfillment');


const app = express();
app.use(bodyParser.json())
const port = process.env.PORT || 3001;

app.post('/dialogflow-fulfillment', (request, response) =>{
    dialogflowFulfillment(request,response)
})

app.listen(port, () =>{
    console.log( `Listening on port ${port}`)
})

const dialogflowFulfillment  = (request, response) => {
    const agent = new WebhookClient({request, response})

    function sayHello(agent){
        agent.add(agent)
    }
    function rhymingWordHandler(agent){
        const word = agent.parameters.word;
        agent.add(`Here are the rhyming words for ${word}`)

       return axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`)
        .then((result) =>{
            result.data.map(wordObj => {
                agent.add(wordObj.word + ' - ' + wordObj.score)
            })

        });
        //agent.add("intend called:" + word)
    }

    function richMessage(agent){
                // Sending cards
        const card = new Card('1 Lý Thường Kiệt, Tân Bình');
        card.setImage('https://media.cooky.vn/images/blog-2016/cach-lam-3-mon-pho-nuoc-ngon-nong-hoi-dam-da-huong-vi-viet%201.jpg');
        card.setText('Click on the below button ');
        card.setButton({text: 'Go to Google.com', url: 'https://google.com'});
        agent.add(card);
      

    }

    function test(agent){
         agent.add(new Card({
        title: `Title: this is a card title`,
        imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
        text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
        buttonText: 'This is a button',
        buttonUrl: 'https://assistant.google.com/'
      },
     
      )
    );
    }
//     function connectToDatabase(){
//         const connection = mysql.createConnection({
//             host: '127.0.0.1',
//             user: 'admin',
//             password:'',
//             database: 'db_dialogflow'
//         });
//         return new Promise((resolve, reject) => {
//            connection.connect();
//            resolve(connection);
//             })
           
//         }
    

//     function queryDatabase(connection){
//         return new Promise((resolve, reject) => {
//             connection.query('SELECT * FROM food ',(error,result,fields) =>{
//                 resolve(result)     
//         })
//     })
// }

// function handleReadFromMySQL(agent) {
//     return connectToDatabase()
//     .then(connection =>{
//         return queryDatabase(connection)
//         .then(result =>{
//             console.log(result);
//             agent.add(`Firstname: ${result[0].first_name} and lastname: ${result[0].last_name}`)
//             connection.end();
//         })
//     })
// }


    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", sayHello)
    intentMap.set("RhymingWord", rhymingWordHandler)
    intentMap.set("testCard", test)
    //intentMap.set("getDataFromMySQL", handleReadFromMySQL)



    agent.handleRequest(intentMap) 


}


