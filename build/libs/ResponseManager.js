Object.defineProperty(exports, "__esModule", { value: true });
class ResponseManager {
    constructor() {
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*'
        };
    }
    send(status, body = {}, headers = this.defaultHeaders) {
        console.log('RISPOSTA', {
            statusCode: status,
            headers: headers,
            body: JSON.stringify(body)
        });
        return {
            statusCode: status,
            headers: headers,
            body: JSON.stringify(body)
        };
    }
}
exports.default = ResponseManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzcG9uc2VNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYnMvUmVzcG9uc2VNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFxQixlQUFlO0lBQXBDO1FBSVksbUJBQWMsR0FBRztZQUNyQixjQUFjLEVBQUUsa0JBQWtCO1lBQ2xDLDhCQUE4QixFQUFFLEdBQUc7WUFDbkMsNkJBQTZCLEVBQUUsR0FBRztTQUNyQyxDQUFBO0lBYUwsQ0FBQztJQVpHLElBQUksQ0FBQyxNQUFjLEVBQUUsT0FBWSxFQUFFLEVBQUUsVUFBZSxJQUFJLENBQUMsY0FBYztRQUNuRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRTtZQUNwQixVQUFVLEVBQUUsTUFBTTtZQUNsQixPQUFPLEVBQUUsT0FBTztZQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7U0FDN0IsQ0FBQyxDQUFDO1FBQ0gsT0FBTztZQUNILFVBQVUsRUFBRSxNQUFNO1lBQ2xCLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztTQUM3QixDQUFDO0lBQ04sQ0FBQztDQUNKO0FBckJELGtDQXFCQyJ9