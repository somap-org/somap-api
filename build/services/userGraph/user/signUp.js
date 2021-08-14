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
AWS.config.update({ region: process.env.REGION || 'us-east-1' });
function main(event) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_b = (_a = event.request) === null || _a === void 0 ? void 0 : _a.userAttributes) === null || _b === void 0 ? void 0 : _b.email) && ((_c = event.request) === null || _c === void 0 ? void 0 : _c.userAttributes['custom:userType'])) {
            let repo = new UserRepository_1.UserRepository();
            let placeRepo = new PlaceRepository_1.PlaceRepository();
            let user;
            let userPublicProfile = {
                profileImage: null,
                username: event.request.userAttributes.name
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
                referralCode: referralCodeGenerator.custom('uppercase', 6, 6, event.request.userAttributes.name).replace(' ', ''),
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
                console.log('User added', userAdded);
                let placeAdded = null;
                if (user.userType === User_1.UserTypes.CamUser) {
                    const ivs = new AWS.IVS({
                        apiVersion: '2020-07-14',
                        region: process.env.REGION || 'us-east-1'
                    });
                    const params = {
                        latencyMode: 'LOW',
                        name: userAdded['_id'].toString(),
                        type: 'BASIC'
                    };
                    const ivsResult = yield ivs.createChannel(params).promise();
                    let live = yield repo.updateLiveInfo(userAdded._id, {
                        channel: ivsResult.channel.arn,
                        streamServerUrl: ivsResult.channel.ingestEndpoint,
                        streamKey: ivsResult.streamKey.value,
                        liveUrl: ivsResult.channel.playbackUrl
                    });
                    console.log("User after live info changed", live);
                    let addPlace = {
                        name: null,
                        description: null,
                        address: null,
                        location: {
                            type: 'Point',
                            coordinates: [
                                0,
                                0
                            ]
                        },
                        camUser: userAdded._id
                    };
                    placeAdded = yield placeRepo.addPlace(addPlace);
                    console.log("Place added", placeAdded);
                }
                let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
                    region: process.env.REGION || 'us-east-1'
                });
                var params = {
                    UserAttributes: [
                        {
                            Name: 'custom:userId',
                            Value: userAdded['_id'].toString()
                        }
                    ],
                    UserPoolId: process.env.COGNITO_USER_POOL_ID,
                    Username: event.request.userAttributes.sub
                };
                if (placeAdded) {
                    params.UserAttributes.push({
                        Name: 'custom:placeId',
                        Value: placeAdded['_id'].toString()
                    });
                }
                yield cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
                let paramsUserEmail = {
                    Destination: {
                        ToAddresses: [
                            user.email
                        ]
                    },
                    Source: 'noreply@somap.app',
                    Template: 'CompleteSomapAccount',
                    TemplateData: JSON.stringify({
                        username: user.publicProfile.username,
                        referralCode: user.referralCode
                    }),
                    ReplyToAddresses: [
                        'noreply@somap.app'
                    ],
                };
                yield new AWS.SES({ apiVersion: '2010-12-01' }).sendTemplatedEmail(paramsUserEmail).promise();
                return event;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC91c2VyL3NpZ25VcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLCtDQUErQztBQUMvQyx5RUFBb0U7QUFDcEUsaUdBQWlHO0FBQ2pHLDJFQUFzRTtBQUV0RSxNQUFNLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ2pFLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxXQUFXLEVBQUMsQ0FBQyxDQUFDO0FBa0IvRCxTQUFzQixJQUFJLENBQUMsS0FBSzs7O1FBRTlCLElBQUksYUFBQSxLQUFLLENBQUMsT0FBTywwQ0FBRSxjQUFjLDBDQUFFLEtBQUssWUFBSSxLQUFLLENBQUMsT0FBTywwQ0FBRSxjQUFjLENBQUMsaUJBQWlCLEVBQUMsRUFBRTtZQUM1RixJQUFJLElBQUksR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztZQUNoQyxJQUFJLFNBQVMsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUN0QyxJQUFJLElBQUksQ0FBQztZQUdULElBQUksaUJBQWlCLEdBQUc7Z0JBQ3RCLFlBQVksRUFBRSxJQUFJO2dCQUNsQixRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSTthQUM1QyxDQUFDO1lBQ0YsSUFBSSxZQUFZLEdBQUc7Z0JBQ2pCLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixjQUFjLEVBQUUsUUFBUTthQUN6QixDQUFDO1lBQ0YsSUFBSSxHQUFHO2dCQUNMLFNBQVMsRUFBRSxLQUFL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