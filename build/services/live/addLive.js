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
const PlaceRepository_1 = require("../../repositories/PlaceRepository");
const SecurityManager_1 = require("../../libs/SecurityManager");
const UserRepository_1 = require("../../repositories/UserRepository");
const LiveRepository_1 = require("../../repositories/LiveRepository");
const AWS = require('aws-sdk');
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new LiveRepository_1.LiveRepository();
        let userRepo = new UserRepository_1.UserRepository();
        let placeRepo = new PlaceRepository_1.PlaceRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepo, event);
        const placeId = event.pathParameters.placeId;
        const requestLive = JSON.parse(event.body);
        if (!(yield securityManager.isUserLogged()) || !(yield securityManager.isUserCam()) || !(yield securityManager.isUserCamPlaceOwner()))
            return responseManager.send(401);
        const user = yield securityManager.getUserLogged();
        try {
            const ivs = new AWS.IVS({
                apiVersion: '2020-07-14',
                region: 'us-west-2'
            });
            const params = {
                channelArn: user.channel
            };
            const result = yield ivs.getStream(params).promise();
            let addLive = {
                createdAt: requestLive.createdAt,
                liveUrl: result.stream,
                place: placeId
            };
            let live = yield repo.addLive(addLive);
            const response = {
                createdAt: live.createdAt,
                liveUrl: live.liveUrl,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkTGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9saXZlL2FkZExpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxnRUFBeUQ7QUFDekQsd0VBQW1FO0FBRW5FLGdFQUEyRDtBQUMzRCxzRUFBaUU7QUFDakUsc0VBQWlFO0FBRWpFLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUUvQixTQUFzQixJQUFJLENBQUMsS0FBSzs7UUFDNUIsSUFBSSxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDaEMsSUFBSSxRQUFRLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDcEMsSUFBSSxTQUFTLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7UUFDdEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQztRQUc3QyxNQUFNLFdBQVcsR0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVoRCxJQUFHLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQSxJQUFJLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQSxJQUFJLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO1lBQzFILE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUdyQyxNQUFNLElBQUksR0FBRyxNQUFNLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUduRCxJQUFJO1lBRUEsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUNwQixVQUFVLEVBQUUsWUFBWTtnQkFDeEIsTUFBTSxFQUFFLFdBQVc7YUFDdEIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxNQUFNLEdBQUc7Z0JBQ1gsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPO2FBQzNCLENBQUM7WUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFJckQsSUFBSSxPQUFPLEdBQUc7Z0JBQ1YsU0FBUyxFQUFFLFdBQVcsQ0FBQyxTQUFTO2dCQUNoQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU07Z0JBQ3RCLEtBQUssRUFBRSxPQUFPO2FBQ2pCLENBQUM7WUFDRixJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFdkMsTUFBTSxRQUFRLEdBQVE7Z0JBQ2xCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDekIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2dCQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUN0QixDQUFDO1lBRUYsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM5QztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7U0FDM0M7SUFDTCxDQUFDO0NBQUE7QUFoREQsb0JBZ0RDO0FBRUQsU0FBc0IsVUFBVSxDQUFDLE1BQWM7O1FBQzNDLElBQUksSUFBSSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ2hDLElBQUk7WUFDQSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUVMLENBQUM7Q0FBQTtBQVRELGdDQVNDIn0=