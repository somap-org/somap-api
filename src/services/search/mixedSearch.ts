/* eslint-disable */
import ResponseManager from "../../libs/ResponseManager";
import {SecurityManager} from "../../libs/SecurityManager";
import {UserRepository} from "../../repositories/UserRepository";
import {PlaceRepository} from "../../repositories/PlaceRepository";
import {ActivityRepository} from "../../repositories/ActivityRepository";
import {Activities} from "../../interfaces/models/activities";
import {Places} from "../../interfaces/models/places";
import {PlaceCoordinates} from "../../interfaces/models/placeCoordinates";
import {UsersPublicProfile} from "../../interfaces/models/usersPublicProfile";

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION || 'us-east-1'});
const signedUrlExpiresSeconds = 60 * 10;
const s3 = new AWS.S3({apiVersion: "2006-03-01"});

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
    let responsePlaces: Places = [];
    let responseUsers: UsersPublicProfile = [];
    console.log('test');
    await Promise.all([
      new Promise(async (resolve, reject) => { //Cerco Activities
        let activities = await activityRepository.searchByQuery(query, page, limit);
        for (const activity of activities) {
          try {
            let presignedUrl = null;
            if (activity.thumbnail) {
              const params = {
                Bucket: process.env.PHOTOS_BUCKET_S3,
                Key: activity.thumbnail,
                Expires: signedUrlExpiresSeconds
              };
              presignedUrl = await s3.getSignedUrl('getObject', params);
            }
            responseActivities.push({
              activityId: activity['_id'].toString(),
              name: activity.name,
              description: activity.description,
              date: activity.date,
              thumbnail: presignedUrl
            });
          } catch (e) {
            console.error(e);
          }
        }

        resolve();
      }),
      new Promise(async (resolve, reject) => { //Cerco Places
        let places = await placeRepository.searchByQuery(query, page, limit);
        console.log('PLACES', places);
        for (const place of places) {
          try {
            console.log('PLACE', place);
            let coordinates: PlaceCoordinates = {
              latitude: place.location.coordinates[1],
              longitude: place.location.coordinates[0]
            };
            let presignedUrl = null;
            if (place.camUser['publicProfile']['profileImage']) {
              const params = {
                Bucket: process.env.PHOTOS_BUCKET_S3,
                Key: place.camUser['publicProfile']['profileImage'],
                Expires: signedUrlExpiresSeconds
              };
              presignedUrl = await s3.getSignedUrl('getObject', params);
            }

            responsePlaces.push({
              placeId: place['_id'].toString(),
              name: place.name,
              currentLiveUrl: place.currentLiveUrl,
              description: place.description,
              address: place.address,
              coordinates: coordinates,
              userCam: {
                userId: place.camUser['_id'],
                userType: place.camUser['userType'],
                username: place.camUser['username'],
                profileImage: presignedUrl
              }
            });
          } catch (e) {
            console.error(e);
          }
        }

        resolve();
      }),
      new Promise(async (resolve, reject) => { //Cerco Users
        let users = await userRepository.searchByQuery(query, page, limit);
        for (const user of users) {
          try {
            let presignedUrl = null;
            if (user.publicProfile.profileImage) {
              const params = {
                Bucket: process.env.PHOTOS_BUCKET_S3,
                Key: user.publicProfile.profileImage,
                Expires: signedUrlExpiresSeconds
              };
              presignedUrl = await s3.getSignedUrl('getObject', params);
            }
            responseUsers.push({
              userId: user['_id'].toString(),
              userType: user.userType,
              username: user.publicProfile.username,
              profileImage: presignedUrl
            });
          } catch (e) {
            console.error(e);
          }
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
