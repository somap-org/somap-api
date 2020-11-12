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
const SecurityManager_1 = require("../../../libs/SecurityManager");
const UserRepository_1 = require("../../../repositories/UserRepository");
const PostRepository_1 = require("../../../repositories/PostRepository");
const moment = require("moment");
function main(event) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new PostRepository_1.PostRepository();
        let userRepo = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepo, event);
        const profileId = event.pathParameters.userId;
        const authorId = yield userRepo.getUserByCognitoId((_b = (_a = event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoIdentityId);
        const body = JSON.parse(event.body);
        if (!(yield securityManager.isUserLogged()))
            return responseManager.send(401);
        let addPost = {
            profile: profileId,
            author: authorId['_id'],
            postedAt: moment().format(),
            body: body.body,
            sharedCount: 0,
            commentsCount: 0,
            likesCount: 0,
            sharedPost: body.sharedPost
        };
        try {
            if (body.sharedPost) {
                yield repo.incrementShare(body.sharedPost);
            }
            let post = yield repo.addPost(addPost);
            let response = yield repo.populatePost(post);
            return responseManager.send(200, response);
        }
        catch (err) {
            return responseManager.send(501, { err });
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkUG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9jb250ZW50L3Bvc3QvYWRkUG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLG1FQUE0RDtBQUM1RCxtRUFBOEQ7QUFDOUQseUVBQW9FO0FBRXBFLHlFQUFvRTtBQUlwRSxpQ0FBa0M7QUFLbEMsU0FBc0IsSUFBSSxDQUFDLEtBQUs7OztRQUM1QixJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUNoQyxJQUFJLFFBQVEsR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUNwQyxJQUFJLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTNELE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO1FBQzlDLE1BQU0sUUFBUSxHQUFHLE1BQU0sUUFBUSxDQUFDLGtCQUFrQixhQUFDLEtBQUssQ0FBQyxjQUFjLDBDQUFFLFFBQVEsMENBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUd0RyxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QyxJQUFHLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtZQUNwQyxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFckMsSUFBSSxPQUFPLEdBQUc7WUFDVixPQUFPLEVBQUUsU0FBUztZQUNsQixNQUFNLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUN2QixRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFO1lBQzNCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLFdBQVcsRUFBRSxDQUFDO1lBQ2QsYUFBYSxFQUFFLENBQUM7WUFDaEIsVUFBVSxFQUFFLENBQUM7WUFDYixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDOUIsQ0FBQztRQUVGLElBQUk7WUFFQSxJQUFHLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2hCLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDOUM7WUFFRCxJQUFJLElBQUksR0FBYSxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakQsSUFBSSxRQUFRLEdBQVEsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xELE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDOUM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO1NBQzNDOztDQUNKO0FBdENELG9CQXNDQyJ9