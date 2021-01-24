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
                            Data: "HTML_FORMAT_BODY"
                        },
                        Text: {
                            Charset: "UTF-8",
                            Data: message
                        }
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: body.name + ' vuole prenotare un meeting!'
                    }
                },
                Source: 'somap.business@gmail.com',
                ReplyToAddresses: [
                    body.email
                ],
            };
            var sendPromise = yield new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
            console.log(sendPromise);
            return responseManager.send(200);
        }
        catch (err) {
            console.log(err);
            return responseManager.send(501);
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9va01lZXRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2VydmljZXMvdXNlckdyYXBoL3VzZXIvYm9va01lZXRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxtRUFBNEQ7QUFDNUQsaUNBQWtDO0FBQ2xDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxjQUFjLEVBQUMsQ0FBQyxDQUFDO0FBSWxFLFNBQXNCLElBQUksQ0FBQyxLQUFLOztRQUM5QixJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUc1QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxJQUFHO1lBQ0QsSUFBSSxPQUFPLEdBQUcsNENBQTRDLEdBQUMsSUFBSSxDQUFDLElBQUksR0FBQyxpQkFBaUIsR0FBQyxJQUFJLENBQUMsV0FBVyxHQUFDLHVCQUF1QixHQUFDLElBQUksQ0FBQyxLQUFLLEdBQUMsd0JBQXdCLEdBQUMsSUFBSSxDQUFDLEtBQUssR0FBQyx1Q0FBdUMsR0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBQyxVQUFVLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNuUixJQUFJLE1BQU0sR0FBRztnQkFDWCxXQUFXLEVBQUU7b0JBQ1gsV0FBVyxFQUFFO3dCQUNYLDBCQUEwQjtxQkFDM0I7aUJBQ0Y7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRTt3QkFDSixJQUFJLEVBQUU7NEJBQ0osT0FBTyxFQUFFLE9BQU87NEJBQ2hCLElBQUksRUFBRSxrQkFBa0I7eUJBQ3pCO3dCQUNELElBQUksRUFBRTs0QkFDSixPQUFPLEVBQUUsT0FBTzs0QkFDaEIsSUFBSSxFQUFFLE9BQU87eUJBQ2Q7cUJBQ0Y7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLE9BQU8sRUFBRSxPQUFPO3dCQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBQyw4QkFBOEI7cUJBQy9DO2lCQUNGO2dCQUNELE1BQU0sRUFBRSwwQkFBMEI7Z0JBQ2xDLGdCQUFnQixFQUFFO29CQUNoQixJQUFJLENBQUMsS0FBSztpQkFDWDthQUNGLENBQUM7WUFDRixJQUFJLFdBQVcsR0FBRyxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM1RixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3pCLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEM7SUFFSCxDQUFDO0NBQUE7QUEzQ0Qsb0JBMkNDIn0=