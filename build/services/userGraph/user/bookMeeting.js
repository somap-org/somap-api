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
var AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION || 'eu-central-1' });
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        const body = JSON.parse(event.body);
        try {
            let message = "E' stato compilato il form di contatto da " + body.name + " dalla società " + body.companyName + " con indirizzo email " + body.email + " e numero di telefono " + body.phone + " per richiedere un meeting il giorno " + body.date + ". Note: " + body.note;
            var params = {
                Destination: {
                    ToAddresses: [
                        'lpirrone2000@gmail.com',
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
                Source: 'lpirrone2000@gmail.com',
                ReplyToAddresses: [
                    body.email
                ],
            };
            var sendPromise = yield AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9va01lZXRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2VydmljZXMvdXNlckdyYXBoL3VzZXIvYm9va01lZXRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxtRUFBNEQ7QUFDNUQsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLGNBQWMsRUFBQyxDQUFDLENBQUM7QUFLbEUsU0FBc0IsSUFBSSxDQUFDLEtBQUs7O1FBQzlCLElBQUksZUFBZSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBRzVDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBDLElBQUc7WUFDRCxJQUFJLE9BQU8sR0FBRyw0Q0FBNEMsR0FBQyxJQUFJLENBQUMsSUFBSSxHQUFDLGlCQUFpQixHQUFDLElBQUksQ0FBQyxXQUFXLEdBQUMsdUJBQXVCLEdBQUMsSUFBSSxDQUFDLEtBQUssR0FBQyx3QkFBd0IsR0FBQyxJQUFJLENBQUMsS0FBSyxHQUFDLHVDQUF1QyxHQUFDLElBQUksQ0FBQyxJQUFJLEdBQUMsVUFBVSxHQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDdFAsSUFBSSxNQUFNLEdBQUc7Z0JBQ1gsV0FBVyxFQUFFO29CQUNYLFdBQVcsRUFBRTt3QkFDWCx3QkFBd0I7cUJBQ3pCO2lCQUNGO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFOzRCQUNKLE9BQU8sRUFBRSxPQUFPOzRCQUNoQixJQUFJLEVBQUUsa0JBQWtCO3lCQUN6Qjt3QkFDRCxJQUFJLEVBQUU7NEJBQ0osT0FBTyxFQUFFLE9BQU87NEJBQ2hCLElBQUksRUFBRSxPQUFPO3lCQUNkO3FCQUNGO29CQUNELE9BQU8sRUFBRTt3QkFDUCxPQUFPLEVBQUUsT0FBTzt3QkFDaEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUMsOEJBQThCO3FCQUMvQztpQkFDRjtnQkFDRCxNQUFNLEVBQUUsd0JBQXdCO2dCQUNoQyxnQkFBZ0IsRUFBRTtvQkFDaEIsSUFBSSxDQUFDLEtBQUs7aUJBQ1g7YUFDRixDQUFDO1lBQ0YsSUFBSSxXQUFXLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUMsVUFBVSxFQUFFLFlBQVksRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3hGLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDekIsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7Q0FBQTtBQTFDRCxvQkEwQ0MifQ==