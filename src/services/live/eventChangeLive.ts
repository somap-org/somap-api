/* eslint-disable */
import ResponseManager from "../../libs/ResponseManager";
import {PlaceRepository} from "../../repositories/PlaceRepository";
import {Place} from "../../interfaces/models/place";
import {SecurityManager} from "../../libs/SecurityManager";
import {UserRepository} from "../../repositories/UserRepository";
import {LiveRepository} from "../../repositories/LiveRepository";
import {Live} from "../../interfaces/models/live";
import moment = require("moment");
const AWS = require('aws-sdk');

export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new LiveRepository();
    let userRepo = new UserRepository();
    let placeRepo = new PlaceRepository();

    try {
        // Seleziona utente dal channelArn della live iniziata
        const user = await userRepo.getUserByChannelArn(event.resources[0]);
        const place = await placeRepo.getCamUserPlace(user);

        if (event.detail.event_name === "Stream Start") {
            //Costruisce documento da aggiungere nel db
            let addLive = {
                createdAt: moment(),
                liveUrl: user.liveUrl,
                liveId: event.detail.stream_id,
                place: place['_id']
            };
            const live = await repo.addLive(addLive);
            console.log("Live added successful", live);
        } else if (event.detail.event_name === "Stream End") {
            //Costruisce documento da aggiungere nel db
            let editLive = {
                endedAt: moment().format()
            };
            const live = await repo.editLiveByLiveId(event.detail.stream_id, editLive);
            console.log("Live ended successful", live);
        }

        return true;
    } catch (err) {
        console.log("ERRORE", err);
        return responseManager.send(501, {err});
    }
}

export async function deleteLive(liveId: string){
    let repo = new LiveRepository();
    try {
        await repo.deleteLive(liveId);
        return true;
    } catch (e) {
        return null;
    }

}
