import {main as signUp} from '../../../src/services/userGraph/user/signUp';
import {expect} from 'chai';
import {deleteUser} from "../../../src/services/userGraph/user/signUp";
import {Place} from "../../../src/interfaces/models/place";
import {deletePlace} from "../../../src/services/userGraph/place/addPlace";
import {main as addPlace} from "../../../src/services/userGraph/place/addPlace";
import {main as getPlaces} from "../../../src/services/userGraph/place/getPlaces";

let response;
let event, expectedResponse;
let store = [];
let classicUser;
describe('Get places', async () => {

    before('Signing up classic user', async () => {
        event = {
            "userName": "francesco097",
            "request": {
                "userAttributes": {
                    "email": "francesco097@gmail.com",
                    "email_verified": true,
                    "name": "Francesco Franceschini",
                    "sub": "asfafsas-12553-asdasd",
                    "custom:userType": "classicUser"
                }
            }
        };
        classicUser = await signUp(event);
        expect(classicUser).to.not.be.null;
    });
    before('Signing up test orion user and place', async () => {
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
        let user = await signUp(event);
        expect(user).to.not.be.null;

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
                "userId": user['_id']
            },
            "body": {
                ...placeBody
            },
            "requestContext": {
                "identity": {
                    "cognitoAuthenticationProvider": ':' + user.cognitoId
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
        let place = response.body;


        store.push({
            user,
            place
        });
    });
    before('Signing up test 747 user and place', async () => {
        event = {
            "userName": "fabiobianchi",
            "request": {
                "userAttributes": {
                    "email": "fabiobianchi@gmail.com",
                    "email_verified": true,
                    "name": "Fabio Bianchi",
                    "sub": "abcdevfefe-1232132-cofeve",
                    "custom:userType": "camUser"
                }
            }
        };
        let user = await signUp(event);
        expect(user).to.not.be.null;

        let placeBody:Place = {
            name: "747 Disco",
            description: "Location per Feste ed Eventi.",
            address: "Viale J. F. Kennedy, 131, 00043 Ciampino RM",
            coordinates: {
                latitude: 41.8083709,
                longitude: 12.5921665
            }
        };
        event = {
            "pathParameters": {
                "userId": user['_id']
            },
            "body": {
                ...placeBody
            },
            "requestContext": {
                "identity": {
                    "cognitoAuthenticationProvider": ':' + user.cognitoId
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
        let place = response.body;


        store.push({
            user,
            place
        });
    });
    before('Signing up test City Dream user and place', async () => {
        event = {
            "userName": "robertoverdi",
            "request": {
                "userAttributes": {
                    "email": "fabiobianchi@gmail.com",
                    "email_verified": true,
                    "name": "Fabio Bianchi",
                    "sub": "abcdevfefe-1232132-cofeve",
                    "custom:userType": "camUser"
                }
            }
        };
        let user = await signUp(event);
        expect(user).to.not.be.null;

        let placeBody:Place = {
            name: "City Dream",
            description: "Cocktail e musica eclettica in discoteca gettonata con interni spaziosi, arredi moderni e divanetti bianchi.",
            address: "Via dei Ruderi di Torrenova, 55, 00133 Roma RM",
            coordinates: {
                latitude: 41.8680596,
                longitude: 12.6028113
            }
        };
        event = {
            "pathParameters": {
                "userId": user['_id']
            },
            "body": {
                ...placeBody
            },
            "requestContext": {
                "identity": {
                    "cognitoAuthenticationProvider": ':' + user.cognitoId
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
        let place = response.body;


        store.push({
            user,
            place
        });
    });

    after('Delete test logged users', async () => {
        store.forEach(async item => {
            let delResponse = await deleteUser(item.user._id);
            expect(delResponse).to.be.true;
            delResponse = await deletePlace(item.place.placeId);
            expect(delResponse).to.be.true;
        });
    });
    after('Delete classic users', async () => {
        let delResponse = await deleteUser(classicUser._id);
        expect(delResponse).to.be.true;
    });

    it('Classic user request for 2 places', async () => {
        event = {
            "query": {
                "latitude": 41.8111439,
                "longitude": 12.6030924,
                "range": 2000
            },
            "requestContext": {
                "identity": {
                    "cognitoAuthenticationProvider": ':' + classicUser.cognitoId
                }
            }
        };
        let expectedPlaces = [];
        store.forEach(item => {
            if (item.place.name=="ORION")
                expectedPlaces.push(item.place);
            if (item.place.name=="747 Disco")
                expectedPlaces.push(item.place);
        });
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: expectedPlaces,
        };
        let response = await getPlaces(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });

    it('Classic user request for 1 place', async () => {
        event = {
            "query": {
                "latitude": 41.8693897,
                "longitude": 12.6061919,
                "range": 1500
            },
            "requestContext": {
                "identity": {
                    "cognitoAuthenticationProvider": ':' + classicUser.cognitoId
                }
            }
        };
        let expectedPlaces = [];
        store.forEach(item => {
            if (item.place.name=="City Dream")
                expectedPlaces.push(item.place);
        });
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: expectedPlaces,
        };
        let response = await getPlaces(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });

    it('User not logged', async () => {
        event = {
            "query": {
                "latitude": 41.8111439,
                "longitude": 12.6030924,
                "range": 1500
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
        let response = await getPlaces(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });


});

