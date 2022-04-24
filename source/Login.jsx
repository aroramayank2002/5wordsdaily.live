import React from 'react';
const axios = require('axios');
const styles = require('./util/styles.js');
const restUtil = require('./util/restUtil.js');

const instance = axios.create();
instance.defaults.timeout = 4000;

let inputText = {
    margin: "0 auto",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: ".5em",
    marginBottom: ".5em",
    maxWidth: "20em"
};

let divStyle = {
    margin: "0 auto",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "20em"
};

const Heading = (props) => {
    return (
        <div className="text-center">
            <h4>Login</h4>
        </div>
    );
};

const spanStyle = {
    padding: ".3em",
    borderColor: "#aaa",
    borderRadius: '.2em'
};

const divBorder = {
    display: "inline-block",
    backgroundColor: "#ddd",
    borderRadius: '.3em',
    margin: ".1em"
};

const inputStyle = {
    padding: ".3em",
    border: "thin solid #ddd",
    borderRadius: '.5em',
    margin: ".5em",
    fontSize: "1em",
};

export class Login extends React.Component {
    state = {
        username: "",
        password: ""
    }
    spinnerClass = "fa fa-cog fa-spin";

    handleClick = (event) => {
      // Prevent page reload
      event.preventDefault();
      let self = this;
      var { username, password } = document.forms[0];
      console.log(username.value);
      console.log(password.value);
      this.setState({loginSuccessClass: "fa fa-cog fa-spin"});
      instance.post('/api/login', {
        username: username.value,
        password: password.value,
        src: "username"
      })
        .then(function (response) {
          // console.log(`Submit quiz response: ${JSON.stringify(response)}`);
          console.log(`Login response: ${JSON.stringify(response.data.result)}`);

          if(response.data.result.msg == "Login failed"){
              alert("Login failed");
          }else{
            self.setState({token: "Login successful.", loginSuccessClass: ""});
            self.props.loginSuccess({"name": username.value, "email": username.value, "password":password.value,  "src": "verifylogin", token: response.sessionId});
          }

        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          self.setState({ submitClass: "" });
        });


    };

    closeModal = () => {
        this.setState({ openModal: false, style: styles.spanStyle });
      }

    render() {
        return (
            <div class="container">
                <Heading />
                <form>
                    <input style={inputStyle} type="text" name="username" placeholder="username"  />
                    <br />
                    <input style={inputStyle} type="text" name="password" placeholder="password"  />
                    <br />
                    <button
                        className="btn btn-primary"
                        name="submit"
                        onClick={this.handleClick}>Login <i class={this.state.loginSuccessClass}></i></button>
                    <br />
                </form>

            </div>
        );
    }
}
