//Aggiungi mariorossi
//Aggiungi fabiobianchi

//post1 = mariorossi pubblica post1

//--- ADD COMMENT
//comment1 = mariorossi pubblica commento sul post1 di fabio
//reply1comment1 = fabio risponde al commento 1


//PER OGNI PARENTE (POST, COMMENT, REPLY)
//mariorossi like post1
//getpost1 controlla likescount = 1
//fabiobianchi like post1
//getpost1 controlla likescount = 2
//getpost1likes controlla [mariorossi, fabiobianchi]
//mariorossi dislike post1
//getpost1 controlla likescount = 1
//getpost1likes controlla [fabiobianchi]
//fabiobianchi dislike post1
//getpost1 controlla likescount = 0
//getpost1likes controlla []

//mariorossi like reply1comment1
//delete reply1comment1
//getpost1likes controlla []

//mariorossi like comment1
//delete comment1
//getcomment1likes controlla []

//mariorossi like post1
//delete post1
//getpost1likes controlla []


import {deleteUser, main as signUp} from "../../../src/services/userGraph/user/signUp";
import {expect} from "chai";
import {NewPost} from "../../../src/interfaces/models/newPost";
import {main as addPost} from "../../../src/services/content/post/addPost";
import {main as getPost} from "../../../src/services/content/post/getPost";
import {main as getComment} from "../../../src/services/content/comment/getComment";
import {main as getComments} from "../../../src/services/content/comment/getComments";
import {main as getCommentReplies} from "../../../src/services/content/comment/getCommentReplies";
import {main as editComment} from "../../../src/services/content/comment/editComment";
import {main as deleteComment} from "../../../src/services/content/comment/deleteComment";
import {main as addComment} from "../../../src/services/content/comment/addComment";
import {main as addLike} from "../../../src/services/content/like/addLike";
import {main as deleteLike} from "../../../src/services/content/like/deleteLike";
import {main as getLikes} from "../../../src/services/content/like/getLikes";
import {Post} from "../../../src/interfaces/models/post";
import {Comment} from "../../../src/interfaces/models/comment";
import {UserRepository} from "../../../src/repositories/UserRepository";
import {NewComment} from "../../../src/interfaces/models/newComment";
import {PostRepository} from "../../../src/repositories/PostRepository";
import {main as deletePost} from "../../../src/services/content/post/deletePost";

let response, expectedResponse, event;
let mariorossi, fabiobianchi;
let
    post1,  //post pubblicato da mariorossi sul suo profilo
    comment1,   //mariorossi pubblica commento sul post1
    reply1comment1; //mariorossi risponde al commento 1


