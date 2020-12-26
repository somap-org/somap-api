import {main as signUp} from '../../../src/services/userGraph/user/signUp';
import {expect} from 'chai';
import {deleteUser} from "../../../src/services/userGraph/user/signUp";
import {Place} from "../../../src/interfaces/models/place";
import {deletePlace} from "../../../src/services/userGraph/place/addPlace";
import {deleteActivity, main as addActivity} from "../../../src/services/content/activity/addActivity"
import {main as addPlace} from "../../../src/services/userGraph/place/addPlace";
import {Live} from "../../../src/interfaces/models/live";
import {Activity} from "../../../src/interfaces/models/activity";

let response;
let event, expectedResponse;
let loggedUser, otherUser, placeLogged, placeOther, activities = [];
describe('Add activity', async () => {

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
          "custom:userType": "camUser"
        }
      }
    };
    otherUser = await signUp(event);
    expect(otherUser).to.not.be.null;
  });

  before('Add test place to logged user', async () => {
    let placeBody: Place = {
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
    placeLogged = response.body;
  });
  before('Add test place to other user', async () => {
    let placeBody: Place = {
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
          "cognitoAuthenticationProvider": ':' + otherUser.cognitoId
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

  afterEach('Delete added activity', async () => {
    if (response) {
      let delResponse = await deleteActivity(response.body.activityId);
      expect(delResponse).to.be.true;
    }
  });

  it('Add test activity to logged user', async () => {
    let activityBody: Activity = {
      name: "White Party",
      description: "White clothes party",
      date: "19/06/2020",
      thumbnail: "https://www.photo.it"
    };

    event = {
      "pathParameters": {
        "userId": loggedUser['_id'],
        "placeId": placeLogged.placeId
      },
      "body": {
        ...activityBody
      },
      "requestContext": {
        "identity": {
          "cognitoAuthenticationProvider": ':' + loggedUser.cognitoId
        }
      }
    };
    event.body = JSON.stringify(event.body);
    response = await addActivity(event);
    response.body = JSON.parse(response.body);
    expectedResponse = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        ...activityBody,
        activityId: response.body.activityId
      },
    };
    expect(response).to.deep.equal(expectedResponse);
    activities.push(response.body);

  });

  it('Add test activity to other user', async () => {
    let activityBody: Activity = {
      name: "Black Party",
      description: "Black clothes party",
      date: "19/06/2020",
      thumbnail: "https://www.photo.it"
    };

    event = {
      "pathParameters": {
        "userId": otherUser['_id'],
        "placeId": placeOther.placeId
      },
      "body": {
        ...activityBody
      },
      "requestContext": {
        "identity": {
          "cognitoAuthenticationProvider": ':' + otherUser.cognitoId
        }
      }
    };
    event.body = JSON.stringify(event.body);
    response = await addActivity(event);
    response.body = JSON.parse(response.body);
    expectedResponse = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        ...activityBody,
        activityId: response.body.activityId
      },
    };
    expect(response).to.deep.equal(expectedResponse);
    activities.push(response.body);

  });

  it('Add test activity to logged user in other user place', async () => {
    let activityBody: Activity = {
      name: "Green Party",
      description: "Green clothes party",
      date: "19/06/2020",
      thumbnail: "https://www.photo.it"
    };

    event = {
      "pathParameters": {
        "userId": loggedUser['_id'],
        "placeId": placeOther.placeId
      },
      "body": {
        ...activityBody
      },
      "requestContext": {
        "identity": {
          "cognitoAuthenticationProvider": ':' + loggedUser.cognitoId
        }
      }
    };
    event.body = JSON.stringify(event.body);
    response = await addActivity(event);
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
    activities.push(response.body);

  });

  it('User not logged', async () => {
    let activityBody: Activity = {
      name: "Green Party",
      description: "Green clothes party",
      date: "19/06/2020",
      thumbnail: "https://www.photo.it"
    };

    event = {
      "pathParameters": {
        "userId": loggedUser['_id'],
        "placeId": loggedUser.placeId
      },
      "body": {
        ...activityBody
      }
    };
    event.body = JSON.stringify(event.body);
    response = await addActivity(event);
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
    activities.push(response.body);
  });

});

