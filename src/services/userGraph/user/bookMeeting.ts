import ResponseManager from "../../../libs/ResponseManager";
import moment = require("moment");
import {template} from "../../../views/bookMeetingTemplate";
import {company} from "aws-sdk/clients/importexport";
var AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION || 'eu-central-1'});
/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
interface ContactInfo {
  name: string,
  companyName: string,
  email: string,
  phone: string,
  date: string,
  note: string
}
export async function main(event){
  let responseManager = new ResponseManager();

  //Take variable from event
  const body: ContactInfo = JSON.parse(event.body);

  try{
    //Send email to admin
    let message = "E' stato compilato il form di contatto da "+body.name+" dalla società "+body.companyName+" con indirizzo email "+body.email+" e numero di telefono "+body.phone+" per richiedere un meeting il giorno "+moment(body.date).format("DD/MM/YYYY")+". Note: "+body.note;
    var params = {
      Destination: { /* required */
        ToAddresses: [
          'somap.business@gmail.com',
        ]
      },
      Message: {
        Body: {
          Html: {
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
    await new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

    //Send email to user
    var params = {
      Destination: { /* required */
        ToAddresses: [
          body.email,
        ]
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: template(body.name, body.companyName, body.email, body.phone, body.date, body.note)
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: ''
        }
      },
      Source: 'business@somap.app',
      ReplyToAddresses: [
        'business@somap.app'
      ],
    };
    await new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

    return responseManager.send(200);
  } catch (err) {
    console.log(err);
    return responseManager.send(501);
  }

}
