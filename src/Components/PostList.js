import React, { useState, useEffect } from "react";
import axios from "axios";
import PostListing from "./PostListing.js";
import Spinner from "react-spinner-material";
import CreatePost from "./CreatePost.js";
import PopupModal from "./PopupModal.js";

function PostList(props) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState();
  const [popUp, setPopUp] = useState(false);
  const [postPopUp, setPostPopUp] = useState();

  useEffect(() => {
    const source = axios.CancelToken.source();
    handleUpdatePostsList();
    return () => {
      source.cancel();
    };
  }, []);

  function handleViewPost(postID) {
    props.viewPost(postID);
  }

  async function handleUpdatePostsList() {
    setLoading(true);
    try {
      const res = await axios.get("https://spikeball-lfg-backend.herokuapp.com/api/posts/");
      console.log(res);
      const posts = res.data;
      setPosts(posts);
    } catch (err) {
      console.log("error:", err);
    }
    setLoading(false);
  }

  function handleSetGroupSize(postId) {
    setPopUp(true);
    setPostPopUp(postId);
  }

  async function joinGroup(id, partySize) {
    await handleUpdatePostsList();
    console.log("Changing party size of", id);
    try {
      const getURL = "https://spikeball-lfg-backend.herokuapp.com/api/posts/" + id;
      const res = await axios.get(getURL);
      const postJoining = res.data;
      if (postJoining !== undefined) {
        const newCount =
          parseInt(postJoining.peopleAttending) + parseInt(partySize);
        if (newCount <= 4 && newCount >= 0) {
          let config = {
            headers: {
              authtoken: props.token
            }
          };
          let data = {
            postId: postJoining._id,
            peopleAttending: newCount,
            partySize: parseInt(partySize)
          };
          try {
            await axios.patch("https://spikeball-lfg-backend.herokuapp.com/api/posts/peopleAttending", data, config);
            console.log("Party sized changed");
            handleViewPost(id);
          } catch (err) {
            console.log("error:", err);
          }
        } else if (newCount > 4) {
          alert("Your party was too large for this group!");
        } else if (newCount < 0) {
          alert("You can't leave a group with a negative amount of people!");
        } else {
          alert("Error!");
        }
      }
    } catch (err) {
      console.log("error:", err);
    }
  }
  return (
    <div className="pageWrapper">
      <h1>Spikeball Group Finder</h1>
      <div className="welcomeText"> Welcome {props.username}</div>
      <div className="buttonHolder">
        <button className="button" onClick={() => handleUpdatePostsList()}>
          {" "}
          Refresh the List{" "}
        </button>
        <button
          id="logout"
          className="button"
          onClick={() => props.handleLogout()}
        >
          {" "}
          Log out{" "}
        </button>
      </div>
      {loading && (
        <div className="loadingContainer">
          <Spinner
            size={60}
            spinnerColor={"#333"}
            spinnerWidth={2}
            visible={true}
          />
          <br />
        </div>
      )}
      <div className="postsContainer">
        {posts.map(post => (
          <PostListing
            key={post._id}
            post={post}
            joinGroup={() => handleSetGroupSize(post._id)}
          />
        ))}
      </div>
      <br />
      <CreatePost
        token={props.token}
        viewPost={id => handleViewPost(id)}
        handleUpdatePostsList={() => handleUpdatePostsList()}
      />
      <PopupModal
        postId={postPopUp}
        show={popUp}
        onHide={() => setPopUp(false)}
        joinGroup={(postId, groupSize) => joinGroup(postId, groupSize)}
      />
    </div>
  );
}
export default PostList;
