import React from "react";
import axios from "axios";

class LoginPage extends React.Component {
  constructor() {
    super();
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }
  async handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const newData = {
      username: data.get("username"),
      password: data.get("password")
    };
    try {
      const res = await axios.post("https://spikeball-lfg-backend.herokuapp.com/api/user/login/", newData);
      if (res.data.type === "Error") {
        alert(res.data.message);
      } else {
        console.log("whole response:", res);
        console.log("data message", res.data.message);
        console.log("header", res.headers);
        console.log("token", res.headers.authtoken);
        this.props.handleLogin(res.data.message, res.headers.authtoken);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  }

  async handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const newData = {
      username: data.get("username"),
      password: data.get("password"),
      email: data.get("email")
    };
    try {
      const res = await axios.post("https://spikeball-lfg-backend.herokuapp.com/api/user/register/", newData);
      if (res.data.type === "Error") {
        alert(res.data.message);
      } else {
        this.props.handleLogin(res.data.message, res.headers.authtoken);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  }

  render() {
    return (
      <div className="loginPage">
        <h1>Hello! Please Login or Sign Up!</h1>
        <div className="signIn">
          <h2> Sign In! </h2>
          <form onSubmit={this.handleLogin}>
            Username: <input name="username" type="text" />
            Password <input name="password" type="password" />
            <div className = "buttonHolder">
            <button className = "button">Log in!</button>
            </div>
          </form>
        </div>
        <div className="signUp">
          <h2> Signup! </h2>
          <form onSubmit={this.handleSignup}>
            Username: <input name="username" type="text" />
            Email: <input name="email" type="email" />
            Password <input name="password" type="password" />
            <div className = "buttonHolder">
            <button className = "button" >Sign Up!</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginPage;
