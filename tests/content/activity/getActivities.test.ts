import {main as signUp} from '../../../src/services/userGraph/user/signUp';
import {expect} from 'chai';
import {deleteUser} from "../../../src/services/userGraph/user/signUp";
import {Place} from "../../../src/interfaces/models/place";
import {deletePlace} from "../../../src/services/userGraph/place/addPlace";
import {deleteActivity, main as addActivity} from "../../../src/services/content/activity/addActivity"
import {main as addPlace} from "../../../src/services/userGraph/place/addPlace";
import {main as getActivities} from "../../../src/services/content/activity/getActivities";
import {Activities} from "../../../src/interfaces/models/activities";

let response;
let event, expectedResponse;
let loggedUser, otherUser, place, activities = [];
describe('Get activities', async () => {

    before('Signing up test logged users and their location', async () => {
        event = {
            "userName": "mariorossi",
            "request": {
                "userAttributes": {
                    "email": "mariorossi@gmail.com",
                    "email_verified": true,
                    "name": "Mario Rossi",
                    "sub": "asdasd-1232132-asdasd",
                    "custom:userType": "CamUser"
                }
            }
        };
        loggedUser = await signUp(event);
        expect(loggedUser).to.not.be.null;
    });
    before('Signing up test other users', async () => {
        event = {
            "userName": "fabiobianchi",
            "request": {
                "userAttributes": {
                    "email": "fabiobianchi@gmail.com",
                    "email_verified": true,
                    "name": "Fabio Bianchi",
                    "sub": "abcdevfefe-1232132-cofeve",
                    "custom:userType": "ClassicUser"
                }
            }
        };
        otherUser = await signUp(event);
        expect(otherUser).to.not.be.null;
    });

    before('Add test place to logged user', async () => {
        let placeBody:Place = {
            name: "ORION",
            description: "Locale con capacità di 1.200 persone che propone diverse serate con band dal vivo, discoteca e feste.",
            address: "Viale J. F. Kennedy, 52, 00043 Ciampino RM",
            coordinates: {
                latitude: 41.8099168,
                longitude: 12.5969897
            }
        };
        event = {
            "pathParameters": {
                "userId": loggedUser['_id']
            },
            "body": {
                ...placeBody
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": loggedUser.cognitoId
                }
            }
        };
        response = await addPlace(event);
        response.body = JSON.parse(response.body);

        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                ...placeBody,
                placeId: response.body.placeId
            },
        };
        expect(response).to.deep.equal(expectedResponse);
        place = response.body;
    });
    before('Add test activities to logged user', async () => {
        let activitiesBody:Activities = [
            {
                name: "Red Party",
                description: "Red clothes party",
                date: "19/06/2020",
                thumbnail: "https://www.photo.it"
            },
            {
                name: "Green Party",
                description: "Green clothes party",
                date: "19/06/2020",
                thumbnail: "https://www.photo.it"
            },
            {
                name: "Yellow Party",
                description: "Yellow clothes party",
                date: "19/06/2020",
                thumbnail: "https://www.photo.it"
            }
        ];
        for (const activityBody of activitiesBody) {
            event = {
                "pathParameters": {
                    "placeId": place.placeId
                },
                "body": {
                    ...activityBody
                },
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": loggedUser.cognitoId
                    }
                }
            };
            response = await addActivity(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    ...activityBody,
                    activityId: response.body.activityId
                },
            };
            expect(response).to.deep.equal(expectedResponse);
            activities.push(response.body);
        };
    });

    after('Delete test logged users', async () => {
        let delResponse = await deleteUser(loggedUser['_id']);
        expect(delResponse).to.be.true;
    });
    after('Delete test other users', async () => {
        let delResponse = await deleteUser(otherUser['_id']);
        expect(delResponse).to.be.true;
    });

    after('Delete test place', async () => {
        let delResponse = await deletePlace(place.placeId);
        expect(delResponse).to.be.true;
    });

    after('Delete activities', async () => {
        activities.forEach(async activity => {
            let delResponse = await deleteActivity(activity.activityId);
            expect(delResponse).to.be.true;
        });
    });

    it('User requested is same logged', async () => {
        event = {
            "pathParameters": {
                "placeId": place.placeId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": loggedUser.cognitoId
                }
            }
        };
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: activities
        };
        let response = await getActivities(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
    it('User requested is not same logged', async () => {
        event = {
            "pathParameters": {
                "placeId": place.placeId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": otherUser.cognitoId
                }
            }
        };
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: activities
        };
        let response = await getActivities(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
    it('User not logged', async () => {
        event = {
            "pathParameters": {
                "placeId": place.placeId
            }
        };
        expectedResponse = {
            "statusCode": 401,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*"
            },
            "body": {}
        };
        let response = await getActivities(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });


});

