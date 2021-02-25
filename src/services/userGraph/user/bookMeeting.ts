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
    let paramsUserEmail = {
      Destination: { /* required */
        ToAddresses: [
          body.email
        ]
      },
      Source: 'business@somap.app',
      Template: 'BookMeeting-20210225115427',
      TemplateData: JSON.stringify({
        ...body,
        date: moment(body.date).format('DD/MM/YYYY')
      }),
      ReplyToAddresses: [
        'business@somap.app'
      ],
    };
    await new AWS.SES({apiVersion: '2010-12-01'}).sendTemplatedEmail(paramsUserEmail).promise();
    return responseManager.send(200);
  } catch (err) {
    console.log(err);
    return responseManager.send(501);
  }

}
/*
aws ses --profile somap-ses --region eu-central-1 test-render-template --template-name BookMeeting-20210225115427 --template-data "{ \"date\": \"2021-02-23T23:00:00.000Z\",  \"name\": \"Luca Pirrone\",  \"companyName\": \"Luca Pirrone\",  \"email\": \"lpirrone2000@gmail.com\",  \"phone\": \"3481633500\",  \"note\": \"Test\"}"
 */
