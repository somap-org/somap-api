import {main as getUserPublicProfile} from '../../../src/services/userGraph/user/getUserPublicProfile';
import {main as signUp} from '../../../src/services/userGraph/user/signUp';
import {expect} from 'chai';
import {deleteUser} from "../../../src/services/userGraph/user/signUp";

let event, expectedResponse;
let loggedUser, otherUser;
describe('Get user public profile', async () => {

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
        loggedUser = loggedUser.toJSON();
        loggedUser.publicProfile.userType = loggedUser.userType;
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
        otherUser = otherUser.toJSON();
        otherUser.publicProfile.userType = otherUser.userType;
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
    
    it('User requested is same logged', async () => {
        event = {
            "pathParameters": {
                "userId": loggedUser['_id']
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
                ...loggedUser.publicProfile,
                userId: loggedUser['_id'].toString()
            },
        };
        let response = await getUserPublicProfile(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });


    it('User requested is not same logged', async () => {
        event = {
            "pathParameters": {
                "userId": otherUser['_id']
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
                ...otherUser.publicProfile,
                userId: otherUser['_id'].toString()
            },
        };
        let response = await getUserPublicProfile(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });

    it('User not logged', async () => {
        event = {
            "pathParameters": {
                "userId": otherUser['_id']
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
        let response = await getUserPublicProfile(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });


});
