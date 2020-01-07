import React from "react";

function PostListing(props) {
  return (
    <div className="PostListing">
      <div> Title: {props.post.title}</div>
      {props.post.creator != null && <div> Creator: {props.post.creator}</div>}
      {props.post.location != null && (
        <div> Location: {props.post.location}</div>
      )}
      {props.post.dateEvent != null && (
        <div> Date Event: {props.post.dateEvent}</div>
      )}
      {props.post.peopleAttending != null && (
        <div> People Attending: {props.post.peopleAttending}</div>
      )}
      <div className="buttonHolder">
        <button className="button" onClick={() => props.joinGroup()}>
          Join Group
        </button>
      </div>
    </div>
  );
}
export default PostListing;
