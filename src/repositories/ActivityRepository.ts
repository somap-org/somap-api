import {connect} from "../libs/mongodb";
import {ActivityModel} from "../models/Activity";


export class ActivityRepository {
  constructor() {
    connect();
  }

  async addActivity(activity) {
    return await ActivityModel.create(activity);
  }

  async getActivies(placeId, type, page, limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = limit;

    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);

    var end = new Date();
    end.setUTCHours(23, 59, 59, 999);
    console.log({
      place: placeId,
      date: {
        $gte: start,
        $lte: end
      }
    });
    switch (type) {
      case 'onging': {
        return ActivityModel.find({
          place: placeId,
          $and: [
            {
              date: {
                $gte: start,
              }
            },
            {
              date: {
                $lte: end,
              }
            }]
        }).sort({date: 'desc'}).skip(startIndex).limit(endIndex);
        break;
      }
      case 'scheduled': {
        return ActivityModel.find({place: placeId, date: {$gte: new Date()}}).sort({date: 'desc'}).skip(startIndex).limit(endIndex);
        break;
      }
      case 'past': {
        return ActivityModel.find({place: placeId, date: {$lte: new Date()}}).sort({date: 'desc'}).skip(startIndex).limit(endIndex);
        break;
      }
      default: {
        return await ActivityModel.find({place: placeId}).sort({date: 'desc'}).skip(startIndex).limit(endIndex);
        break;
      }
    }
  }

  async searchByQuery(query, page, limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = limit;
    let regex = new RegExp(query, 'i');
    if (query === "ALLENTITIES")
      return ActivityModel.find().skip(startIndex).limit(endIndex);

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

  async deleteActivityByPlaceId(placeId) {
    return ActivityModel.deleteMany({place: placeId});
  }

}
