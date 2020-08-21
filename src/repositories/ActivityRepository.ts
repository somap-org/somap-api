import {connect} from "../libs/mongodb";
import {ActivityModel} from "../models/Activity";


export class ActivityRepository {
    constructor() {
        connect();
    }

    async addActivity(activity){
        return await ActivityModel.create(activity);
    }

    async getActivies(activityId, page, limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        return await ActivityModel.find({place: activityId}).skip(startIndex).limit(endIndex);
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
