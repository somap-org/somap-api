export default class ResponseManager {
    private status: number;
    private message: string;
    private body: any;
    private defaultHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
    }
    send(status: number, body: any = {}, headers: any = this.defaultHeaders) {
        /*console.log({
            statusCode: status,
            headers: headers,
            body: JSON.stringify(body)
        });*/
        return {
            statusCode: status,
            headers: headers,
            body: JSON.stringify(body)
        };
    }
}
