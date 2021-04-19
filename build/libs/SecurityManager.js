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
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId((_d = (_c = this.event.requestContext) === null || _c === void 0 ? void 0 : _c.identity) === null || _d === void 0 ? void 0 : _d.cognitoAuthenticationProvider.toString().slice(((_f = (_e = this.event.requestContext) === null || _e === void 0 ? void 0 : _e.identity) === null || _f === void 0 ? void 0 : _f.cognitoAuthenticationProvider.toString().lastIndexOf(':')) + 1));
            if (!user) {
                console.log("User not found");
                return false;
            }
            if (user['_id'].toString() == ((_g = this.event.pathParameters) === null || _g === void 0 ? void 0 : _g.userId.toString())) {
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
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == undefined)
                return false;
            let user = yield this.repo.getUserByCognitoId((_d = (_c = this.event.requestContext) === null || _c === void 0 ? void 0 : _c.identity) === null || _d === void 0 ? void 0 : _d.cognitoAuthenticationProvider.toString().slice(((_f = (_e = this.event.requestContext) === null || _e === void 0 ? void 0 : _e.identity) === null || _f === void 0 ? void 0 : _f.cognitoAuthenticationProvider.toString().lastIndexOf(':')) + 1));
            if (!user) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    isUserCam() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == undefined)
                return false;
            let user = yield this.repo.getUserByCognitoId((_d = (_c = this.event.requestContext) === null || _c === void 0 ? void 0 : _c.identity) === null || _d === void 0 ? void 0 : _d.cognitoAuthenticationProvider.toString().slice(((_f = (_e = this.event.requestContext) === null || _e === void 0 ? void 0 : _e.identity) === null || _f === void 0 ? void 0 : _f.cognitoAuthenticationProvider.toString().lastIndexOf(':')) + 1));
            if (!user) {
                return false;
            }
            else {
                if (user.userType == User_1.UserTypes.CamUser) {
                    return true;
                }
                else
                    return false;
            }
        });
    }
    isUserClassic() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == undefined)
                return false;
            let user = yield this.repo.getUserByCognitoId((_d = (_c = this.event.requestContext) === null || _c === void 0 ? void 0 : _c.identity) === null || _d === void 0 ? void 0 : _d.cognitoAuthenticationProvider.toString().slice(((_f = (_e = this.event.requestContext) === null || _e === void 0 ? void 0 : _e.identity) === null || _f === void 0 ? void 0 : _f.cognitoAuthenticationProvider.toString().lastIndexOf(':')) + 1));
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
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            let placeRepo = new PlaceRepository_1.PlaceRepository();
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == "undefined" ||
                typeof ((_c = this.event.pathParameters) === null || _c === void 0 ? void 0 : _c.placeId) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId((_e = (_d = this.event.requestContext) === null || _d === void 0 ? void 0 : _d.identity) === null || _e === void 0 ? void 0 : _e.cognitoAuthenticationProvider.toString().slice(((_g = (_f = this.event.requestContext) === null || _f === void 0 ? void 0 : _f.identity) === null || _g === void 0 ? void 0 : _g.cognitoAuthenticationProvider.toString().lastIndexOf(':')) + 1));
            let place = yield placeRepo.getPlace((_h = this.event.pathParameters) === null || _h === void 0 ? void 0 : _h.placeId.toString());
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
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            let postRepo = new PostRepository_1.PostRepository();
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == "undefined" ||
                typeof ((_c = this.event.pathParameters) === null || _c === void 0 ? void 0 : _c.postId) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId((_e = (_d = this.event.requestContext) === null || _d === void 0 ? void 0 : _d.identity) === null || _e === void 0 ? void 0 : _e.cognitoAuthenticationProvider.toString().slice(((_g = (_f = this.event.requestContext) === null || _f === void 0 ? void 0 : _f.identity) === null || _g === void 0 ? void 0 : _g.cognitoAuthenticationProvider.toString().lastIndexOf(':')) + 1));
            let post = yield postRepo.getPost((_h = this.event.pathParameters) === null || _h === void 0 ? void 0 : _h.postId);
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
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            let commentRepo = new CommentRepository_1.CommentRepository();
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == "undefined" ||
                typeof ((_c = this.event.pathParameters) === null || _c === void 0 ? void 0 : _c.commentId) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId((_e = (_d = this.event.requestContext) === null || _d === void 0 ? void 0 : _d.identity) === null || _e === void 0 ? void 0 : _e.cognitoAuthenticationProvider.toString().slice(((_g = (_f = this.event.requestContext) === null || _f === void 0 ? void 0 : _f.identity) === null || _g === void 0 ? void 0 : _g.cognitoAuthenticationProvider.toString().lastIndexOf(':')) + 1));
            let comment = yield commentRepo.getComment((_h = this.event.pathParameters) === null || _h === void 0 ? void 0 : _h.commentId);
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
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            let commentRepo = new CommentRepository_1.CommentRepository();
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == "undefined" ||
                typeof ((_c = this.event.pathParameters) === null || _c === void 0 ? void 0 : _c.userId) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId((_e = (_d = this.event.requestContext) === null || _d === void 0 ? void 0 : _d.identity) === null || _e === void 0 ? void 0 : _e.cognitoAuthenticationProvider.toString().slice(((_g = (_f = this.event.requestContext) === null || _f === void 0 ? void 0 : _f.identity) === null || _g === void 0 ? void 0 : _g.cognitoAuthenticationProvider.toString().lastIndexOf(':')) + 1));
            if (user['_id'].toString() == this.event.pathParameters.userId.toString()) {
                return true;
            }
            else {
                return false;
            }
            return false;
        });
    }
    getUserLogged() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == "undefined")
                return null;
            return yield this.repo.getUserByCognitoId((_d = (_c = this.event.requestContext) === null || _c === void 0 ? void 0 : _c.identity) === null || _d === void 0 ? void 0 : _d.cognitoAuthenticationProvider.toString().slice(((_f = (_e = this.event.requestContext) === null || _e === void 0 ? void 0 : _e.identity) === null || _f === void 0 ? void 0 : _f.cognitoAuthenticationProvider.toString().lastIndexOf(':')) + 1));
        });
    }
}
exports.SecurityManager = SecurityManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VjdXJpdHlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYnMvU2VjdXJpdHlNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EseUNBQStDO0FBQy9DLHFFQUFnRTtBQUNoRSxtRUFBOEQ7QUFDOUQseUVBQW9FO0FBRXBFLE1BQWEsZUFBZTtJQUl4QixZQUFZLGNBQThCLEVBQUUsS0FBVTtRQUNsRCxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRUssY0FBYzs7O1lBQ2hCLElBQUksb0JBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLDBDQUFFLFFBQVEsMENBQUUsNkJBQTZCLENBQUEsSUFBSSxXQUFXO2dCQUN4RixPQUFPLEtBQUssQ0FBQztZQUVqQixJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLGFBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLDBDQUFFLFFBQVEsMENBQUUsNkJBQTZCLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxhQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYywwQ0FBRSxRQUFRLDBDQUFFLDZCQUE2QixDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxLQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3JPLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUM5QixPQUFPLEtBQUssQ0FBQzthQUNoQjtZQUNELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxXQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYywwQ0FBRSxNQUFNLENBQUMsUUFBUSxHQUFFLEVBQUU7Z0JBQ3hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFB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