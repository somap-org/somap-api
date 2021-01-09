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
                    $geometry: { type: "Point",  coordinates: [longitude, latitude] },
                    $maxDistance: range
                }
            }
        });
        return places;
    }

    async searchByQuery(query, page, limit) {
        const startIndex = page * limit;
        const endIndex = limit;
        let regex = new RegExp(query, 'i');
        return await PlaceModel.find({name: regex}).skip(startIndex).limit(endIndex);
    }
}
