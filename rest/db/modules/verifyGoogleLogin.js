const { OAuth2Client } = require('google-auth-library');
let credentials = require('../../../credentials.json');
const client = new OAuth2Client(credentials.web.client_id);

function verify(token) {
    return new Promise((resolve, reject) => {
        console.log(`token: ${token}`);
        client.verifyIdToken({
            idToken: token,
            audience: credentials.web.client_id
        })
        .then((ticket) =>{
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            console.log(`payload ${JSON.stringify(payload)}`);
            //Payload   {"azp":"147974662338-n8n8behb4vv6td1ufbfpeuirf6jp0frh.apps.googleusercontent.com","aud":"147974662338-n8n8behb4vv6td1ufbfpeuirf6jp0frh.apps.googleusercontent.com","sub":"109322166706308794881","email":"aroramayank2002@gmail.com","email_verified":true,"at_hash":"fRUet2SPAbv6SV2whR9kWA","exp":1533903770,"iss":"accounts.google.com","jti":"ec6ee0c30b616af4d9bd58b209c54dc6bcdadff5","iat":1533900170,"name":"Mayank Arora","picture":"https://lh6.googleusercontent.com/-xTKCuPLD4f8/AAAAAAAAAAI/AAAAAAAANqY/rdqVhuHBUas/s96-c/photo.jpg","given_name":"Mayank","family_name":"Arora","locale":"en"}
            resolve(payload.email);
        }).catch((error) =>{
            reject(error);
        });
    });
  }

function verifyUser(requestObject) {
    return verify(requestObject.token)
        .then((response) => {
            console.log(`response ${JSON.stringify(response)}`);
            return response;
        }).catch((error) => {
            console.log(`error ${error}`);
        })
}

module.exports = {
    verifyUser: verifyUser,
}