describe('like', async function () {
    //Aggiungi/elimina mariorossi
    before('Signing up test logged user', async () => {
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
        mariorossi = await signUp(event);
        expect(mariorossi).to.not.be.null;
    });
    after('Delete mariorossi user', async () => {
        let delResponse = await deleteUser(mariorossi['_id']);
        expect(delResponse).to.be.true;
    });
    //Aggiungi/elimina fabiobianchi
    before('Signing up test other user', async () => {
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
        fabiobianchi = await signUp(event);
        expect(fabiobianchi).to.not.be.null;
    });
    after('Delete fabiobianchi user', async () => {
        let delResponse = await deleteUser(fabiobianchi['_id']);
        expect(delResponse).to.be.true;
    });


    after('delete posts', async () => {
        let postRepo = new PostRepository();
        await postRepo.deletePost(post1.postId);
    });

    it('Mariorossi publish post on his profile', async () => {
        let postBody: NewPost = {
            body: "Questo è un nuovo post"
        };

        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "body": {
                ...postBody
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addPost(event);
        response.body = JSON.parse(response.body);
        let expectedBody: Post = {
            postId: response.body.postId,
            body: postBody.body,
            author: {
                ...await new UserRepository().getUserPublicProfile(mariorossi['_id'])
            },
            postedAt: response.body.postedAt,
            medias: postBody.medias || [],
            sharedCount: 0,
            likesCount: 0,
            commentsCount: 0,
            sharedPost: null
        };
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                ...expectedBody
            },
        };
        expect(response).to.deep.equal(expectedResponse);
        post1 = response.body;
    });
    it('Mariorossi comment1 fabio post1', async () => {
        let postBody:NewComment = {
            body: "Bel post! complimenti!"
        };

        event = {
            "pathParameters": {
                "postId": post1.postId
            },
            "body": {
                ...postBody
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addComment(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Comment = {
            commentId: response.body.commentId,
            body: postBody.body,
            author: {
                ...await new UserRepository().getUserPublicProfile(mariorossi['_id'])
            },
            postedAt: response.body.postedAt,
            likesCount: 0,
            repliesCount: 0,
        };
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                ...expectedBody
            },
        };
        expect(response).to.deep.equal(expectedResponse);
        comment1 = response.body;
        post1.commentsCount++;
    });
    it('Fabiobianchi replies to his comment1', async () => {
        let postBody:NewComment = {
            body: "E' un piacere!"
        };

        event = {
            "pathParameters": {
                "commentId": comment1.commentId
            },
            "body": {
                ...postBody
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await addComment(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Comment = {
            commentId: response.body.commentId,
            body: postBody.body,
            author: {
                ...await new UserRepository().getUserPublicProfile(fabiobianchi['_id'])
            },
            postedAt: response.body.postedAt,
            likesCount: 0,
            repliesCount: 0,
        };
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                commentId: response.body.commentId,
                ...expectedBody
            },
        };
        expect(response).to.deep.equal(expectedResponse);
        reply1comment1 = response.body;
        comment1.repliesCount++;
    });


    it('Mariorossi like post1', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        post1.likesCount++;
    });
    it('Mariorossi like 2nd time post1', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Mariorossi try fabiobianchi like post1', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId,
                "userId": fabiobianchi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check post1 likesCount = 1', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getPost(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: post1,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Fabiobianchi like post1', async () => {

        event = {
            "pathParameters": {
                "postId": post1.postId,
                "userId": fabiobianchi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        post1.likesCount++;
    });
    it('Check post1 likesCount = 2', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getPost(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: post1,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get post1 likes', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getLikes(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [
                {
                    ...mariorossi.publicProfile,
                    userId: mariorossi['_id'].toString(),
                },
                {
                    ...fabiobianchi.publicProfile,
                    userId: fabiobianchi['_id'].toString(),
                }
            ],
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Mariorossi dislike post1', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await deleteLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        post1.likesCount--;
    });
    it('Fabiobianchi try mariorossi dislike post1', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await deleteLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check post1 likesCount = 1', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getPost(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: post1,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get post1 likes', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getLikes(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [
                {
                    ...fabiobianchi.publicProfile,
                    userId: fabiobianchi['_id'].toString(),
                }
            ],
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Fabiobianchi dislike post1', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId,
                "userId": fabiobianchi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await deleteLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        post1.likesCount--;
    });
    it('Check post1 likesCount = 0', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getPost(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: post1,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get post1 likes', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getLikes(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [],
        };
        expect(response).to.deep.equal(expectedResponse);
    });

    it('Mariorossi like comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        comment1.likesCount++;
    });
    it('Mariorossi like 2nd time comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Mariorossi try fabiobianchi like comment1', async () => {

        event = {
            "pathParameters": {
                "commentId": comment1.commentId,
                "userId": fabiobianchi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check comment1 likesCount = 1', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getComment(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: comment1,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Fabiobianchi like comment1', async () => {

        event = {
            "pathParameters": {
                "commentId": comment1.commentId,
                "userId": fabiobianchi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        comment1.likesCount++;
    });
    it('Check comment1 likesCount = 2', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getComment(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: comment1,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get comment1 likes', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getLikes(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [
                {
                    ...mariorossi.publicProfile,
                    userId: mariorossi['_id'].toString(),
                },
                {
                    ...fabiobianchi.publicProfile,
                    userId: fabiobianchi['_id'].toString(),
                }
            ],
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Mariorossi dislike comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await deleteLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        comment1.likesCount--;
    });
    it('Fabiobianchi try mariorossi dislike comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await deleteLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check comment1 likesCount = 1', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getComment(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: comment1,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get comment1 likes', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getLikes(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [
                {
                    ...fabiobianchi.publicProfile,
                    userId: fabiobianchi['_id'].toString(),
                }
            ],
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Fabiobianchi dislike comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId,
                "userId": fabiobianchi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await deleteLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        comment1.likesCount--;
    });
    it('Check comment1 likesCount = 0', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getComment(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: comment1,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get comment1 likes', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getLikes(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [],
        };
        expect(response).to.deep.equal(expectedResponse);
    });

    it('Mariorossi like reply1comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        reply1comment1.likesCount++;
    });
    it('Mariorossi like 2nd time reply1comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Mariorossi try fabiobianchi like reply1comment1', async () => {

        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId,
                "userId": fabiobianchi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check reply1comment1 likesCount = 1', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getComment(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: reply1comment1,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Fabiobianchi like reply1comment1', async () => {

        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId,
                "userId": fabiobianchi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        reply1comment1.likesCount++;
    });
    it('Check reply1comment1 likesCount = 2', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getComment(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: reply1comment1,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get reply1comment1 likes', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getLikes(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [
                {
                    ...mariorossi.publicProfile,
                    userId: mariorossi['_id'].toString(),
                },
                {
                    ...fabiobianchi.publicProfile,
                    userId: fabiobianchi['_id'].toString(),
                }
            ],
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Mariorossi dislike reply1comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await deleteLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        reply1comment1.likesCount--;
    });
    it('Fabiobianchi try mariorossi dislike reply1comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await deleteLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check reply1comment1 likesCount = 1', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getComment(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: reply1comment1,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get reply1comment1 likes', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getLikes(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [
                {
                    ...fabiobianchi.publicProfile,
                    userId: fabiobianchi['_id'].toString(),
                }
            ],
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Fabiobianchi dislike reply1comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId,
                "userId": fabiobianchi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await deleteLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        reply1comment1.likesCount--;
    });
    it('Check reply1comment1 likesCount = 0', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getComment(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: reply1comment1,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get reply1comment1 likes', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getLikes(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [],
        };
        expect(response).to.deep.equal(expectedResponse);
    });

    it('Mariorossi like reply1comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        reply1comment1.likesCount++;
    });
    it('Delete reply1comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await deleteComment(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get reply1comment1 likes', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment1.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getLikes(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [],
        };
        expect(response).to.deep.equal(expectedResponse);
    });

    it('Mariorossi like comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        comment1.likesCount++;
    });
    it('Delete reply1comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await deleteComment(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get comment1 likes', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getLikes(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [],
        };
        expect(response).to.deep.equal(expectedResponse);
    });

    it('Mariorossi like post1', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId,
                "userId": mariorossi['_id']
            },
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await addLike(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        post1.likesCount++;
    });
    it('mariorossi delete post1', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await deletePost(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get post1 likes', async () => {
        event = {
            "pathParameters": {
                "postId": post1.postId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getLikes(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [],
        };
        expect(response).to.deep.equal(expectedResponse);
    });


});
