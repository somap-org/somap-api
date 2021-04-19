import {connect} from "../libs/mongodb";
import {LiveModel} from "../models/Live";


export class LiveRepository {
    constructor() {
        connect();
    }

    async addLive(live){
        return await LiveModel.create(live);
    }

    async editLive(liveId, live){
        return await LiveModel.findOneAndUpdate({_id: liveId}, live, {new: true});
    }
    async editLiveByLiveId(liveId, live){
        return await LiveModel.findOneAndUpdate({liveId: liveId}, live, {new: true});
    }

    async getLives(placeId) {
        return await LiveModel.find({place: placeId});
    }

    async getLive(liveId) {
        return await LiveModel.findOne({_id: liveId});
    }

    async deleteLive(liveId: string) {
        return LiveModel.deleteOne({_id: liveId});
    }


}
