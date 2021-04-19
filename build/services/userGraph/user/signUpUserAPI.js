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
const CognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");
const moment = require("moment");
const UserRepository_1 = require("../../../repositories/UserRepository");
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let userRepository = new UserRepository_1.UserRepository();
        const body = JSON.parse(event.body);
        if (body.referralCode !== null && body.referralCode !== '' && (yield userRepository.getUserByReferralCode(body.referralCode)) === null)
            return responseManager.send(400, {
                code: "InvalidReferralCode",
                message: "Invalid Referral code"
            });
        try {
            let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
                region: process.env.REGION || 'eu-central-1'
            });
            var params = {
                ClientId: process.env.COGNITO_CLIENT_ID,
                Password: body.password,
                Username: body.email,
                UserAttributes: [
                    {
                        Name: 'custom:userType',
                        Value: body.userType
                    },
                    {
                        Name: 'name',
                        Value: body.username
                    },
                    {
                        Name: 'custom:termsConditions',
                        Value: moment().format()
                    },
                    {
                        Name: 'custom:privacyCookiePolicy',
                        Value: moment().format()
                    },
                    {
                        Name: 'custom:referralCode',
                        Value: body.referralCode
                    },
                ],
            };
            let newCamUser = yield cognitoIdentityServiceProvider.signUp(params).promise();
            console.log(newCamUser);
            return responseManager.send(200);
        }
        catch (err) {
            console.log(err);
            if (err.code === 'UsernameExistsException')
                return responseManager.send(400, {
                    code: "UsernameExistsException",
                    message: "Email already exists"
                });
            return responseManager.send(501);
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwVXNlckFQSS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zZXJ2aWNlcy91c2VyR3JhcGgvdXNlci9zaWduVXBVc2VyQVBJLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbUVBQTREO0FBQzVELGlHQUFpRztBQUNqRyxpQ0FBa0M7QUFDbEMseUVBQW9FO0FBRXBFLFNBQXNCLElBQUksQ0FBQyxLQUFLOztRQUM5QixJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLGNBQWMsR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUcxQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssRUFBRSxJQUFJLENBQUEsTUFBTSxjQUFjLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFLLElBQUk7WUFDbEksT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDL0IsSUFBSSxFQUFFLHFCQUFxQjtnQkFDM0IsT0FBTyxFQUFFLHVCQUF1QjthQUNqQyxDQUFDLENBQUM7UUFHTCxJQUFHO1lBRUQsSUFBSSw4QkFBOEIsR0FBRyxJQUFJLDhCQUE4QixDQUFDO2dCQUN0RSxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksY0FBYzthQUM3QyxDQUFDLENBQUM7WUFDSCxJQUFJLE1BQU0sR0FBRztnQkFDWCxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUI7Z0JBQ3ZDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNwQixjQUFjLEVBQUU7b0JBQ2Q7d0JBQ0UsSUFBSSxFQUFFLGlCQUFpQjt3QkFDdkIsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO3FCQUNyQjtvQkFDRDt3QkFDRSxJQUFJLEVBQUUsTUFBTTt3QkFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7cUJBQ3JCO29CQUNEO3dCQUNFLElBQUksRUFBRSx3QkFBd0I7d0JBQzlCLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUU7cUJBQ3pCO29CQUNEO3dCQUNFLElBQUksRUFBRSw0QkFBNEI7d0JBQ2xDLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUU7cUJBQ3pCO29CQUNEO3dCQUNFLElBQUksRUFBRSxxQkFBcUI7d0JBQzNCLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWTtxQkFDekI7aUJBQ0Y7YUFDRixDQUFDO1lBRUYsSUFBSSxVQUFVLEdBQUcsTUFBTSw4QkFBOEIsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFL0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUV4QixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFHLHlCQUF5QjtnQkFDdEMsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDL0IsSUFBSSxFQUFFLHlCQUF5QjtvQkFDL0IsT0FBTyxFQUFFLHNCQUFzQjtpQkFDaEMsQ0FBQyxDQUFDO1lBQ0wsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztDQUFBO0FBN0RELG9CQTZEQyJ9