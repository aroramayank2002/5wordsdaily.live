import FB from 'fb';
import React from 'react';

export class FacebookSignin extends React.Component {

    componentWillMount(){
        // FB.init({
        //     appId      : '1726342994127758',
        //     status     : false, // the SDK will attempt to get info about the current user immediately after init
        //     cookie     : false,  // enable cookies to allow the server to access
        //     // the session
        //     xfbml      : false,  // With xfbml set to true, the SDK will parse your page's DOM to find and initialize any social plugins that have been added using XFBML
        //     version    : 'v2.8' // use graph api version 2.5
        // });
    }
    
  
    // fbLogin() {
    //   return new Promise((resolve, reject) => {
    //     FB.login(result => {
    //       if (result.authResponse) {
    //         return this.http.post(`http://localhost:3000/api/v1/auth/facebook`, {access_token: result.authResponse.accessToken})
    //             .toPromise()
    //             .then(response => {
    //               var token = response.headers.get('x-auth-token');
    //               console.log(`token ${token}`)
    //               if (token) {
    //                 localStorage.setItem('id_token', token);
    //               }
    //               resolve(response.json());
    //             })
    //             .catch(() => reject());
    //       } else {
    //         reject();
    //       }
    //     }, {scope: 'public_profile,email'})
    //   });
    // }
  

    handleClick = (event) => {
        console.log(`event ${event.target}`)
        // console.log(`FB.options() ${JSON.stringify(FB.options())}`)
        // console.log(`FB.options('timeout') ${FB.options('timeout')}`)
        console.log(`FB.version ${FB.version}`)
        
        
        
        // this.fbLogin()
        // .then(()=>{
        //     console.log(`Fb login done`)
        // })
    }

    render() {
        return (
            <div>
                <div class="row">
                    <div class="col-lg-8 col-md-7 col-sm-6">
                        <div class="panel panel-default">
                            <div class="panel-heading text-center">Sign in with our Awesome Application</div>
                            <div class="panel-body" align="center">
                                <a class="btn btn-social btn-facebook" onClick={this.handleClick}>
                                    <span class="fa fa-facebook"></span>  Facebook
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}