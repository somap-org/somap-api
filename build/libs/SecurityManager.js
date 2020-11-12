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
exports.SecurityManager = void 0;
const User_1 = require("../models/User");
const PlaceRepository_1 = require("../repositories/PlaceRepository");
const PostRepository_1 = require("../repositories/PostRepository");
const CommentRepository_1 = require("../repositories/CommentRepository");
class SecurityManager {
    constructor(userRepository, event) {
        this.repo = userRepository;
        this.event = event;
    }
    isUserIdLogged() {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoIdentityId) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId((_d = (_c = this.event.requestContext) === null || _c === void 0 ? void 0 : _c.identity) === null || _d === void 0 ? void 0 : _d.cognitoIdentityId);
            if (!user) {
                console.log("User not found");
                return false;
            }
            if (user['_id'].toString() == ((_e = this.event.pathParameters) === null || _e === void 0 ? void 0 : _e.userId.toString())) {
                console.log("Authorized");
                return true;
            }
            else {
                console.log("Not Authorized: " + user['_id'] + "-" + this.event.pathParameters.userId);
                return false;
            }
            return false;
        });
    }
    isUserLogged() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoIdentityId) == undefined)
                return false;
            let user = yield this.repo.getUserByCognitoId((_d = (_c = this.event.requestContext) === null || _c === void 0 ? void 0 : _c.identity) === null || _d === void 0 ? void 0 : _d.cognitoIdentityId);
            if (!user) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    isUserCam() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoIdentityId) == undefined)
                return false;
            let user = yield this.repo.getUserByCognitoId((_d = (_c = this.event.requestContext) === null || _c === void 0 ? void 0 : _c.identity) === null || _d === void 0 ? void 0 : _d.cognitoIdentityId);
            if (!user) {
                return false;
            }
            else {
                if (user.userType == User_1.UserTypes.CamUser)
                    return true;
                else
                    return false;
            }
        });
    }
    isUserClassic() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoIdentityId) == undefined)
                return false;
            let user = yield this.repo.getUserByCognitoId((_d = (_c = this.event.requestContext) === null || _c === void 0 ? void 0 : _c.identity) === null || _d === void 0 ? void 0 : _d.cognitoIdentityId);
            if (!user) {
                return false;
            }
            else {
                if (user.userType == User_1.UserTypes.ClassicUser)
                    return true;
                else
                    return false;
            }
        });
    }
    isUserCamPlaceOwner() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            let placeRepo = new PlaceRepository_1.PlaceRepository();
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoIdentityId) == "undefined" ||
                typeof ((_c = this.event.pathParameters) === null || _c === void 0 ? void 0 : _c.placeId) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId((_e = (_d = this.event.requestContext) === null || _d === void 0 ? void 0 : _d.identity) === null || _e === void 0 ? void 0 : _e.cognitoIdentityId);
            let place = yield placeRepo.getPlace((_f = this.event.pathParameters) === null || _f === void 0 ? void 0 : _f.placeId.toString());
            if (!user || !place) {
                return false;
            }
            if (user['_id'].toString() == place.camUser.toString()) {
                return true;
            }
            else {
                return false;
            }
            return false;
        });
    }
    isUserPostOwner() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            let postRepo = new PostRepository_1.PostRepository();
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoIdentityId) == "undefined" ||
                typeof ((_c = this.event.pathParameters) === null || _c === void 0 ? void 0 : _c.postId) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId((_e = (_d = this.event.requestContext) === null || _d === void 0 ? void 0 : _d.identity) === null || _e === void 0 ? void 0 : _e.cognitoIdentityId);
            let post = yield postRepo.getPost((_f = this.event.pathParameters) === null || _f === void 0 ? void 0 : _f.postId);
            if (user['_id'].toString() == post.author.toString()) {
                return true;
            }
            else {
                return false;
            }
            return false;
        });
    }
    isUserCommentOwner() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            let commentRepo = new CommentRepository_1.CommentRepository();
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoIdentityId) == "undefined" ||
                typeof ((_c = this.event.pathParameters) === null || _c === void 0 ? void 0 : _c.commentId) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId((_e = (_d = this.event.requestContext) === null || _d === void 0 ? void 0 : _d.identity) === null || _e === void 0 ? void 0 : _e.cognitoIdentityId);
            let comment = yield commentRepo.getComment((_f = this.event.pathParameters) === null || _f === void 0 ? void 0 : _f.commentId);
            if (user['_id'].toString() == comment.author.toString()) {
                return true;
            }
            else {
                return false;
            }
            return false;
        });
    }
    isUserLikeOwner() {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            let commentRepo = new CommentRepository_1.CommentRepository();
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoIdentityId) == "undefined" ||
                typeof ((_c = this.event.pathParameters) === null || _c === void 0 ? void 0 : _c.userId) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId((_e = (_d = this.event.requestContext) === null || _d === void 0 ? void 0 : _d.identity) === null || _e === void 0 ? void 0 : _e.cognitoIdentityId);
            if (user['_id'].toString() == this.event.pathParameters.userId.toString()) {
                return true;
            }
            else {
                return false;
            }
            return false;
        });
    }
}
exports.SecurityManager = SecurityManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VjdXJpdHlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYnMvU2VjdXJpdHlNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EseUNBQXlDO0FBQ3pDLHFFQUFnRTtBQUNoRSxtRUFBOEQ7QUFDOUQseUVBQW9FO0FBRXBFLE1BQWEsZUFBZTtJQUl4QixZQUFZLGNBQThCLEVBQUUsS0FBVTtRQUNsRCxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRUssY0FBYzs7O1lBQ2hCLElBQUksb0JBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLDBDQUFFLFFBQVEsMENBQUUsaUJBQWlCLENBQUEsSUFBSSxXQUFXO2dCQUM1RSxPQUFPLEtBQUssQ0FBQztZQUVqQixJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLGFBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLDBDQUFFLFFBQVEsMENBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUN0RyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDOUIsT0FBTyxLQUFLLENBQUM7YUFDaEI7WUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsV0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsMENBQUUsTUFBTSxDQUFDLFFBQVEsR0FBRSxFQUFFO2dCQUN4RSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUMxQixPQUFPLElBQUksQ0FBQzthQUNmO2lCQUNJO2dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFDLEdBQUcsR0FBQyxJ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