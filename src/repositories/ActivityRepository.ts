import {connect} from "../libs/mongodb";
import {ActivityModel} from "../models/Activity";


export class ActivityRepository {
    constructor() {
        connect();
    }

    async addActivity(activity){
        return await ActivityModel.create(activity);
    }

    async getActivies(placeId, page, limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = limit;
        return await ActivityModel.find({place: placeId});
    }

    async searchByQuery(query, page, limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = limit;
        let regex = new RegExp(query, 'i');
        return await ActivityModel.find({name: regex}).skip(startIndex).limit(endIndex);
    }

    async getActivity(activityId) {
        return await ActivityModel.findOne({_id: activityId});
    }

    async editActivity(activityId, activity) {
        return await ActivityModel.findOneAndUpdate({_id: activityId}, activity, {new: true});
    }

    async deleteActivity(activityId) {
        return ActivityModel.findOneAndDelete({_id: activityId});
    }


}
