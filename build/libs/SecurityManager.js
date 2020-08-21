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
                return false;
            }
            if (user['_id'].toString() == ((_e = this.event.pathParameters) === null || _e === void 0 ? void 0 : _e.userId.toString())) {
                return true;
            }
            else {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VjdXJpdHlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYnMvU2VjdXJpdHlNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EseUNBQXlDO0FBQ3pDLHFFQUFnRTtBQUNoRSxtRUFBOEQ7QUFDOUQseUVBQW9FO0FBRXBFLE1BQWEsZUFBZTtJQUl4QixZQUFZLGNBQThCLEVBQUUsS0FBVTtRQUNsRCxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRUssY0FBYzs7O1lBQ2hCLElBQUksb0JBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLDBDQUFFLFFBQVEsMENBQUUsaUJBQWlCLENBQUEsSUFBSSxXQUFXO2dCQUM1RSxPQUFPLEtBQUssQ0FBQztZQUVqQixJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLGFBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLDBDQUFFLFFBQVEsMENBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUN0RyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUVQLE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1lBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLFdBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLDBDQUFFLE1BQU0sQ0FBQyxRQUFRLEdBQUUsRUFBRTtnQkFFeEUsT0FBTyxJQUFJLENBQUM7YUFDZjtpQkFDSTtnQkFFRCxPQUFPLEtBQUssQ0FBQzthQUNoQjtZQUNELE9BQU8sS0FBSyxDQUFDOztLQUNoQjtJQUVLLFlBQVk7OztZQUNkLElBQUksb0JBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLDBDQUFFLFFBQVEsMENBQUUsaUJBQWlCLENBQUEsSUFBSSxTQUFTO2dCQUMxRSxPQUFPLEtB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