import {deleteUser, main as signUp} from '../../../src/services/userGraph/user/signUp';
import {deletePlace, main as addPlace} from '../../../src/services/userGraph/place/addPlace';
import {expect} from 'chai';
import {Place} from "../../../src/interfaces/models/place";

let event, expectedResponse;
let response, loggedUser, otherUser;
describe('Add place', async () => {

    before('Signing up test logged users', async () => {
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
    after('Delete test logged users', async () => {
        let delResponse = await deleteUser(loggedUser['_id']);
        expect(delResponse).to.be.true;
    });
    after('Delete test other users', async () => {
        let delResponse = await deleteUser(otherUser['_id']);
        expect(delResponse).to.be.true;

    });

    afterEach('Delete added place', async () => {
        if (response) {
            let delResponse = await deletePlace(response.body.placeId);
            expect(delResponse).to.be.true;
        }
    });

    it ('Add place user cam logged', async () => {
        let place:Place = {
            name: "ORION",
            description: "Locale con capacità di 1.200 persone che propone diverse serate con band dal vivo, discoteca e feste.",
            address: "Viale J. F. Kennedy, 52, 00043 Ciampino RM",
            coordinates: {
                latitude: 41.8099168,
                longitude: 12.5969897
            },
            userCam: loggedUser
        };
        event = {
            "pathParameters": {
                "userId": loggedUser['_id']
            },
            "body": {
                ...place
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
                ...place,
                placeId: response.body.placeId,
                camUser: response.body.camUser
            },
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it ('Add place user classic logged', async () => {
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
                    "cognitoAuthenticationProvider": ':' + otherUser.cognitoId
                }
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
        event.body = JSON.stringify(event.body);
        response = await addPlace(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
});
