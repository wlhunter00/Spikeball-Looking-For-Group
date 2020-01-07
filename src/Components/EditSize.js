import React from "react";
import axios from "axios";

class EditSize extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);

    const newData = {
      username: this.props.username,
      partySize: data.get("partySize"),
      postId: this.props._id
    };
    let config = {
      headers: {
        authtoken: this.props.token
      }
    };
    try {
      console.log(newData);
      const res = await axios.patch(
        "/api/posts/changePartySize/",
        newData,
        config
      );
      console.log(res);
      if (res.data.type === "Error") {
        alert(res.data.message);
      } else {
        this.props.refreshPost();
      }
    } catch (err) {
      console.log("error:", err);
    }
  }

  render() {
    return (
      <div className="createPost">
        <form onSubmit={this.handleSubmit}>
          <div className="inputLabel"> Party Size: </div>
          <input
            name="partySize"
            type="number"
            min="1"
            max="3"
            defaultValue={this.props.partySize}
            required
          />
          <br />
          <div className="buttonHolder">
            <button className="button">Edit!</button>
          </div>
        </form>
      </div>
    );
  }
}

export default EditSize;
