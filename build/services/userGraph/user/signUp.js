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
const PlaceRepository_1 = require("../../../repositories/PlaceRepository");
const referralCodeGenerator = require('referral-code-generator');
var AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION || 'eu-central-1' });
function main(event) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        console.log('START MAIN');
        if (((_b = (_a = event.request) === null || _a === void 0 ? void 0 : _a.userAttributes) === null || _b === void 0 ? void 0 : _b.email) && ((_c = event.request) === null || _c === void 0 ? void 0 : _c.userAttributes['custom:userType'])) {
            console.log('EMAIL AND USER TYPE FOUND', event.request.userAttributes.email, (_d = event.request) === null || _d === void 0 ? void 0 : _d.userAttributes['custom:userType']);
            let repo = new UserRepository_1.UserRepository();
            let placeRepo = new PlaceRepository_1.PlaceRepository();
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
                    region: process.env.REGION || 'us-east-1'
                });
                var params = {
                    UserAttributes: [
                        {
                            Name: 'custom:userId',
                            Value: userAdded['_id'].toString()
                        },
                    ],
                    UserPoolId: process.env.COGNITO_USER_POOL_ID,
                    Username: event.request.userAttributes.sub
                };
                yield cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
                if (user.userType === User_1.UserTypes.CamUser) {
                    const ivs = new AWS.IVS({
                        apiVersion: '2020-07-14',
                        region: process.env.REGION || 'us-east-1'
                    });
                    const params = {
                        latencyMode: 'LOW',
                        name: userAdded['_id'].toString(),
                        type: 'STANDARD'
                    };
                    const result = yield ivs.createChannel(params).promise();
                    console.log(result);
                    let live = yield repo.updateLiveInfo(userAdded._id, {
                        channel: result.channel.arn,
                        streamServerUrl: result.channel.ingestEndpoint,
                        streamKey: result.streamKey.value,
                        liveUrl: result.channel.playbackUrl
                    });
                    console.log(live);
                    let addPlace = {
                        name: null,
                        description: null,
                        address: null,
                        location: null,
                        camUser: userAdded._id
                    };
                    let placeAdded = yield placeRepo.addPlace(addPlace);
                    console.log("PLACE ADDED", placeAdded);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC91c2VyL3NpZ25VcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLCtDQUErQztBQUMvQyx5RUFBb0U7QUFDcEUsaUdBQWlHO0FBQ2pHLDJFQUFzRTtBQUV0RSxNQUFNLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ2pFLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxjQUFjLEVBQUMsQ0FBQyxDQUFDO0FBa0JsRSxTQUFzQixJQUFJLENBQUMsS0FBSzs7O1FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUIsSUFBSSxhQUFBLEtBQUssQ0FBQyxPQUFPLDBDQUFFLGNBQWMsMENBQUUsS0FBSyxZQUFJLEtBQUssQ0FBQyxPQUFPLDBDQUFFLGNBQWMsQ0FBQyxpQkFBaUIsRUFBQyxFQUFFO1lBQzVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxRQUFFLEtBQUssQ0FBQyxPQUFPLDBDQUFFLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQy9ILElBQUksSUFBSSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1lBQ2hDLElBQUksU0FBUyxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1lBQ3RDLElBQUksSUFBSSxDQUFDO1lBRVQsSUFBSSxpQkFBaUIsR0FBRztnQkFDdEIsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJO2dC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