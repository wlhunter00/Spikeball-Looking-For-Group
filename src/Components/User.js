import React from "react";


function User(props) {

  return (
    <div className="userDisplay">
      <div> User: {props.username}</div>
      <div> Party Size: {props.partySize}</div>
    </div>
  );
}
export default User;
