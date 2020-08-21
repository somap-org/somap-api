Object.defineProperty(exports, "__esModule", { value: true });
exports.APIGatewayRequest = void 0;
exports.APIGatewayRequest = ({ body, method, path = '', queryStringObject, pathParametersObject, stageVariables = null, }) => {
    const request = {
        body: body ? JSON.stringify(body) : null,
        headers: {},
        multiValueHeaders: {},
        httpMethod: method,
        isBase64Encoded: false,
        path,
        pathParameters: pathParametersObject || null,
        queryStringParameters: queryStringObject || null,
        multiValueQueryStringParameters: null,
        stageVariables,
        requestContext: {
            accountId: '',
            apiId: '',
            httpMethod: method,
            identity: {
                accessKey: '',
                accountId: '',
                apiKey: '',
                apiKeyId: '',
                caller: '',
                cognitoAuthenticationProvider: '',
                cognitoAuthenticationType: '',
                cognitoIdentityId: '',
                cognitoIdentityPoolId: '',
                principalOrgId: '',
                sourceIp: '',
                user: '',
                userAgent: '',
                userArn: '',
            },
            path,
            stage: '',
            requestId: '',
            requestTimeEpoch: 3,
            resourceId: '',
            resourcePath: '',
        },
        resource: '',
    };
    return request;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRHZW5lcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdHMvdGVzdFV0aWxlcy9ldmVudEdlbmVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFhLFFBQUEsaUJBQWlCLEdBQUcsQ0FBQyxFQUMvQixJQUFJLEVBQ0osTUFBTSxFQUNOLElBQUksR0FBRyxFQUFFLEVBQ1QsaUJBQWlCLEVBQ2pCLG9CQUFvQixFQUNwQixjQUFjLEdBQUcsSUFBSSxHQUN2QixFQUFFLEVBQUU7SUFDRCxNQUFNLE9BQU8sR0FBRztRQUNaLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDeEMsT0FBTyxFQUFFLEVBQUU7UUFDWCxpQkFBaUIsRUFBRSxFQUFFO1FBQ3JCLFVBQVUsRUFBRSxNQUFNO1FBQ2xCLGVBQWUsRUFBRSxLQUFLO1FBQ3RCLElBQUk7UUFDSixjQUFjLEVBQUUsb0JBQW9CLElBQUksSUFBSTtRQUM1QyxxQkFBcUIsRUFBRSxpQkFBaUIsSUFBSSxJQUFJO1FBQ2hELCtCQUErQixFQUFFLElBQUk7UUFDckMsY0FBYztRQUNkLGNBQWMsRUFBRTtZQUNaLFNBQVMsRUFBRSxFQUFFO1lBQ2IsS0FBSyxFQUFFLEVBQUU7WUFDVCxVQUFVLEVBQUUsTUFBTTtZQUNsQixRQUFRLEVBQUU7Z0JBQ04sU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsNkJBQTZCLEVBQUUsRUFBRTtnQkFDakMseUJBQXlCLEVBQUUsRUFBRTtnQkFDN0IsaUJBQWlCLEVBQUUsRUFBRTtnQkFDckIscUJBQXFCLEVBQUUsRUFBRTtnQkFDekIsY0FBYyxFQUFFLEVBQUU7Z0JBQ2xCLFFBQVEsRUFBRSxFQUFFO2dCQUNaLElBQUksRUFBRSxFQUFFO2dCQUNSLFNBQVMsRUFBRSxFQUFFO2dCQUNiLE9BQU8sRUFBRSxFQUFFO2FBQ2Q7WUFDRCxJQUFJO1lBQ0osS0FBSyxFQUFFLEVBQUU7WUFDVCxTQUFTLEVBQUUsRUFBRTtZQUNiLGdCQUFnQixFQUFFLENBQUM7WUFDbkIsVUFBVSxFQUFFLEVBQUU7WUFDZCxZQUFZLEVBQUUsRUFBRTtTQUNuQjtRQUNELFFBQVEsRUFBRSxFQUFFO0tBQ2YsQ0FBQztJQUNGLE9BQU8sT0FBTyxDQUFDO0FBQ25CLENBQUMsQ0FBQyJ9