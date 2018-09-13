import React from 'react';
import {render} from 'react-dom';
import { GoogleLogin } from 'react-google-login';
let credentials = require('../credentials.json'); 

const failureGoogle = (response) => {
  console.log("failureGoogle: response: "+ JSON.stringify(response)); 
  this.setState({token: null});
}
 
export class GoogleSignin extends React.Component {
  state = {
    token: null,
    loginSuccessClass: "",
  }

  responseGoogle = (response) => {
    console.log(response);
    var profile = response.getBasicProfile();
    // console.log(`profile ${JSON.stringify(profile)}`);
    // console.log(`Token ${response.tokenId}`);

    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    this.setState({token: "Login successful.", loginSuccessClass: "fa fa-cog fa-spin"}); //Unique on every login, response.tokenId
    this.props.loginSuccess({"email":profile.getEmail(), "name": profile.getName(), "src": "google", token: response.tokenId});
  }

  logout = (response) => {
    console.log(response);
  }

  render (){
    if(null != this.state.token){
      return (
          <div>
          <label>{this.state.token}<i class={this.state.loginSuccessClass}></i></label>
        </div>
      );
    }else{
      return (
        <div>
         <GoogleLogin 
             clientId={credentials.web.client_id}
             // buttonText="LOGIN WITH GOOGLE"
             onSuccess={this.responseGoogle}
             onFailure={failureGoogle}
         >
         Login With Google
         </GoogleLogin>
       </div>
     );
    }
  }
}