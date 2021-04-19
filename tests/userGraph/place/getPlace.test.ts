import {main as signUp} from '../../../src/services/userGraph/user/signUp';
import {expect} from 'chai';
import {deleteUser} from "../../../src/services/userGraph/user/signUp";
import {Place} from "../../../src/interfaces/models/place";
import {deletePlace} from "../../../src/services/userGraph/place/addPlace";
import {main as addPlace} from "../../../src/services/userGraph/place/addPlace";
import {main as getPlace} from "../../../src/services/userGraph/place/getPlace";

let response;
let event, expectedResponse;
let loggedUser, otherUser, place;
describe('Get place', async () => {

    before('Signing up test logged users and their location', async () => {
        event = {
            "userName": "mariorossi",
            "request": {
                "userAttributes": {
                    "email": "mariorossi@gmail.com",
                    "email_verified": true,
                    "name": "Mario Rossi",
                    "sub": "asdasd-1232132-asdasd",
                    "custom:userType": "camUser"
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
                    "custom:userType": "classicUser"
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
                    "cognitoAuthenticationProvider": ':' + loggedUser.cognitoId
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
        place = response.body;
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

    it('User requested is same logged', async () => {
        event = {
            "pathParameters": {
                "placeId": place.placeId
            },
            "requestContext": {
                "identity": {
                    "cognitoAuthenticationProvider": ':' + loggedUser.cognitoId
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
                ...place
            },
        };
        let response = await getPlace(event);
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
                    "cognitoAuthenticationProvider": ':' + otherUser.cognitoId
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
                ...place
            },
        };
        let response = await getPlace(event);
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
        let response = await getPlace(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });


});

