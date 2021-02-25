var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const ResponseManager_1 = require("../../../libs/ResponseManager");
const moment = require("moment");
var AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION || 'eu-central-1' });
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        const body = JSON.parse(event.body);
        try {
            let message = "E' stato compilato il form di contatto da " + body.name + " dalla società " + body.companyName + " con indirizzo email " + body.email + " e numero di telefono " + body.phone + " per richiedere un meeting il giorno " + moment(body.date).format("DD/MM/YYYY") + ". Note: " + body.note;
            var params = {
                Destination: {
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
                        Data: body.name + ' vuole prenotare un meeting!'
                    }
                },
                Source: 'business@somap.app',
                ReplyToAddresses: [
                    body.email
                ],
            };
            yield new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
            let paramsUserEmail = {
                Destination: {
                    ToAddresses: [
                        body.email,
                    ]
                },
                Source: 'business@somap.app',
                Template: 'BookMeeting-20210225115427',
                TemplateData: JSON.stringify(Object.assign(Object.assign({}, body), { date: moment(body.date).format('DD/MM/YYYY') })),
                ReplyToAddresses: [
                    'business@somap.app'
                ],
            };
            yield new AWS.SES({ apiVersion: '2010-12-01' }).sendTemplatedEmail(paramsUserEmail).promise();
            return responseManager.send(200);
        }
        catch (err) {
            console.log(err);
            return responseManager.send(501);
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9va01lZXRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2VydmljZXMvdXNlckdyYXBoL3VzZXIvYm9va01lZXRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxtRUFBNEQ7QUFDNUQsaUNBQWtDO0FBR2xDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxjQUFjLEVBQUMsQ0FBQyxDQUFDO0FBWWxFLFNBQXNCLElBQUksQ0FBQyxLQUFLOztRQUM5QixJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUc1QyxNQUFNLElBQUksR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakQsSUFBRztZQUVELElBQUksT0FBTyxHQUFHLDRDQUE0QyxHQUFDLElBQUksQ0FBQyxJQUFJLEdBQUMsaUJBQWlCLEdBQUMsSUFBSSxDQUFDLFdBQVcsR0FBQyx1QkFBdUIsR0FBQyxJQUFJLENBQUMsS0FBSyxHQUFDLHdCQUF3QixHQUFDLElBQUksQ0FBQyxLQUFLLEdBQUMsdUNBQXVDLEdBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUMsVUFBVSxHQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDblIsSUFBSSxNQUFNLEdBQUc7Z0JBQ1gsV0FBVyxFQUFFO29CQUNYLFdBQVcsRUFBRTt3QkFDWCwwQkFBMEI7cUJBQzNCO2lCQUNGO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFOzRCQUNKLE9BQU8sRUFBRSxPQUFPOzRCQUNoQixJQUFJLEVBQUUsT0FBTzt5QkFDZDtxQkFDRjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsT0FBTyxFQUFFLE9BQU87d0JBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFDLDhCQUE4QjtxQkFDL0M7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFLG9CQUFvQjtnQkFDNUIsZ0JBQWdCLEVBQUU7b0JBQ2hCLElBQUksQ0FBQyxLQUFLO2lCQUNYO2FBQ0YsQ0FBQztZQUNGLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUMsVUFBVSxFQUFFLFlBQVksRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRzFFLElBQUksZUFBZSxHQUFHO2dCQUNwQixXQUFXLEVBQUU7b0JBQ1gsV0FBVyxFQUFFO3dCQUNYLElBQUksQ0FBQyxLQUFLO3FCQUNYO2lCQUNGO2dCQUNELE1BQU0sRUFBRSxvQkFBb0I7Z0JBQzVCLFFBQVEsRUFBRSw0QkFBNEI7Z0JBQ3RDLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxpQ0FDdkIsSUFBSSxLQUNQLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFDNUM7Z0JBQ0YsZ0JBQWdCLEVBQUU7b0JBQ2hCLG9CQUFvQjtpQkFDckI7YUFDRixDQUFDO1lBQ0YsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBQyxVQUFVLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUU1RixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO0lBRUgsQ0FBQztDQUFBO0FBM0RELG9CQTJEQyJ9