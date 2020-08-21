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
<<<<<<< Updated upstream
const mongodb_1 = require("../../libs/mongodb");
const User_1 = require("../../models/User");
function main(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(event);
        if (event.request.userAttributes.email && event.request.userAttributes['custom:userType']) {
            yield mongodb_1.connect();
            var username = event.request.userAttributes.email.split("@")[0];
            let userPublicProfile = {
                userType: event.request.userAttributes['custom:userType'],
                username: username,
                followers: 0,
                following: 0,
                profileImage: null
            };
            let userSettings = {
                enableNotification: false,
                apperInPeapleHere: false,
                profilePrivacy: "public"
            };
            let user = {
                cognitoId: event.request.userAttributes.sub,
                email: event.request.userAttributes.email,
=======
const User_1 = require("../../models/User");
const UserRepository_1 = require("../../repositories/UserRepository");
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let cognitoData = event;
        if (cognitoData.request.userAttributes.email && cognitoData.request.userAttributes['custom:userType']) {
            let repo = new UserRepository_1.UserRepository();
            let user;
            let userPublicProfile = {
                userType: User_1.UserTypes.CamUser,
                profileImage: "test",
                username: event.userName,
                followers: 0,
                following: 0,
            };
            if (cognitoData.request.userAttributes['custom:userType'] === "ClassicUser") {
                userPublicProfile.userType = User_1.UserTypes.ClassicUser;
            }
            else if (cognitoData.request.userAttributes['custom:userType'] === "CamUser") {
                userPublicProfile.userType = User_1.UserTypes.CamUser;
            }
            else
                return;
            let userSettings = {
                enableNotification: true,
                appearInPeopleHere: true,
                receiveComment: true,
                profilePrivacy: true
            };
            user = {
                cognitoId: cognitoData.request.userAttributes.sub.toString(),
                email: cognitoData.request.userAttributes.email,
>>>>>>> Stashed changes
                instagram: null,
                facebook: null,
                publicProfile: userPublicProfile,
                settings: userSettings
            };
<<<<<<< Updated upstream
            User_1.UserModel.create(user, (err) => {
                if (err)
                    console.log(err);
            });
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC9zaWduVXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxnREFBMkM7QUFDM0MsNENBQWtEO0FBRWxELFNBQXNCLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVE7O1FBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbkIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUN2RixNQUFNLGlCQUFPLEVBQUUsQ0FBQztZQUVoQixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhFLElBQUksaUJBQWlCLEdBQUc7Z0JBQ3BCLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDekQsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFlBQVksRUFBRSxJQUFJO2FBQ3JCLENBQUM7WUFFRixJQUFJLFlBQVksR0FBRztnQkFDZixrQkFBa0IsRUFBRSxLQUFLO2dCQUN6QixpQkFBaUIsRUFBRSxLQUFLO2dCQUN4QixjQUFjLEVBQUUsUUFBUTthQUMzQixDQUFDO1lBRUYsSUFBSSxJQUFJLEdBQUc7Z0JBQ1AsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUc7Z0JBQzNDLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLO2dCQUN6QyxTQUFTLEVBQUUsSUFBSTtnQkFDZixRQUFRLEVBQUUsSUFBSTtnQkFDZCxhQUFhLEVBQUUsaUJBQWlCO2dCQUNoQyxRQUFRLEVBQUUsWUFBWTthQUN6QixDQUFDO1lBRUYsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQzNCLElBQUcsR0FBRztvQkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFBO1NBQ0w7SUFDTCxDQUFDO0NBQUE7QUFuQ0Qsb0JBbUNDIn0=
=======
            repo.signUpUser(user).then((user) => {
                console.log("Utente registrato", user);
                return event;
            }).catch((err) => {
                console.log("Si è verificato un errore");
                console.log(err);
                console.log("per l'utente");
                console.log(user);
                return err;
            });
        }
        else {
            return "Bad Request";
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC9zaWduVXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw0Q0FBNEM7QUFDNUMsc0VBQWlFO0FBYWpFLFNBQXNCLElBQUksQ0FBQyxLQUFLOztRQUU1QixJQUFJLFdBQVcsR0FBZSxLQUFLLENBQUM7UUFFcEMsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUNuRyxJQUFJLElBQUksR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztZQUNoQyxJQUFJLElBQUksQ0FBQztZQUVULElBQUksaUJBQWlCLEdBQUc7Z0JBQ3BCLFFBQVEsRUFBRSxnQkFBUyxDQUFDLE9BQU87Z0JBQzNCLFlBQVksRUFBRSxNQUFNO2dCQUNwQixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7Z0JBQ3hCLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFNBQVMsRUFBRSxDQUFDO2FBQ2YsQ0FBQztZQUVGLElBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsS0FBSyxhQUFhLEVBQUM7Z0JBQ3ZFLGlCQUFpQixDQUFDLFFBQVEsR0FBRyxnQkFBUyxDQUFDLFdBQVcsQ0FBQzthQUN0RDtpQkFBTSxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUM1RSxpQkFBaUIsQ0FBQyxRQUFRLEdBQUcsZ0JBQVMsQ0FBQyxPQUFPLENBQUM7YUFDbEQ7O2dCQUNHLE9BQU87WUFFWCxJQUFJLFlBQVksR0FBRztnQkFDZixrQkFBa0IsRUFBRSxJQUFJO2dCQUN4QixrQkFBa0IsRUFBRSxJQUFJO2dCQUN4QixjQUFjLEVBQUUsSUFBSTtnQkFDcEIsY0FBYyxFQUFFLElBQUk7YUFDdkIsQ0FBQztZQUVGLElBQUksR0FBRztnQkFDSCxTQUFTLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRTtnQkFDNUQsS0FBSyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUs7Z0JBQy9DLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFFBQVEsRUFBRSxJQUFJO2dCQUNkLGFBQWEsRUFBRSxpQkFBaUI7Z0JBQ2hDLFFBQVEsRUFBRSxZQUFZO2FBQ3pCLENBQUM7WUFFRixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxPQUFPLEtBQUssQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7Z0JBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xCLE9BQU8sR0FBRyxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUE7U0FFTDthQUFNO1lBQ0gsT0FBTyxhQUFhLENBQUM7U0FDeEI7SUFDTCxDQUFDO0NBQUE7QUFyREQsb0JBcURDIn0=
>>>>>>> Stashed changes
