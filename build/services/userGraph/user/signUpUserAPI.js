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
                ClientId: '67kp8e31k2cg4828hp93rurtp3',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwVXNlckFQSS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zZXJ2aWNlcy91c2VyR3JhcGgvdXNlci9zaWduVXBVc2VyQVBJLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbUVBQTREO0FBQzVELGlHQUFpRztBQUNqRyxpQ0FBa0M7QUFDbEMseUVBQW9FO0FBS3BFLFNBQXNCLElBQUksQ0FBQyxLQUFLOztRQUM5QixJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLGNBQWMsR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUcxQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssRUFBRSxJQUFJLENBQUEsTUFBTSxjQUFjLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFLLElBQUk7WUFDbEksT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDL0IsSUFBSSxFQUFFLHFCQUFxQjtnQkFDM0IsT0FBTyxFQUFFLHVCQUF1QjthQUNqQyxDQUFDLENBQUM7UUFHTCxJQUFHO1lBRUQsSUFBSSw4QkFBOEIsR0FBRyxJQUFJLDhCQUE4QixDQUFDO2dCQUN0RSxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksY0FBYzthQUM3QyxDQUFDLENBQUM7WUFDSCxJQUFJLE1BQU0sR0FBRztnQkFDWCxRQUFRLEVBQUUsNEJBQTRCO2dCQUN0QyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3ZCLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDcEIsY0FBYyxFQUFFO29CQUNkO3dCQUNFLElBQUksRUFBRSxpQkFBaUI7d0JBQ3ZCLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUTtxQkFDckI7b0JBQ0Q7d0JBQ0UsSUFBSSxFQUFFLE1BQU07d0JBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO3FCQUNyQjtvQkFDRDt3QkFDRSxJQUFJLEVBQUUsd0JBQXdCO3dCQUM5QixLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFO3FCQUN6QjtvQkFDRDt3QkFDRSxJQUFJLEVBQUUsNEJBQTRCO3dCQUNsQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFO3FCQUN6QjtvQkFDRDt3QkFDRSxJQUFJLEVBQUUscUJBQXFCO3dCQUMzQixLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVk7cUJBQ3pCO2lCQUNGO2FBQ0YsQ0FBQztZQUVGLElBQUksVUFBVSxHQUFHLE1BQU0sOEJBQThCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRS9FLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFeEIsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLElBQUksR0FBRyxDQUFDLElBQUksS0FBRyx5QkFBeUI7Z0JBQ3RDLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQy9CLElBQUksRUFBRSx5QkFBeUI7b0JBQy9CLE9BQU8sRUFBRSxzQkFBc0I7aUJBQ2hDLENBQUMsQ0FBQztZQUNMLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7Q0FBQTtBQTdERCxvQkE2REMifQ==