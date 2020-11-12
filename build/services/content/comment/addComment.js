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
const moment = require("moment");
const CommentRepository_1 = require("../../../repositories/CommentRepository");
function main(event) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new CommentRepository_1.CommentRepository();
        let userRepo = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepo, event);
        let parentId;
        let parentType;
        if (event.pathParameters.postId) {
            parentId = event.pathParameters.postId;
            parentType = repo.parentTypes.POST;
        }
        else if (event.pathParameters.commentId) {
            parentId = event.pathParameters.commentId;
            parentType = repo.parentTypes.COMMENT;
        }
        else {
            return responseManager.send(400);
        }
        const authorId = yield userRepo.getUserByCognitoId((_b = (_a = event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoIdentityId);
        const body = JSON.parse(event.body);
        if (!(yield securityManager.isUserLogged()))
            return responseManager.send(401);
        let addComment = {
            author: authorId,
            parentType: parentType,
            parent: parentId,
            postedAt: moment().format(),
            body: body.body,
            repliesCount: 0,
            likesCount: 0,
            reply: false
        };
        try {
            let comment = yield repo.addComment(addComment);
            let response = yield repo.populate(comment);
            return responseManager.send(200, response);
        }
        catch (err) {
            console.log(err);
            return responseManager.send(501, { err });
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkQ29tbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9jb250ZW50L2NvbW1lbnQvYWRkQ29tbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLG1FQUE0RDtBQUM1RCxtRUFBOEQ7QUFDOUQseUVBQW9FO0FBQ3BFLGlDQUFrQztBQUNsQywrRUFBMEU7QUFTMUUsU0FBc0IsSUFBSSxDQUFDLEtBQUs7OztRQUM1QixJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLHFDQUFpQixFQUFFLENBQUM7UUFDbkMsSUFBSSxRQUFRLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzRCxJQUFJLFFBQVEsQ0FBQztRQUNiLElBQUksVUFBVSxDQUFDO1FBRWYsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRTtZQUM3QixRQUFRLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7WUFDdkMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1NBQ3RDO2FBQ0ksSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRTtZQUNyQyxRQUFRLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUM7WUFDMUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO1NBQ3pDO2FBQU07WUFDSCxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDcEM7UUFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLFFBQVEsQ0FBQyxrQkFBa0IsYUFBQyxLQUFLLENBQUMsY0FBYywwQ0FBRSxRQUFRLDBDQUFFLGlCQUFpQixDQUFDLENBQUM7UUFHdEcsTUFBTSxJQUFJLEdBQWMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFL0MsSUFBRyxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUE7WUFDcEMsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBR3JDLElBQUksVUFBVSxHQUFHO1lBQ2IsTUFBTSxFQUFFLFFBQVE7WUFDaEIsVUFBVSxFQUFFLFVBQVU7WUFDdEIsTUFBTSxFQUFFLFFBQVE7WUFDaEIsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRTtZQUMzQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixZQUFZLEVBQUUsQ0FBQztZQUNmLFVBQVUsRUFBRSxDQUFDO1lBQ2IsS0FBSyxFQUFFLEtBQUs7U0FDZixDQUFDO1FBRUYsSUFBSTtZQUNBLElBQUksT0FBTyxHQUFXLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4RCxJQUFJLFFBQVEsR0FBb0IsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdELE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDOUM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7U0FDM0M7O0NBQ0o7QUFoREQsb0JBZ0RDIn0=