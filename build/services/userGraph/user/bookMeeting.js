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
const bookMeetingTemplate_1 = require("../../../views/bookMeetingTemplate");
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
            var params = {
                Destination: {
                    ToAddresses: [
                        body.email,
                    ]
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: bookMeetingTemplate_1.template(body.name, body.companyName, body.email, body.phone, body.date, body.note)
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
            yield new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
            return responseManager.send(200);
        }
        catch (err) {
            console.log(err);
            return responseManager.send(501);
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9va01lZXRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2VydmljZXMvdXNlckdyYXBoL3VzZXIvYm9va01lZXRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxtRUFBNEQ7QUFDNUQsaUNBQWtDO0FBQ2xDLDRFQUE0RDtBQUU1RCxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDN0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksY0FBYyxFQUFDLENBQUMsQ0FBQztBQVlsRSxTQUFzQixJQUFJLENBQUMsS0FBSzs7UUFDOUIsSUFBSSxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFHNUMsTUFBTSxJQUFJLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpELElBQUc7WUFFRCxJQUFJLE9BQU8sR0FBRyw0Q0FBNEMsR0FBQyxJQUFJLENBQUMsSUFBSSxHQUFDLGlCQUFpQixHQUFDLElBQUksQ0FBQyxXQUFXLEdBQUMsdUJBQXVCLEdBQUMsSUFBSSxDQUFDLEtBQUssR0FBQyx3QkFBd0IsR0FBQyxJQUFJLENBQUMsS0FBSyxHQUFDLHVDQUF1QyxHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFDLFVBQVUsR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ25SLElBQUksTUFBTSxHQUFHO2dCQUNYLFdBQVcsRUFBRTtvQkFDWCxXQUFXLEVBQUU7d0JBQ1gsMEJBQTBCO3FCQUMzQjtpQkFDRjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFO3dCQUNKLElBQUksRUFBRTs0QkFDSixPQUFPLEVBQUUsT0FBTzs0QkFDaEIsSUFBSSxFQUFFLE9BQU87eUJBQ2Q7cUJBQ0Y7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLE9BQU8sRUFBRSxPQUFPO3dCQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBQyw4QkFBOEI7cUJBQy9DO2lCQUNGO2dCQUNELE1BQU0sRUFBRSxvQkFBb0I7Z0JBQzVCLGdCQUFnQixFQUFFO29CQUNoQixJQUFJLENBQUMsS0FBSztpQkFDWDthQUNGLENBQUM7WUFDRixNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUcxRSxJQUFJLE1BQU0sR0FBRztnQkFDWCxXQUFXLEVBQUU7b0JBQ1gsV0FBVyxFQUFFO3dCQUNYLElBQUksQ0FBQyxLQUFLO3FCQUNYO2lCQUNGO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFOzRCQUNKLE9BQU8sRUFBRSxPQUFPOzRCQUNoQixJQUFJLEVBQUUsOEJBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQzt5QkFDMUY7cUJBQ0Y7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLE9BQU8sRUFBRSxPQUFPO3dCQUNoQixJQUFJLEVBQUUsRUFBRTtxQkFDVDtpQkFDRjtnQkFDRCxNQUFNLEVBQUUsb0JBQW9CO2dCQUM1QixnQkFBZ0IsRUFBRTtvQkFDaEIsb0JBQW9CO2lCQUNyQjthQUNGLENBQUM7WUFDRixNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUUxRSxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO0lBRUgsQ0FBQztDQUFBO0FBbEVELG9CQWtFQyJ9