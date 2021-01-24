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
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        const body = JSON.parse(event.body);
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
                ],
            };
            let newCamUser = yield cognitoIdentityServiceProvider.signUp(params).promise();
            console.log(newCamUser);
            return responseManager.send(200);
        }
        catch (err) {
            console.log(err);
            return responseManager.send(501);
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwVXNlckFQSS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zZXJ2aWNlcy91c2VyR3JhcGgvdXNlci9zaWduVXBVc2VyQVBJLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbUVBQTREO0FBQzVELGlHQUFpRztBQUNqRyxpQ0FBa0M7QUFLbEMsU0FBc0IsSUFBSSxDQUFDLEtBQUs7O1FBQzlCLElBQUksZUFBZSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBRzVDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBDLElBQUc7WUFFRCxJQUFJLDhCQUE4QixHQUFHLElBQUksOEJBQThCLENBQUM7Z0JBQ3RFLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxjQUFjO2FBQzdDLENBQUMsQ0FBQztZQUNILElBQUksTUFBTSxHQUFHO2dCQUNYLFFBQVEsRUFBRSw0QkFBNEI7Z0JBQ3RDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNwQixjQUFjLEVBQUU7b0JBQ2Q7d0JBQ0UsSUFBSSxFQUFFLGlCQUFpQjt3QkFDdkIsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO3FCQUNyQjtvQkFDRDt3QkFDRSxJQUFJLEVBQUUsTUFBTTt3QkFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7cUJBQ3JCO29CQUNEO3dCQUNFLElBQUksRUFBRSx3QkFBd0I7d0JBQzlCLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUU7cUJBQ3pCO29CQUNEO3dCQUNFLElBQUksRUFBRSw0QkFBNEI7d0JBQ2xDLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUU7cUJBQ3pCO2lCQUNGO2FBQ0YsQ0FBQztZQUVGLElBQUksVUFBVSxHQUFHLE1BQU0sOEJBQThCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRS9FLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFeEIsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7Q0FBQTtBQTVDRCxvQkE0Q0MifQ==