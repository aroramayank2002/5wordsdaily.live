import React from 'react';
import {render} from 'react-dom';
import FacebookLogin from 'react-facebook-login';
 
export class FacebookSignin extends React.Component {
  state = {
    token: null
  }

  componentClicked = (event) =>{
    console.log(event.name);
  }

  responseFacebook = (response) => {
    console.log('Response: ' + response);
    console.log('Name: ' + response.name);
    console.log('Email: ' + response.email);
    console.log('Id: ' + response.id);
    console.log('AccessToken: ' + response.accessToken);
    if(response.email){
      this.setState({token: response.accessToken});
    this.props.loginSuccess({"email":response.email, "name": response.name, "src": "facebook"});
    }else{
      console.log(`Facebook login failed`);
    }
    
  }

  // 1726342994127758
  // 674149136261287
  render(){
    return (
    <div>
      <FacebookLogin
      appId="1726342994127758"
      autoLoad={false}
      fields="name,email,picture"
      icon="fa-facebook"
      onClick={this.componentClicked}
      callback={this.responseFacebook} />
     <br/>
     <label>{this.state.accessToken}</label>
    </div>
    )
  }
}