import ResponseManager from "../../../libs/ResponseManager";
import moment = require("moment");
var AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION || 'eu-central-1'});
/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
  let responseManager = new ResponseManager();

  //Take variable from event
  const body = JSON.parse(event.body);

  try{
    let message = "E' stato compilato il form di contatto da "+body.name+" dalla società "+body.companyName+" con indirizzo email "+body.email+" e numero di telefono "+body.phone+" per richiedere un meeting il giorno "+moment(body.date).format("DD/MM/YYYY")+". Note: "+body.note;
    var params = {
      Destination: { /* required */
        ToAddresses: [
          'somap.business@gmail.com',
        ]
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: message
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: body.name+' vuole prenotare un meeting!'
        }
      },
      Source: 'business@somap.app',
      ReplyToAddresses: [
        body.email
      ],
    };
    var sendPromise = await new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    console.log(sendPromise);
    return responseManager.send(200);
  } catch (err) {
    console.log(err);
    return responseManager.send(501);
  }

}