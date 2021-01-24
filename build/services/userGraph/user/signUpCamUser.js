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
                        Value: 'camUser'
                    },
                    {
                        Name: 'name',
                        Value: body.username
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwQ2FtVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zZXJ2aWNlcy91c2VyR3JhcGgvdXNlci9zaWduVXBDYW1Vc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbUVBQTREO0FBQzVELGlHQUFpRztBQUtqRyxTQUFzQixJQUFJLENBQUMsS0FBSzs7UUFDOUIsSUFBSSxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFHNUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFcEMsSUFBRztZQUVELElBQUksOEJBQThCLEdBQUcsSUFBSSw4QkFBOEIsQ0FBQztnQkFDdEUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLGNBQWM7YUFDN0MsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxNQUFNLEdBQUc7Z0JBQ1gsUUFBUSxFQUFFLDRCQUE0QjtnQkFDdEMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ3BCLGNBQWMsRUFBRTtvQkFDZDt3QkFDRSxJQUFJLEVBQUUsaUJBQWlCO3dCQUN2QixLQUFLLEVBQUUsU0FBUztxQkFDakI7b0JBQ0Q7d0JBQ0UsSUFBSSxFQUFFLE1BQU07d0JBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO3FCQUNyQjtpQkFDRjthQUNGLENBQUM7WUFFRixJQUFJLFVBQVUsR0FBRyxNQUFNLDhCQUE4QixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUUvRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRXhCLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDO0NBQUE7QUFwQ0Qsb0JBb0NDIn0=