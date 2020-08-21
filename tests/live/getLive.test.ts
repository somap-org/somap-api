import {main as signUp} from '../../src/services/userGraph/user/signUp';
import {expect} from 'chai';
import {deleteUser} from "../../src/services/userGraph/user/signUp";
import {Place} from "../../src/interfaces/models/place";
import {deletePlace} from "../../src/services/userGraph/place/addPlace";
import {deleteLive, main as addLive} from "../../src/services/live/addLive"
import {main as addPlace} from "../../src/services/userGraph/place/addPlace";
import {main as getLive} from "../../src/services/live/getLive";
import {Lives} from "../../src/interfaces/models/lives";

let response;
let event, expectedResponse;
let loggedUser, otherUser, placeLogged, placeOther, livesLogged = [], livesOther = [];
describe('Get live', async () => {

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

    before('Add test lives to logged user', async () => {
        let livesBody:Lives = [
            {
                createdAt: "1 15/06/2020 19:39"
            },
            {
                createdAt: "2 15/06/2020 19:39"
            },
            {
                createdAt: "3 15/06/2020 19:39"
            }
        ];
        for (const liveBody of livesBody) {
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
            livesLogged.push(response.body);
        };
    });
    before('Add test lives to other user', async () => {
        let livesBody:Lives = [
            {
                createdAt: "4 15/06/2020 19:39"
            },
            {
                createdAt: "5 15/06/2020 19:39"
            },
            {
                createdAt: "6 15/06/2020 19:39"
            }
        ];
        for (const liveBody of livesBody) {
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
            livesOther.push(response.body);
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
    after('Delete lives logged', async () => {
        livesLogged.forEach(async live => {
            let delResponse = await deleteLive(live.liveId);
            expect(delResponse).to.be.true;
        });
    });
    after('Delete lives other', async () => {
        livesOther.forEach(async live => {
            let delResponse = await deleteLive(live.liveId);
            expect(delResponse).to.be.true;
        });
    });

    it('User requested is same logged', async () => {
        for (const live of livesLogged) {
            event = {
                "pathParameters": {
                    "liveId": live.liveId
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
                    ...live
                }
            };
            let response = await getLive(event);
            response.body = JSON.parse(response.body);
            expect(response).to.deep.equal(expectedResponse);
        }
    });
    it('User requested is same other', async () => {
        for (const live of livesOther) {
            event = {
                "pathParameters": {
                    "liveId": live.liveId
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
                    ...live
                }
            };
            let response = await getLive(event);
            response.body = JSON.parse(response.body);
            expect(response).to.deep.equal(expectedResponse);
        }
    });
    it('User requested is not same logged', async () => {
        for (const live of livesLogged) {
            event = {
                "pathParameters": {
                    "liveId": live.liveId
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
                    ...live
                }
            };
            let response = await getLive(event);
            response.body = JSON.parse(response.body);
            expect(response).to.deep.equal(expectedResponse);
        }
    });
    it('User not logged', async () => {
        for (const live of livesLogged) {
            event = {
                "pathParameters": {
                    "liveId": live.liveId
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
            let response = await getLive(event);
            response.body = JSON.parse(response.body);
            expect(response).to.deep.equal(expectedResponse);
        }
    });


});

