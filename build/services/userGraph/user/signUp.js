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
exports.deleteUser = exports.main = void 0;
const User_1 = require("../../../models/User");
const UserRepository_1 = require("../../../repositories/UserRepository");
const CognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");
const referralCodeGenerator = require('referral-code-generator');
var AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION || 'eu-central-1' });
function main(event) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_b = (_a = event.request) === null || _a === void 0 ? void 0 : _a.userAttributes) === null || _b === void 0 ? void 0 : _b.email) && ((_c = event.request) === null || _c === void 0 ? void 0 : _c.userAttributes['custom:userType'])) {
            let repo = new UserRepository_1.UserRepository();
            let user;
            let userPublicProfile = {
                profileImage: "test",
                username: event.request.userAttributes.name,
                followers: 0,
                following: 0,
            };
            let userSettings = {
                enableNotification: true,
                appearInPeopleHere: true,
                receiveComment: true,
                profilePrivacy: "public"
            };
            user = {
                cognitoId: event.request.userAttributes.sub.toString(),
                email: event.request.userAttributes.email,
                instagram: null,
                facebook: null,
                publicProfile: userPublicProfile,
                settings: userSettings,
                referralCode: referralCodeGenerator.custom('uppercase', 6, 6, event.request.userAttributes.name),
                referralCodeUsed: event.request.userAttributes['custom:referralCode']
            };
            if (event.request.userAttributes['custom:userType'] == "classicUser") {
                user.userType = User_1.UserTypes.ClassicUser;
            }
            else if (event.request.userAttributes['custom:userType'] == "camUser") {
                user.userType = User_1.UserTypes.CamUser;
            }
            else {
                return null;
            }
            try {
                let userAdded = yield repo.signUpUser(user);
                console.log('USER ADDED', userAdded);
                let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
                    region: process.env.REGION || 'eu-central-1'
                });
                var params = {
                    UserAttributes: [
                        {
                            Name: 'custom:userId',
                            Value: userAdded['_id'].toString()
                        },
                    ],
                    UserPoolId: 'eu-central-1_EVTeuSqat',
                    Username: event.request.userAttributes.sub
                };
                yield cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
                console.log('testtt');
                if (user.userType === User_1.UserTypes.CamUser) {
                    const ivs = new AWS.IVS({
                        apiVersion: '2020-07-14',
                        region: 'us-west-2'
                    });
                    const params = {
                        latencyMode: 'NORMAL',
                        name: userAdded['_id'].toString(),
                        type: 'BASIC'
                    };
                    const result = yield ivs.createChannel(params).promise();
                    console.log({
                        channel: result.channel.arn,
                        streamKey: result.streamKey.value
                    });
                    let live = yield repo.updateLiveInfo(userAdded._id, {
                        channel: result.channel.arn,
                        streamServerUrl: result.channel.ingestEndpoint,
                        streamKey: result.streamKey.value,
                        liveUrl: result.channel.playbackUrl
                    });
                    console.log(live);
                }
                let paramsUserEmail = {
                    Destination: {
                        ToAddresses: [
                            user.email
                        ]
                    },
                    Source: 'business@somap.app',
                    Template: 'CompleteSomapAccount',
                    TemplateData: JSON.stringify({
                        username: user.publicProfile.username,
                        referralCode: user.referralCode
                    }),
                    ReplyToAddresses: [
                        'business@somap.app'
                    ],
                };
                yield new AWS.SES({ apiVersion: '2010-12-01' }).sendTemplatedEmail(paramsUserEmail).promise();
                return userAdded;
            }
            catch (e) {
                console.log('ERROR ADDING USER', e);
                return null;
            }
        }
        else {
            console.log('ERROR EMAIL OR USER TYPE NOT FOUND');
            return null;
        }
    });
}
exports.main = main;
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let repo = new UserRepository_1.UserRepository();
        try {
            yield repo.deleteUser(userId);
            return true;
        }
        catch (e) {
            return null;
        }
    });
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC91c2VyL3NpZ25VcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLCtDQUErQztBQUMvQyx5RUFBb0U7QUFDcEUsaUdBQWlHO0FBRWpHLE1BQU0scUJBQXFCLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDakUsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLGNBQWMsRUFBQyxDQUFDLENBQUM7QUFrQmxFLFNBQXNCLElBQUksQ0FBQyxLQUFLOzs7UUFFOUIsSUFBSSxhQUFBLEtBQUssQ0FBQyxPQUFPLDBDQUFFLGNBQWMsMENBQUUsS0FBSyxZQUFJLEtBQUssQ0FBQyxPQUFPLDBDQUFFLGNBQWMsQ0FBQyxpQkFBaUIsRUFBQyxFQUFFO1lBRTVGLElBQUksSUFBSSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1lBQ2hDLElBQUksSUFBSSxDQUFDO1lBRVQsSUFBSSxpQkFBaUIsR0FBRztnQkFDdEIsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJO2dCQUMzQyxTQUFTLEVBQUUsQ0FBQztnQkFDWixTQUFTLEVBQUUsQ0FBQzthQUNiLENBQUM7WUFFRixJQUFJLFlBQVksR0FBRztnQkFDakIsa0JBQWtCLEVBQUUsSUFBSTtnQkFDeEIsa0JBQWtCLEVBQUUsSUFBSTtnQkFDeEIsY0FBYyxFQUFFLElBQUk7Z0JBQ3BCLGNBQWMsRUFBRSxRQUFRO2FBQ3pCLENBQUM7WUFFRixJQUFJLEdBQUc7Z0JBQ0wsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENB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