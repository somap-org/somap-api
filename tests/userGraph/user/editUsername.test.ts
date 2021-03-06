import {main as editUsername} from '../../../src/services/userGraph/user/editUsername';
import {main as signUp} from '../../../src/services/userGraph/user/signUp';
import {expect} from 'chai';
import {deleteUser} from "../../../src/services/userGraph/user/signUp";

let event, expectedResponse;
let loggedUser, otherUser;
describe('Edit username', async () => {

    before('Signing up test logged users', async () => {
        event = {
            "userName": "mariorossi",
            "request": {
                "userAttributes": {
                    "email": "mariorossi@gmail.com",
                    "email_verified": true,
                    "name": "Mario Rossi",
                    "sub": "asdasd-1232132-asdasd",
                    "custom:userType": "ClassicUser"
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

    after('Delete test logged users', async () => {
        let delResponse = await deleteUser(loggedUser['_id']);
        expect(delResponse).to.be.true;
    });
    after('Delete test other users', async () => {
        let delResponse = await deleteUser(otherUser['_id']);
        expect(delResponse).to.be.true;

    });
    
    it('Edit user logged username', async () => {
        event = {
            "pathParameters": {
                "userId": loggedUser['_id']
            },
            "body": {
              "username": "simoneverdi2"
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
                username: "simoneverdi2"
            },
        };
        let response = await editUsername(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });


    it('User requested is not same logged', async () => {
        event = {
            "pathParameters": {
                "userId": otherUser['_id']
            },
            "body": {
                "username": "simoneverdi2"
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": loggedUser.cognitoId
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
            body: {},
        };
        let response = await editUsername(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });

 });
