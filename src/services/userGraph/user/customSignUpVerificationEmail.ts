export async function main(event) {
  const sub = event.request.userAttributes.sub;
  const link = `https://auth.somap.app/confirmUser?client_id=${process.env.COGNITO_CLIENT_ID}&user_name=${sub}&confirmation_code=${event.request.codeParameter}`;
  const name = event.request.userAttributes.name;


  if (event.triggerSource === "CustomMessage_SignUp") {
    event.response = {
      emailSubject: "SoMap | Confirm your email",
      emailMessage: template(name, link)
    };
  }
  return event;
}

const template = (username, activationLink) => `
<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"/><div leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"style="height:auto !important;width:100% !important; font-family: 'Montserrat', sans-serif;"> <table style="max-width:600px; background-color:#ffffff;border:1px solid #e4e2e2;border-collapse:separate !important; border-radius:10px;border-spacing:0;color:#242128; margin:auto;padding:40px;" heigth="auto"> <tbody> <tr> <td style="padding-bottom:40px;border-top:0;height:100% !important;width:100% !important;"> <span style="color: #8f8f8f; font-weight: normal; line-height: 2; font-size: 14px;">Welcome${username}!</strong></span> </td><td style="padding-bottom:40px;border-top:0;height:100% !important;width:100% !important;"> <img src="https://somap.app/assets/logos/mobile.png" style="width: 60px"/> </td></tr><tr> <td colSpan="2" style="padding-top:10px;border-top:1px solid #e4e2e2"> <h3 style="color:#303030; font-size:18px; line-height: 1.6; font-weight:800;">Almost done!</h3> <p style="color:#8f8f8f; font-size: 14px; padding-bottom: 20px; line-height: 1.4;"> To complete your SoMap sign up, we just need to verify your email address. </p></td></tr><tr> <td colSpan="2"> <table style="min-width:100%;border-collapse:collapse;"> <tbody> <tr> <td style="padding:15px 0px;" valign="top" align="center"> <table style="border-collapse:separate !important;"> <tbody> <tr> <td align="center" valign="middle" style="padding:13px;"> <a href="${activationLink}" title="Verify email" target="_blank" style="font-size: 14px; line-height: 1.5; font-weight: 700; letter-spacing: 1px; padding: 15px 40px; text-align:center; text-decoration:none; color:#FFFFFF; border-radius: 50px; background-color:#F97635;">Verify email</a> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table></div>
`;
