import {connect} from "../libs/mongodb";
import {Place, PlaceModel} from "../models/Place";


export class PlaceRepository {
    constructor() {
        connect();
    }

    async getPlace(placeId: string): Promise<Place> {
        return PlaceModel.findOne({_id: placeId}).populate("camUser");
    }

    async getCamUserPlace(loggedUser): Promise<Place> {
        //let loggedUser = await UserModel.findOne({_id: userId, userType: UserTypes.CamUser});
        return PlaceModel.findOne({camUser: loggedUser}).populate("camUser");
    }

    async addPlace(place){
        return await PlaceModel.create(place);
    }

    async editPlace(placeId, place){
        return await PlaceModel.findOneAndUpdate({_id: placeId}, place, {new: true}).populate("camUser");
    }

    async deletePlace(placeId: string) {
        return PlaceModel.deleteOne({_id: placeId}).populate("camUser");
    }

    async getPlaces(latitude: number, longitude: number, range: number) {
        let places = await PlaceModel.find({
            location: {
                $near: {
                    $geometry: { type: "Point",  coordinates: [longitude, latitude] },
                    $maxDistance: range
                }
            }
        }).populate("camUser");
        return places;
    }

    async searchByQuery(query, page, limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = limit;
        let regex = new RegExp(query, 'i');

        if (query === "ALLENTITIES")
            return PlaceModel.find().skip(startIndex).limit(endIndex);

        return await PlaceModel.find({
            $or: [
                {
                    name: regex
                },
                {
                    description: regex
                },
                {
                    address: regex
                }
            ]
        }).skip(startIndex).limit(endIndex).populate("camUser");
    }
}
