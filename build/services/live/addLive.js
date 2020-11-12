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
exports.deleteLive = exports.main = void 0;
const ResponseManager_1 = require("../../libs/ResponseManager");
const SecurityManager_1 = require("../../libs/SecurityManager");
const UserRepository_1 = require("../../repositories/UserRepository");
const LiveRepository_1 = require("../../repositories/LiveRepository");
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new LiveRepository_1.LiveRepository();
        let userRepo = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepo, event);
        const placeId = event.pathParameters.placeId;
        const requestLive = JSON.parse(event.body);
        if (!(yield securityManager.isUserLogged()) || !(yield securityManager.isUserCam()) || !(yield securityManager.isUserCamPlaceOwner()))
            return responseManager.send(401);
        let addLive = {
            createdAt: requestLive.createdAt,
            place: placeId
        };
        try {
            let live = yield repo.addLive(addLive);
            const response = {
                createdAt: live.createdAt,
                liveId: live['_id']
            };
            return responseManager.send(200, response);
        }
        catch (err) {
            return responseManager.send(501, { err });
        }
    });
}
exports.main = main;
function deleteLive(liveId) {
    return __awaiter(this, void 0, void 0, function* () {
        let repo = new LiveRepository_1.LiveRepository();
        try {
            yield repo.deleteLive(liveId);
            return true;
        }
        catch (e) {
            return null;
        }
    });
}
exports.deleteLive = deleteLive;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkTGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9saXZlL2FkZExpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxnRUFBeUQ7QUFHekQsZ0VBQTJEO0FBQzNELHNFQUFpRTtBQUNqRSxzRUFBaUU7QUFNakUsU0FBc0IsSUFBSSxDQUFDLEtBQUs7O1FBQzVCLElBQUksZUFBZSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ2hDLElBQUksUUFBUSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ3BDLElBQUksZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0QsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7UUFHN0MsTUFBTSxXQUFXLEdBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFHaEQsSUFBRyxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUEsSUFBSSxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUEsSUFBSSxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtZQUMxSCxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFHckMsSUFBSSxPQUFPLEdBQUc7WUFDVixTQUFTLEVBQUUsV0FBVyxDQUFDLFNBQVM7WUFDaEMsS0FBSyxFQUFFLE9BQU87U0FDakIsQ0FBQztRQUVGLElBQUk7WUFDQSxJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFdkMsTUFBTSxRQUFRLEdBQVE7Z0JBQ2xCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDekIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDdEIsQ0FBQztZQUVGLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDOUM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO1NBQzNDO0lBQ0wsQ0FBQztDQUFBO0FBaENELG9CQWdDQztBQUVELFNBQXNCLFVBQVUsQ0FBQyxNQUFjOztRQUMzQyxJQUFJLElBQUksR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUNoQyxJQUFJO1lBQ0EsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFFTCxDQUFDO0NBQUE7QUFURCxnQ0FTQyJ9