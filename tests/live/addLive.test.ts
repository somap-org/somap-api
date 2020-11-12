import {main as signUp} from '../../src/services/userGraph/user/signUp';
import {expect} from 'chai';
import {deleteUser} from "../../src/services/userGraph/user/signUp";
import {Place} from "../../src/interfaces/models/place";
import {deletePlace} from "../../src/services/userGraph/place/addPlace";
import {deleteLive, main as addLive} from "../../src/services/live/addLive"
import {main as addPlace} from "../../src/services/userGraph/place/addPlace";
import {Live} from "../../src/interfaces/models/live";

let response;
let event, expectedResponse;
let loggedUser, otherUser, placeLogged, placeOther, lives = [];
describe('Add live', async () => {

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

    after('Delete test logged users', async () => {
        let delResponse = await deleteUser(loggedUser['_id']);
        expect(delResponse).to.be.true;
    });
    after('Delete test other users', async () => {
        let delResponse = await deleteUser(otherUser['_id']);
        expect(delResponse).to.be.true;
    });

    after('Delete test place logged user', async () => {
        let delResponse = await deletePlace(placeLogged.placeId);
        expect(delResponse).to.be.true;
    });
    after('Delete test place other user', async () => {
        let delResponse = await deletePlace(placeOther.placeId);
        expect(delResponse).to.be.true;
    });

    afterEach('Delete added live', async () => {
        if (response) {
            let delResponse = await deleteLive(response.body.liveId);
            expect(delResponse).to.be.true;
        }
    });

    it('Add test live to logged user', async () => {
        let liveBody:Live = {
            createdAt: "1 15/06/2020 19:39"
        };

        event = {
            "pathParameters": {
                "userId": loggedUser['_id'],
                "placeId": placeLogged.placeId
            },
            "body": {
                ...liveBody
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": loggedUser.cognitoId
                }
            }
        };
        event.body = JSON.stringify(event.body);
        response = await addLive(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                ...liveBody,
                liveId: response.body.liveId
            },
        };
        expect(response).to.deep.equal(expectedResponse);
        lives.push(response.body);

    });

    it('Add test live to other user', async () => {
        let liveBody:Live = {
            createdAt: "1 15/06/2020 19:39"
        };

        event = {
            "pathParameters": {
                "userId": otherUser['_id'],
                "placeId": placeOther.placeId
            },
            "body": {
                ...liveBody
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": otherUser.cognitoId
                }
            }
        };
        event.body = JSON.stringify(event.body);
        response = await addLive(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                ...liveBody,
                liveId: response.body.liveId
            },
        };
        expect(response).to.deep.equal(expectedResponse);
        lives.push(response.body);

    });

    it('Add test live to logged user in other user place', async () => {
        let liveBody:Live = {
            createdAt: "1 15/06/2020 19:39"
        };

        event = {
            "pathParameters": {
                "userId": loggedUser['_id'],
                "placeId": placeOther.placeId
            },
            "body": {
                ...liveBody
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": loggedUser.cognitoId
                }
            }
        };
        event.body = JSON.stringify(event.body);
        response = await addLive(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            "statusCode": 401,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*"
            },
            "body": {}
        };
        expect(response).to.deep.equal(expectedResponse);
        lives.push(response.body);

    });

    it('User not logged', async () => {
        let liveBody:Live = {
            createdAt: "5 15/06/2020 19:39"
        };

        event = {
            "pathParameters": {
                "userId": loggedUser['_id'],
                "placeId": loggedUser.placeId
            },
            "body": {
                ...liveBody
            }
        };
        event.body = JSON.stringify(event.body);
        response = await addLive(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            "statusCode": 401,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*"
            },
            "body": {}
        };
        expect(response).to.deep.equal(expectedResponse);
        lives.push(response.body);
    });


});

