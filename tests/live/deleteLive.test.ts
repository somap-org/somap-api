import {main as signUp} from '../../src/services/userGraph/user/signUp';
import {expect} from 'chai';
import {deleteUser} from "../../src/services/userGraph/user/signUp";
import {Place} from "../../src/interfaces/models/place";
import {deletePlace} from "../../src/services/userGraph/place/addPlace";
import {deleteLive as cleanLive, main as addLive} from "../../src/services/live/addLive"
import {main as addPlace} from "../../src/services/userGraph/place/addPlace";
import {main as deleteLive} from "../../src/services/live/deleteLive";
import {Live} from "../../src/interfaces/models/live";

let response;
let event, expectedResponse;
let loggedUser, otherUser, placeLogged, placeOther, liveLogged, liveOther;
describe('Delete live', async () => {

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

    after('Delete test place logged', async () => {
        let delResponse = await deletePlace(placeLogged.placeId);
        expect(delResponse).to.be.true;
    });
    after('Delete test place other', async () => {
        let delResponse = await deletePlace(placeOther.placeId);
        expect(delResponse).to.be.true;
    });

    beforeEach('Add test lives to logged user', async () => {
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
        liveLogged = response.body;
    });
    beforeEach('Add test lives to other user', async () => {
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
        liveOther = response.body;
    });

    afterEach('Delete lives logged', async () => {
        if(liveLogged) {
            let delResponse = await cleanLive(liveLogged.liveId);
            expect(delResponse).to.be.true;
        }
    });
    afterEach('Delete lives other', async () => {
        if(liveOther) {
            let delResponse = await cleanLive(liveOther.liveId);
            expect(delResponse).to.be.true;
        }
    });

    it('User logged delete his live', async () => {
        event = {
            "pathParameters": {
                "placeId": placeLogged.placeId,
                "liveId": liveLogged.liveId
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
            body: {}
        };
        let response = await deleteLive(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
        liveLogged = null;
    });
    it('User other delete his live', async () => {
        event = {
            "pathParameters": {
                "placeId": placeOther.placeId,
                "liveId": liveOther.liveId
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
            body: {}
        };
        let response = await deleteLive(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
        liveOther = null;
    });
    it('User other delete logged live', async () => {
        event = {
            "pathParameters": {
                "placeId": placeLogged.placeId,
                "liveId": liveLogged.liveId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": otherUser.cognitoId
                }
            }
        };
        expectedResponse = {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {}
        };
        let response = await deleteLive(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
    it('User not logged', async () => {
        event = {
            "pathParameters": {
                "placeId": placeLogged.placeId,
                "liveId": liveLogged.liveId
            }
        };
        expectedResponse = {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {}
        };
        let response = await deleteLive(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });


});

