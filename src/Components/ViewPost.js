import React, { useState, useEffect } from "react";
import axios from "axios";
import User from "./User.js";
import Edit from "./Edit.js";
import EditSize from "./EditSize.js";

function ViewPost(props) {
  const [post, setPost] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isOwner, setisOwner] = useState(false);
  const [editEnabled, setEdit] = useState(false);
  const [editSize, setEditSize] = useState(false);

  async function handleUpdatePost() {
    try {
      const url = "https://spikeball-lfg-backend.herokuapp.com/api/posts/api/posts/" + props.postId + "/";
      console.log(url);
      const res = await axios.get(url);
      console.log(res);
      setPost(res.data);
      setLoaded(true);
      if (props.username === res.data.creator) {
        setisOwner(true);
      } else {
        setisOwner(false);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  }

  async function editDetails() {
    if (editEnabled) {
      setEdit(false);
      handleUpdatePost();
    } else {
      setEdit(true);
      handleUpdatePost();
    }
  }

  async function deletePost(id) {
    console.log("deleting", id, props.token);
    try {
      await axios.delete("https://spikeball-lfg-backend.herokuapp.com/api/posts/api/posts/", {
        headers: {
          authtoken: props.token
        },
        data: {
          postId: id
        }
      });
    } catch (err) {
      console.log("error:", err);
    }
    console.log("deleted");
    props.backToMain();
  }

  async function leaveGroup(id) {
    let config = {
      headers: {
        authtoken: props.token
      }
    };
    let data = {
      postId: id
    };
    try {
      var res = await axios.patch("https://spikeball-lfg-backend.herokuapp.com/api/posts/api/posts/leaveGroup", data, config);
      console.log("left group", res);
    } catch (err) {
      console.log("error:", err);
    }
    props.backToMain();
  }

  function editGroupSize() {
    if (editSize) {
      setEditSize(false);
      handleUpdatePost();
      console.log("closing");
    } else {
      setEditSize(true);
      handleUpdatePost();
      console.log("opening");
    }
  }

  useEffect(() => {
    setLoaded(false);
    const source = axios.CancelToken.source();
    handleUpdatePost();
    console.log(post);
    return () => {
      source.cancel();
    };
  }, []);

  return (
    <div className="viewPost">
      <div>
        <h1>{post.title}</h1>
        <h2> People in group: {post.peopleAttending}</h2>
        <h2> Location: {post.location} </h2>
        <h2>Date: {post.dateEvent}</h2>
        {loaded &&
          post.usersJoined.map(user => (
            <User
              key={user._id}
              username={user.username}
              partySize={user.partySize}
            />
          ))}
        <div className="buttonHolder">
          <button className="button" onClick={() => handleUpdatePost()}>
            Refresh Group
          </button>
          <button className="button" onClick={() => leaveGroup(post._id)}>
            Leave Group
          </button>
          <button className="button" onClick={() => editGroupSize()}>
            Edit Group Size
          </button>
          {isOwner === true && (
            <button className="button" onClick={() => deletePost(post._id)}>
              Delete Group
            </button>
          )}
          {isOwner === true && (
            <button className="button" onClick={() => editDetails()}>
              Edit Details
            </button>
          )}
        </div>
        {editEnabled === true && (
          <Edit
            title={post.title}
            location={post.location}
            dateEvent={post.dateEvent}
            _id={post._id}
            token={props.token}
            refreshPost={() => editDetails()}
          />
        )}
        {editSize === true && (
          <EditSize
            username={props.username}
            token={props.token}
            refreshPost={() => editGroupSize()}
            _id={post._id}
          />
        )}
      </div>
    </div>
  );
}

export default ViewPost;
