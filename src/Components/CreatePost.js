import React from "react";
import axios from "axios";

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);

    const newData = {
      title: data.get("title"),
      dateEvent: data.get("dateEvent"),
      peopleAttending: data.get("peopleAttending"),
      location: data.get("location")
    };
    let config = {
      headers: {
        authtoken: this.props.token
      }
    };
    let success = false;
    let id = "";
    try {
      await axios.post("/api/posts", newData, config).then(function(response) {
        if (response.data.name === "ValidationError") {
          alert(response.data.message);
          success = false;
        } else {
          success = true;
          id = response.data._id;
        }
      });
    } catch (err) {
      console.log("error:", err);
    }
    if (success) {
      this.props.viewPost(id);
    } else {
      this.props.handleUpdatePostsList();
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
          <br/>
          <div className="inputLabel">Location of Event: </div>
          <input
            name="location"
            type="text"
            defaultValue={this.props.location}
          />
          <br/>
          <div className="inputLabel">Date of Event:</div>
          <input
            name="dateEvent"
            type="datetime-local"
            required
            defaultValue={this.props.dateEvent}
          />
          <br/>
          <div className="inputLabel">Current Party Size: </div>
          <input
            name="peopleAttending"
            type="number"
            min="1"
            max="3"
            required
          />
          <br/>
          <div className="buttonHolder">
            <button className="button">Create Group!</button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreatePost;
