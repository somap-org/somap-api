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
                    _id: event.detail.stream_id,
                    place: place['_id']
                };
                const live = yield repo.addLive(addLive);
                console.log("Live added successful", live);
            }
            else if (event.detail.event_name === "Stream End") {
                let editLive = {
                    endedAt: moment()
                };
                const live = yield repo.editLive(event.detail.stream_id, editLive);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRDaGFuZ2VMaXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2xpdmUvZXZlbnRDaGFuZ2VMaXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsZ0VBQXlEO0FBQ3pELHdFQUFtRTtBQUduRSxzRUFBaUU7QUFDakUsc0VBQWlFO0FBRWpFLGlDQUFrQztBQUNsQyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFL0IsU0FBc0IsSUFBSSxDQUFDLEtBQUs7O1FBQzVCLElBQUksZUFBZSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ2hDLElBQUksUUFBUSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ3BDLElBQUksU0FBUyxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBRXRDLElBQUk7WUFFQSxNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEUsTUFBTSxLQUFLLEdBQUcsTUFBTSxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXBELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssY0FBYyxFQUFFO2dCQUU1QyxJQUFJLE9BQU8sR0FBRztvQkFDVixTQUFTLEVBQUUsTUFBTSxFQUFFO29CQUNuQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87b0JBQ3JCLEdBQUcsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVM7b0JBQzNCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDO2lCQUN0QixDQUFDO2dCQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUM5QztpQkFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLFlBQVksRUFBRTtnQkFFakQsSUFBSSxRQUFRLEdBQUc7b0JBQ1gsT0FBTyxFQUFFLE1BQU0sRUFBRTtpQkFDcEIsQ0FBQztnQkFDRixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ25FLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDOUM7WUFFRCxPQUFPLElBQUksQ0FBQztTQUNmO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMzQixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQztTQUMzQztJQUNMLENBQUM7Q0FBQTtBQW5DRCxvQkFtQ0M7QUFFRCxTQUFzQixVQUFVLENBQUMsTUFBYzs7UUFDM0MsSUFBSSxJQUFJLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDaEMsSUFBSTtZQUNBLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixPQUFPLElBQUksQ0FBQztTQUNmO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixPQUFPLElBQUksQ0FBQztTQUNmO0lBRUwsQ0FBQztDQUFBO0FBVEQsZ0NBU0MifQ==