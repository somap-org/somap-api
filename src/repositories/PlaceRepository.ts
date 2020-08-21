import {connect} from "../libs/mongodb";
import {Place, PlaceModel} from "../models/Place";


export class PlaceRepository {
    constructor() {
        connect();
    }

    async getPlace(placeId: string): Promise<Place> {
        return PlaceModel.findOne({_id: placeId});
    }

    async addPlace(place){
        return await PlaceModel.create(place);
    }

    async editPlace(placeId, place){
        return await PlaceModel.findOneAndUpdate({_id: placeId}, place, {new: true});
    }

    async deletePlace(placeId: string) {
        return PlaceModel.deleteOne({_id: placeId});
    }

    async getPlaces(latitude: number, longitude: number, range: number) {
        let places = await PlaceModel.find({
            location: {
                $near: {
                    $geometry: { type: "Point",  coordinates: [latitude, longitude] },
                    $maxDistance: range
                }
            }
        });
        return places;
    }
}
