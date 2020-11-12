import {main as signUp} from '../../../src/services/userGraph/user/signUp';
import {expect} from 'chai';
import {deleteUser} from "../../../src/services/userGraph/user/signUp";
import {Place} from "../../../src/interfaces/models/place";
import {deletePlace} from "../../../src/services/userGraph/place/addPlace";
import {deleteActivity, main as addActivity} from "../../../src/services/content/activity/addActivity"
import {main as addPlace} from "../../../src/services/userGraph/place/addPlace";
import {main as getActivity} from "../../../src/services/content/activity/getActivity";
import {Activities} from "../../../src/interfaces/models/activities";

let response;
let event, expectedResponse;
let loggedUser, otherUser, placeLogged, placeOther, activitiesLogged = [], activitiesOther = [];
describe('Get activity', async () => {

    before('Signing up test logged users', async () => {
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
                    "custom:userType": "CamUser"
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
        event.body = JSON.stringify(event.body);
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
        placeLogged = response.body;
    });
    before('Add test place to other user', async () => {
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
                "userId": otherUser['_id']
            },
            "body": {
                ...placeBody
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": otherUser.cognitoId
                }
            }
        };
        event.body = JSON.stringify(event.body);
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
        placeOther = response.body;
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
                    "userId": loggedUser['_id'],
                    "placeId": placeLogged.placeId
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
            event.body = JSON.stringify(event.body);
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
            activitiesOther.push(response.body);
        };
    });
    before('Add test lives to other user', async () => {
        let activitiesBody:Activities = [
            {
                name: "White Party",
                description: "White clothes party",
                date: "19/06/2020",
                thumbnail: "https://www.photo.it"
            },
            {
                name: "Black Party",
                description: "Black clothes party",
                date: "19/06/2020",
                thumbnail: "https://www.photo.it"
            },
            {
                name: "Grey Party",
                description: "Grey clothes party",
                date: "19/06/2020",
                thumbnail: "https://www.photo.it"
            }
        ];
        for (const activityBody of activitiesBody) {
            event = {
                "pathParameters": {
                    "userId": otherUser['_id'],
                    "placeId": placeOther.placeId
                },
                "body": {
                    ...activityBody
                },
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": otherUser.cognitoId
                    }
                }
            };
            event.body = JSON.stringify(event.body);
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
            activitiesOther.push(response.body);
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

    after('Delete test place logged', async () => {
        let delResponse = await deletePlace(placeLogged.placeId);
        expect(delResponse).to.be.true;
    });
    after('Delete test place other', async () => {
        let delResponse = await deletePlace(placeOther.placeId);
        expect(delResponse).to.be.true;
    });
    after('Delete activities logged', async () => {
        activitiesLogged.forEach(async activity => {
            let delResponse = await deleteActivity(activity.activityId);
            expect(delResponse).to.be.true;
        });
    });
    after('Delete activities other', async () => {
        activitiesOther.forEach(async activity => {
            let delResponse = await deleteActivity(activity.activityId);
            expect(delResponse).to.be.true;
        });
    });

    it('User requested is same logged', async () => {
        for (const activity of activitiesLogged) {
            event = {
                "pathParameters": {
                    "activityId": activity.activityId
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
                body: {
                    ...activity
                }
            };
            let response = await getActivity(event);
            response.body = JSON.parse(response.body);
            expect(response).to.deep.equal(expectedResponse);
        }
    });
    it('User requested is same other', async () => {
        for (const activity of activitiesOther) {
            event = {
                "pathParameters": {
                    "activityId": activity.activityId
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
                body: {
                    ...activity
                }
            };
            let response = await getActivity(event);
            response.body = JSON.parse(response.body);
            expect(response).to.deep.equal(expectedResponse);
        }
    });
    it('User requested is not same logged', async () => {
        for (const activity of activitiesLogged) {
            event = {
                "pathParameters": {
                    "activityId": activity.activityId
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
                body: {
                    ...activity
                }
            };
            let response = await getActivity(event);
            response.body = JSON.parse(response.body);
            expect(response).to.deep.equal(expectedResponse);
        }
    });
    it('User not logged', async () => {
        for (const activity of activitiesLogged) {
            event = {
                "pathParameters": {
                    "activityId": activity.activityId
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
            let response = await getActivity(event);
            response.body = JSON.parse(response.body);
            expect(response).to.deep.equal(expectedResponse);
        }
    });


});

