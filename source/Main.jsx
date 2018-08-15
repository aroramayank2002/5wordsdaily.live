import React from 'react';
import { GoogleSignin } from './GoogleSignin.jsx';
import { FacebookSignin } from './FacebookSignin.jsx';
// import { FacebookSignin } from './Facebook.jsx';
const axios = require('axios');
import {WordForm} from './WordForm.jsx';
import { Calanader } from './Calander.jsx';
import { List } from './List.jsx';
import { About } from './About.jsx';
import { Quiz } from './Quiz.jsx';
import { Home } from './Home.jsx';

var navStyle = {
  listStyleType: "none",
  margin: "0",
  padding: "0",
  marginTop: ".5em"
}

var listStyle={
  display: "inline",
  margin: ".5em",
  padding: ".3em"
}
var hrStyle={
  // display: "inline",
  margin: ".5em",
  padding: ".3em"
}

class Header extends React.Component {

  handleClick = (event) => {
    event.preventDefault();
    // console.log(event.target);
    if(event.target.className == undefined)return;
    let className = event.target.className;
    // console.log(className);
    className = className.split(" ")[1].split("-")[1];
    // event.target.className glyphicon glyphicon-home
    console.log(className);
    this.props.currentPage(className);
  }

	render() {
    return (
  	<div>
      <nav class="navbar navbar-expand-xs">
        <ul style={navStyle}>
          <li style={listStyle}>
                <a href="#" onClick={this.handleClick} data-value="home" class="h h-home">5 Words Daily</a>
          </li>
          <li style={listStyle}>
                <a href="#" onClick={this.handleClick} data-value="home" aria-hidden="true">
                  <i class="fa fa-plus-square"></i>
                </a></li>
          <li style={listStyle}>
              <a href="#" onClick={this.handleClick} data-value="list" class="glyphicon glyphicon-list" aria-hidden="true">
              <i class="fa fa-list"></i>
              </a></li>
          <li style={listStyle}>
              <a href="#" onClick={this.handleClick} data-value="calendar" class="glyphicon glyphicon-calendar" aria-hidden="true">
              <i class="fa fa-calendar-o"></i>
              </a></li>
          <li style={listStyle}>
              <a href="#" onClick={this.handleClick} data-value="learn" aria-hidden="true">
              <i class="fa fa-heart"></i>
              </a></li>
          <li style={listStyle}>
              <a href="#" onClick={this.handleClick} data-value="settings" class="glyphicon glyphicon-cog" aria-hidden="true">
              <i class="fa fa-cog"></i>
              </a></li>
        </ul>
    </nav>
    <hr style={hrStyle} />
        </div>);
    }
}

var divStyle = {
  textAlign: "center"
};

export class Main extends React.Component {
  state = {
    sessionId: null,
    page: "login",
  }

  page = (pageValue) => {
    //  console.log(`pageValue ${pageValue}`);
     this.setState({page:pageValue});
   }
  
  loginSuccess = (userObject) => {
    // console.log(`userObj : ${JSON.stringify(userObject)}`)
    var self = this;
    axios.post('/api/login', {
      email: userObject.email,
      name: userObject.name,
      token: userObject.token,
      src: userObject.src
    })
    .then(function (response) {
      // console.log(response);
      // console.log(response.data.result.sessionId);
      if(response.data.result.sessionId){
          self.setState({sessionId: response.data.result.sessionId})
          console.log(`Session Id '${response.data.result.sessionId}'`);
        }else{
        console.log("Login failed");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
    
   }

  render (){
    if(this.state.sessionId){
      if(this.state.page === "home"){
        return (
          <div>
            <div className="app-wrapper">
          </div>
            <Header currentPage={this.page}/> 
            <div style={divStyle}>
            <Home sessionId={this.state.sessionId}/>  
            {/* <Calanader /> */}
            </div>
          </div>
        );
      }else if(this.state.page === "plus"){
        return (
          <div>
            <div className="app-wrapper">
          </div>
            <Header currentPage={this.page}/> 
            <div style={divStyle}>
            <WordForm sessionId={this.state.sessionId}/>  
            {/* <Calanader /> */}
            </div>
          </div>
        );
      }else if(this.state.page === "home" || this.state.page === "plus"){
        return (
          <div>
            <div className="app-wrapper">
          </div>
            <Header currentPage={this.page}/> 
            <div style={divStyle}>
            <WordForm sessionId={this.state.sessionId}/>  
            {/* <Calanader /> */}
            </div>
          </div>
        );
      }else if(this.state.page === "calendar"){
        return (
          <div>
            <div className="app-wrapper">
          </div>
            <Header currentPage={this.page}/> 
            <div style={divStyle}>
            <Calanader sessionId={this.state.sessionId} />
            </div>
          </div>
        )
      }else if(this.state.page === "list" || this.state.page === "thumbs"){
        return (
          <div>
            <div className="app-wrapper">
          </div>
            <Header currentPage={this.page}/> 
            <div style={divStyle}>
            <List sessionId={this.state.sessionId}/>
            </div>
          </div>
        )
      }else if(this.state.page === "settings" || this.state.page === "cog"){
        return (
          <div>
            <div className="app-wrapper">
          </div>
            <Header currentPage={this.page}/> 
            <div style={divStyle}>
            <About />
            </div>
          </div>
        )
      }else if(this.state.page === "heart"){
        return (
          <div>
            <div className="app-wrapper">
          </div>
            <Header currentPage={this.page}/> 
            <div style={divStyle}>
            <Quiz sessionId={this.state.sessionId} />
            </div>
          </div>
        )
      }else{
          return (
            <div>
              <div className="app-wrapper">
            </div>
              <Header currentPage={this.page}/> 
              <div style={divStyle}>
              {/* <Quiz sessionId={this.state.sessionId} /> */}
              {/* <Calanader sessionId={this.state.sessionId}/> */}
              {/* <WordForm sessionId={this.state.sessionId}/>  */}
              <Home sessionId={this.state.sessionId}/>  
              
              </div>
            </div>
          );
        }
      }
    else{
      return (
        <div>
            <div className="app-wrapper">
          </div>
          <div>
            <nav class="navbar navbar-expand-xs">
                <ul style={navStyle}>
                  <li style={listStyle}>
                        <a href="#" class="active">5 Words Daily</a>
                  </li>
                </ul>

            </nav>
            <hr style={hrStyle} />
          </div> 
          <div style={divStyle}>
            <GoogleSignin loginSuccess={this.loginSuccess}/>
          <br />
            <FacebookSignin loginSuccess={this.loginSuccess}/>
          </div>
        </div>
      );
    }
  }
}