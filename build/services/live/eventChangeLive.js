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
            if (event.detail.event_name === "Stream Start") {
                let addLive = {
                    createdAt: moment(),
                    liveUrl: user.liveUrl,
                    liveId: event.detail.stream_id,
                    place: place['_id']
                };
                const live = yield repo.addLive(addLive);
                yield placeRepo.editPlace(place['_id'], { currentLiveUrl: user.liveUrl });
                console.log("Live added successful", live);
            }
            else if (event.detail.event_name === "Stream End") {
                let editLive = {
                    endedAt: moment().format()
                };
                const live = yield repo.editLiveByLiveId(event.detail.stream_id, editLive);
                yield placeRepo.editPlace(place['_id'], { currentLiveUrl: null });
                console.log("Live ended successful", live);
            }
            return true;
        }
        catch (err) {
            console.log("ERRORE", err);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRDaGFuZ2VMaXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2xpdmUvZXZlbnRDaGFuZ2VMaXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsZ0VBQXlEO0FBQ3pELHdFQUFtRTtBQUduRSxzRUFBaUU7QUFDakUsc0VBQWlFO0FBRWpFLGlDQUFrQztBQUNsQyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFL0IsU0FBc0IsSUFBSSxDQUFDLEtBQUs7O1FBQzVCLElBQUksZUFBZSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ2hDLElBQUksUUFBUSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ3BDLElBQUksU0FBUyxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBRXRDLElBQUk7WUFFQSxNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEUsTUFBTSxLQUFLLEdBQUcsTUFBTSxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXBELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssY0FBYyxFQUFFO2dCQUU1QyxJQUFJLE9BQU8sR0FBRztvQkFDVixTQUFTLEVBQUUsTUFBTSxFQUFFO29CQUNuQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87b0JBQ3JCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVM7b0JBQzlCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDO2lCQUN0QixDQUFDO2dCQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFHekMsTUFBTSxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQztnQkFFeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUM5QztpQkFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLFlBQVksRUFBRTtnQkFFakQsSUFBSSxRQUFRLEdBQUc7b0JBQ1gsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRTtpQkFDN0IsQ0FBQztnQkFDRixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFHM0UsTUFBTSxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO2dCQUVoRSxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzlDO1lBRUQsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDM0IsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7U0FDM0M7SUFDTCxDQUFDO0NBQUE7QUEzQ0Qsb0JBMkNDO0FBRUQsU0FBc0IsVUFBVSxDQUFDLE1BQWM7O1FBQzNDLElBQUksSUFBSSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ2hDLElBQUk7WUFDQSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUVMLENBQUM7Q0FBQTtBQVRELGdDQVNDIn0=