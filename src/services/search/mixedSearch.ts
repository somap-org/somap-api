/* eslint-disable */
import ResponseManager from "../../libs/ResponseManager";
import {SecurityManager} from "../../libs/SecurityManager";
import {UserRepository} from "../../repositories/UserRepository";
import {PlaceRepository} from "../../repositories/PlaceRepository";
import {Lives} from "../../interfaces/models/lives";
import {Live} from "../../interfaces/models/live";
import {LiveRepository} from "../../repositories/LiveRepository";
import {ActivityRepository} from "../../repositories/ActivityRepository";
import {Activities} from "../../interfaces/models/activities";
import {Places} from "../../interfaces/models/places";
import {Place} from "../../interfaces/models/place";
import {PlaceCoordinates} from "../../interfaces/models/placeCoordinates";
import {UsersPublicProfile} from "../../interfaces/models/usersPublicProfile";

/*
    Questa funzione deve restituire tutte le entita' di tipo Activities, Places e Users che contengono una stringa di ricevuta dal client.
 */
export async function main(event) {
  let responseManager = new ResponseManager();
  let activityRepository = new ActivityRepository();
  let placeRepository = new PlaceRepository();
  let userRepository = new UserRepository();
  let securityManager = new SecurityManager(userRepository, event);

  const query = event.queryStringParameters.query;

  const page = parseInt(event.queryStringParameters?.page) || 1;
  const limit = parseInt(event.queryStringParameters?.limit) || 10;

  if (!await securityManager.isUserLogged())
    return responseManager.send(401);

  try {
    let responseActivities: Activities = [];
    let responsePlaces:Places = [];
    let responseUsers:UsersPublicProfile = [];
    console.log('test');
    await Promise.all([
      new Promise(async (resolve, reject) => { //Cerco Activities
        let activities = await activityRepository.searchByQuery(query, page, limit);
        activities.map((activity) => {
          responseActivities.push({
            activityId: activity['_id'].toString(),
            name: activity.name,
            description: activity.description,
            date: activity.date,
            thumbnail: activity.thumbnail
          })
        });
        resolve();
      }),
      new Promise(async (resolve, reject) => { //Cerco Places
        let places = await placeRepository.searchByQuery(query, page, limit);
        for (const place of places) {
          let coordinates:PlaceCoordinates = {
            latitude: place.location.coordinates[1],
            longitude: place.location.coordinates[0]
          };
          responsePlaces.push({
            placeId: place['_id'].toString(),
            name: place.name,
            description: place.description,
            address: place.address,
            coordinates: coordinates,
          });
        }
        resolve();
      }),
      new Promise(async (resolve, reject) => { //Cerco Users
        let users = await userRepository.searchByQuery(query, page, limit);
        for (const user of users) {
          responseUsers.push({
            userId: user['_id'].toString(),
            userType: user.userType,
            username: user.publicProfile.username,
            profileImage: user.publicProfile.profileImage,
            followers: user.publicProfile.followers,
            following: user.publicProfile.following
          });
        }
        resolve();
      })
    ]);

    let response = {
      activities: responseActivities,
      places: responsePlaces,
      users: responseUsers,
    };

    return responseManager.send(200, response);

  } catch (err) {
    console.log(err);
    return responseManager.send(501, {err});
  }
}
