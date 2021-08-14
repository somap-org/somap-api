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
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const sub = event.request.userAttributes.sub;
        const link = `https://auth.somap.app/confirmUser?client_id=${process.env.COGNITO_CLIENT_ID}&user_name=${sub}&confirmation_code=${event.request.codeParameter}`;
        const name = event.request.userAttributes.name;
        console.log(event);
        if (event.triggerSource === "CustomMessage_SignUp") {
            event.response = {
                emailSubject: "SoMap | Confirm your email",
                emailMessage: template(name, event.request.codeParameter)
            };
        }
        return event;
    });
}
exports.main = main;
const template = (username, activationLink) => `
<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"/><div leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"style="height:auto !important;width:100% !important; font-family: 'Montserrat', sans-serif;"> <table style="max-width:600px; background-color:#ffffff;border:1px solid #e4e2e2;border-collapse:separate !important; border-radius:10px;border-spacing:0;color:#242128; margin:auto;padding:40px;" heigth="auto"> <tbody> <tr> <td style="padding-bottom:40px;border-top:0;height:100% !important;width:100% !important;"> <span style="color: #8f8f8f; font-weight: normal; line-height: 2; font-size: 14px;">Welcome${username}!</strong></span> </td><td style="padding-bottom:40px;border-top:0;height:100% !important;width:100% !important;"> <img src="https://somap.app/assets/logos/mobile.png" style="width: 60px"/> </td></tr><tr> <td colSpan="2" style="padding-top:10px;border-top:1px solid #e4e2e2"> <h3 style="color:#303030; font-size:18px; line-height: 1.6; font-weight:800;">Almost done!</h3> <p style="color:#8f8f8f; font-size: 14px; padding-bottom: 20px; line-height: 1.4;"> To complete your SoMap sign up, we just need to verify your email address. </p></td></tr><tr> <td colSpan="2"> <table style="min-width:100%;border-collapse:collapse;"> <tbody> <tr> <td style="padding:15px 0px;" valign="top" align="center"> <table style="border-collapse:separate !important;"> <tbody> <tr> <td align="center" valign="middle" style="padding:13px;"> <a href="{####}" title="Verify email" target="_blank" style="font-size: 14px; line-height: 1.5; font-weight: 700; letter-spacing: 1px; padding: 15px 40px; text-align:center; text-decoration:none; color:#FFFFFF; border-radius: 50px; background-color:#F97635;">Verify email</a> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table></div>
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tU2lnblVwVmVyaWZpY2F0aW9uRW1haWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2VydmljZXMvdXNlckdyYXBoL3VzZXIvY3VzdG9tU2lnblVwVmVyaWZpY2F0aW9uRW1haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxTQUFzQixJQUFJLENBQUMsS0FBSzs7UUFDOUIsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDO1FBQzdDLE1BQU0sSUFBSSxHQUFHLGdEQUFnRCxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixjQUFjLEdBQUcsc0JBQXNCLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDL0osTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO1FBRS9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbkIsSUFBSSxLQUFLLENBQUMsYUFBYSxLQUFLLHNCQUFzQixFQUFFO1lBQ2xELEtBQUssQ0FBQyxRQUFRLEdBQUc7Z0JBQ2YsWUFBWSxFQUFFLDRCQUE0QjtnQkFDMUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7YUFDMUQsQ0FBQztTQUNIO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0NBQUE7QUFkRCxvQkFjQztBQUVELE1BQU0sUUFBUSxHQUFHLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxFQUFFLENBQUM7c3FCQUN1bkIsUUFBUTtDQUM3cUIsQ0FBQyJ9