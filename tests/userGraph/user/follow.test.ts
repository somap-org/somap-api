import {deleteUser, main as signUp} from '../../../src/services/userGraph/user/signUp';
import {deletePlace, main as addPlace} from '../../../src/services/userGraph/place/addPlace';
import {expect} from 'chai';
import {main as getUserPublicProfile} from "../../../src/services/userGraph/user/getUserPublicProfile";
import {main as follow} from "../../../src/services/userGraph/user/follow";
import {main as unfollow} from "../../../src/services/userGraph/user/unfollow";
import {main as getFollowersList} from "../../../src/services/userGraph/user/getFollowersList";
import {main as getFollowingList} from "../../../src/services/userGraph/user/getFollowingList";

let event, expectedResponse;
let response;
let mariorossi, fabiobianchi;
describe('Follower service', async () => {

    before('Signing up mariorossi user', async () => {
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
        mariorossi = await signUp(event);
        expect(mariorossi).to.not.be.null;
    });
    before('Signing up fabiobianchi user', async () => {
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
        fabiobianchi = await signUp(event);
        expect(fabiobianchi).to.not.be.null;
    });

    after('Delete mariorossi users', async () => {
        let delResponse = await deleteUser(mariorossi['_id']);
        expect(delResponse).to.be.true;
    });
    after('Delete fabiobianchi users', async () => {
        let delResponse = await deleteUser(fabiobianchi['_id']);
        expect(delResponse).to.be.true;

    });

    it('Mario unfollow fabio unauthorizer', async () => {
        event = {
            "pathParameters": {
                "userId": mariorossi['_id'],
                "targetId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
        response = await unfollow(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Mario unfollow fabio', async () => {
        event = {
            "pathParameters": {
                "userId": mariorossi['_id'],
                "targetId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
            body: {},
        };
        response = await unfollow(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });

    it('Check if both have 0 followers/following', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
                ...mariorossi.publicProfile,
                followers: 0,
                following: 0,
                userId: mariorossi['_id'].toString()
            },
        };
        response = await getUserPublicProfile(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);

        //fabiobianchi
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
                ...fabiobianchi.publicProfile,
                followers: 0,
                following: 0,
                userId: fabiobianchi['_id'].toString()
            },
        };
        response = await getUserPublicProfile(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check mario.followingList is null', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
            body: [],
        };
        response = await getFollowingList(event);
        response.body = JSON.parse(response.body);
        ;
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check mario.followerList is null', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
            body: [],
        };
        response = await getFollowersList(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check fabio.followingList is null', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
            body: [],
        };
        response = await getFollowingList(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check fabio.followerList is null', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
            body: [],
        };
        response = await getFollowersList(event);
        response.body = JSON.parse(response.body);
        ;
        expect(response).to.deep.equal(expectedResponse);
    });

    it('Mario follow fabio', async () => {
        event = {
            "pathParameters": {
                "userId": mariorossi['_id'],
                "targetId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
            body: {},
        };
        response = await follow(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Mario follow fabio second time bad request', async () => {
        event = {
            "pathParameters": {
                "userId": mariorossi['_id'],
                "targetId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        expectedResponse = {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        response = await follow(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Mario follow fabio unauthorized', async () => {
        event = {
            "pathParameters": {
                "userId": mariorossi['_id'],
                "targetId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
        response = await follow(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Mario unfollow fabio unauthorized', async () => {
        event = {
            "pathParameters": {
                "userId": mariorossi['_id'],
                "targetId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
        response = await unfollow(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });

    it('Check if mario.following = 1 and fabio.follower = 1', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
                ...mariorossi.publicProfile,
                followers: 0,
                following: 1,
                userId: mariorossi['_id'].toString()
            },
        };
        response = await getUserPublicProfile(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
        mariorossi.publicProfile = {
            ...response.body
        };

        //fabiobianchi
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
                ...fabiobianchi.publicProfile,
                followers: 1,
                following: 0,
                userId: fabiobianchi['_id'].toString()
            },
        };
        response = await getUserPublicProfile(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
        fabiobianchi.publicProfile = {
            ...response.body
        };
    });
    it('Check mario.followersList is null', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
            body: [],
        };
        response = await getFollowersList(event);
        response.body = JSON.parse(response.body);
        ;
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check mario.followingList contain fabio', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
            body: [{
                userId: fabiobianchi['_id'].toString(),
                ...fabiobianchi.publicProfile
            }],
        };
        response = await getFollowingList(event);
        response.body = JSON.parse(response.body);
        ;
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check fabio.followerList contain mario', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
            body: [{
                userId: mariorossi['_id'].toString(),
                ...mariorossi.publicProfile
            }],
        };
        response = await getFollowersList(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check fabio.followingList is null', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
            body: [],
        };
        response = await getFollowingList(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });

    //DONE: fabio follow mario
    it('Fabio follow mario', async () => {
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id'],
                "targetId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
            body: {},
        };
        response = await follow(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });


    //DONE: controllo che mario.following = 1, mario.followers = 1 and fabio.following = 1, fabio.follower = 1
    it('Check if mario.following = 1, mario.followers = 1 and fabio.following = 1, fabio.follower = 1', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
                ...mariorossi.publicProfile,
                followers: 1,
                following: 1,
                userId: mariorossi['_id'].toString()
            },
        };
        response = await getUserPublicProfile(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
        mariorossi.publicProfile = {
            ...response.body
        };

        //fabiobianchi
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
                ...fabiobianchi.publicProfile,
                followers: 1,
                following: 1,
                userId: fabiobianchi['_id'].toString()
            },
        };
        response = await getUserPublicProfile(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
        fabiobianchi.publicProfile = {
            ...response.body
        };
    });

    it('Check mario.followersList contain fabio', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
            body: [{
                userId: fabiobianchi['_id'].toString(),
                ...fabiobianchi.publicProfile
            }],
        };
        response = await getFollowersList(event);
        response.body = JSON.parse(response.body);
        ;
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check mario.followingList contain fabio', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
            body: [{
                userId: fabiobianchi['_id'].toString(),
                ...fabiobianchi.publicProfile
            }],
        };
        response = await getFollowingList(event);
        response.body = JSON.parse(response.body);
        ;
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check fabio.followerList contain mario', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
            body: [{
                userId: mariorossi['_id'].toString(),
                ...mariorossi.publicProfile
            }],
        };
        response = await getFollowersList(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check fabio.followingList contain mario', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
            body: [{
                userId: mariorossi['_id'].toString(),
                ...mariorossi.publicProfile
            }],
        };
        response = await getFollowingList(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });


    //DONE: mario unfollow fabio
    it('Mario unfollow fabio', async () => {
        event = {
            "pathParameters": {
                "userId": mariorossi['_id'],
                "targetId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
            body: {},
        };
        response = await unfollow(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });

    //DONE : controllo che mario.follower = 1 e fabio.following = 1
    it('Check if mario.following = 0, mario.followers = 1 and fabio.following = 1, fabio.follower = 0', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
                ...mariorossi.publicProfile,
                followers: 1,
                following: 0,
                userId: mariorossi['_id'].toString()
            },
        };
        response = await getUserPublicProfile(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
        mariorossi.publicProfile = {
            ...response.body
        };

        //fabiobianchi
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
                ...fabiobianchi.publicProfile,
                followers: 0,
                following: 1,
                userId: fabiobianchi['_id'].toString()
            },
        };
        response = await getUserPublicProfile(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
        fabiobianchi.publicProfile = {
            ...response.body
        };
    });

    it('Check mario.followersList contain fabio', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
            body: [{
                userId: fabiobianchi['_id'].toString(),
                ...fabiobianchi.publicProfile
            }],
        };
        response = await getFollowersList(event);
        response.body = JSON.parse(response.body);
        ;
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check mario.followingList is null', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
            body: [],
        };
        response = await getFollowingList(event);
        response.body = JSON.parse(response.body);
        ;
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check fabio.followerList is null', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
            body: [],
        };
        response = await getFollowersList(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check fabio.followingList contain mario', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
            body: [{
                userId: mariorossi['_id'].toString(),
                ...mariorossi.publicProfile
            }],
        };
        response = await getFollowingList(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });

    //DONE: fabio unfollow mario
    it('Fabio unfollow mario', async () => {
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id'],
                "targetId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
            body: {},
        };
        response = await unfollow(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
    });

    //DONE: controllo se entrambi sono 0
    it('Check if both have 0 followers/following', async () => {
        //mariorossi
        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
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
                ...mariorossi.publicProfile,
                followers: 0,
                following: 0,
                userId: mariorossi['_id'].toString()
            },
        };
        response = await getUserPublicProfile(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
        mariorossi.publicProfile = {
            ...response.body
        };

        //fabiobianchi
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
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
                ...fabiobianchi.publicProfile,
                followers: 0,
                following: 0,
                userId: fabiobianchi['_id'].toString()
            },
        };
        response = await getUserPublicProfile(event);
        response.body = JSON.parse(response.body);
        expect(response).to.deep.equal(expectedResponse);
        fabiobianchi.publicProfile = {
            ...response.body
        };
    });

});
