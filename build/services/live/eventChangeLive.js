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
const UserRepository_1 = require("../../repositories/UserRepository");
const LiveRepository_1 = require("../../repositories/LiveRepository");
const moment = require("moment");
const AWS = require('aws-sdk');
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new LiveRepository_1.LiveRepository();
        let userRepo = new UserRepository_1.UserRepository();
        let placeRepo = new PlaceRepository_1.PlaceRepository();
        try {
            const user = yield userRepo.getUserByChannelArn(event.resources[0]);
            const place = yield placeRepo.getCamUserPlace(user);
            let live = null;
            if (event.detail.event_name === "Stream Start") {
                let addLive = {
                    createdAt: moment(),
                    liveUrl: user.liveUrl,
                    _id: event.detail.stream_id,
                    place: place['_id']
                };
                live = yield repo.addLive(addLive);
            }
            else if (event.detail.event_name === "Stream End") {
                let editLive = {
                    endedAt: moment()
                };
                live = yield repo.editLive(event.detail.stream_id, editLive);
            }
            const response = {
                createdAt: live.createdAt,
                endedAt: live.endedAt,
                liveUrl: user.liveUrl,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRDaGFuZ2VMaXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2xpdmUvZXZlbnRDaGFuZ2VMaXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsZ0VBQXlEO0FBQ3pELHdFQUFtRTtBQUduRSxzRUFBaUU7QUFDakUsc0VBQWlFO0FBRWpFLGlDQUFrQztBQUNsQyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFL0IsU0FBc0IsSUFBSSxDQUFDLEtBQUs7O1FBQzVCLElBQUksZUFBZSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ2hDLElBQUksUUFBUSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ3BDLElBQUksU0FBUyxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBRXRDLElBQUk7WUFFQSxNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEUsTUFBTSxLQUFLLEdBQUcsTUFBTSxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXBELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztZQUNoQixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLGNBQWMsRUFBRTtnQkFFNUMsSUFBSSxPQUFPLEdBQUc7b0JBQ1YsU0FBUyxFQUFFLE1BQU0sRUFBRTtvQkFDbkIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO29CQUNyQixHQUFHLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTO29CQUMzQixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQztpQkFDdEIsQ0FBQztnQkFDRixJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3RDO2lCQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssWUFBWSxFQUFFO2dCQUVqRCxJQUFJLFFBQVEsR0FBRztvQkFDWCxPQUFPLEVBQUUsTUFBTSxFQUFFO2lCQUNwQixDQUFDO2dCQUNGLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDaEU7WUFFRCxNQUFNLFFBQVEsR0FBUTtnQkFDbEIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUN6QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ3JCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDdEIsQ0FBQztZQUVGLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDOUM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO1NBQzNDO0lBQ0wsQ0FBQztDQUFBO0FBeENELG9CQXdDQztBQUVELFNBQXNCLFVBQVUsQ0FBQyxNQUFjOztRQUMzQyxJQUFJLElBQUksR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUNoQyxJQUFJO1lBQ0EsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFFTCxDQUFDO0NBQUE7QUFURCxnQ0FTQyJ9