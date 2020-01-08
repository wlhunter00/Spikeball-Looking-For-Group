import React, { useState, useEffect } from "react";
import "./App.css";
import PostList from "./Components/PostList.js";
import LoginPage from "./Components/LoginPage.js";
import ViewPost from "./Components/ViewPost.js";

function App() {
  const [display, setDisplay] = useState(localStorage.getItem("LoginPage");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState();
  const [viewPostId, setViewPostId] = useState(
    localStorage.getItem("viewPostId") || ""
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  useEffect(() => {
    if (token === "") {
      setDisplay("LoginPage");
    }
    localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    if (user !== undefined) {
      setUsername(user.username);
      localStorage.setItem("username", user.username);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("viewPostId", viewPostId);
  }, [viewPostId]);

  useEffect(() => {
    if (display !== "ViewPost") {
      setViewPostId("");
    }
    localStorage.setItem("display", display);
  }, [display]);

  function handleViewPost(postId) {
    console.log("viewing:", postId);
    setViewPostId(postId);
    setDisplay("ViewPost");
  }
  function handleLogin(newUser, newToken) {
    delete newUser.authtoken;
    setUser(newUser);
    setToken(newToken);
    setDisplay("PostList");
  }
  function handleBackToMain() {
    setDisplay("PostList");
  }

  function handleLogout() {
    setToken("");
    setUser("");
  }
  if (display === "PostList") {
    return (
      <div className="App">
        <PostList
          username={username}
          token={token}
          viewPost={postId => handleViewPost(postId)}
          handleLogout={() => handleLogout()}
        />
      </div>
    );
  } else if (display === "LoginPage") {
    return (
      <div className="App">
        <LoginPage
          handleLogin={(newUser, newToken) => handleLogin(newUser, newToken)}
        />
      </div>
    );
  } else if (display === "ViewPost") {
    return (
      <div className="App">
        <ViewPost
          postId={viewPostId}
          username={username}
          token={token}
          backToMain={() => handleBackToMain()}
        />
      </div>
    );
  } else {
    return null;
  }
}

export default App;
