import React from "react";
import axios from "axios";

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);

    const newData = {
      postId: this.props._id,
      title: data.get("title"),
      dateEvent: data.get("dateEvent"),
      location: data.get("location")
    };
    let config = {
      headers: {
        authtoken: this.props.token
      }
    };
    try {
      console.log(this.props.token);
      const res = await axios.patch("https://spikeball-lfg-backend.herokuapp.com/api/posts/wholePost/", newData, config);
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
          <div className="inputLabel"> Event: </div>
          <input
            name="title"
            type="text"
            defaultValue={this.props.title}
            required
          />
          <div className="inputLabel">Location of Event: </div>
          <input
            name="location"
            type="text"
            defaultValue={this.props.location}
            required
          />
          <br />
          <div className="inputLabel"> Date of Event: </div>
          <input
            name="dateEvent"
            type="datetime-local"
            defaultValue={this.props.dateEvent}
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

export default Edit;
