import {connect} from "../libs/mongodb";
import {ActivityModel} from "../models/Activity";


export class ActivityRepository {
    constructor() {
        connect();
    }

    async addActivity(activity){
        return await ActivityModel.create(activity);
    }

    async getActivies(placeId, type, page, limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = limit;
        switch (type) {
            case 'onging': {
                return await ActivityModel.find({place: placeId}).skip(startIndex).limit(endIndex);
                break;
            }
            case 'scheduled': {
                return await ActivityModel.find({place: placeId}).skip(startIndex).limit(endIndex);
                break;
            }
            case 'past': {
                return await ActivityModel.find({place: placeId}).skip(startIndex).limit(endIndex);
                break;
            }
            default: {
                return await ActivityModel.find({place: placeId}).skip(startIndex).limit(endIndex);
                break;
            }
        }
    }

    async searchByQuery(query, page, limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = limit;
        let regex = new RegExp(query, 'i');
        if (query === "ALLENTITIES")
            return ActivityModel.find();

        return ActivityModel.find({
            $or: [
                {
                    name: regex
                },
                {
                    description: regex
                }
            ]
        }).skip(startIndex).limit(endIndex);
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
