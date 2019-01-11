import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUserByXid } from "../../actions/authActions";
import { userPWUpdate } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";
import Spinner from "../common/Spinner";

class ChangePassword extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      password2: "",
      hidePWDIV: false,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getUserByXid(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      id: this.props.forgotEmail.user.id,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.userPWUpdate(userData);
  }

  render() {
    const { errors } = this.state;
    const { user, PWSaved, loading } = this.props.forgotEmail;
    let userContent;
    let successfulContent;

    if (user === null || loading) {
      userContent = <Spinner />;
    } else {
      userContent = (
        <div>
          <h1 className="display-4 text-center">Change Password</h1>
          <p className="lead text-center">{user.name}</p>
          <form onSubmit={this.onSubmit}>
            <TextFieldGroup
              placeholder="Password"
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.onChange}
              error={errors.password}
            />
            <TextFieldGroup
              placeholder="Confirm Password"
              name="password2"
              type="password"
              value={this.state.password2}
              onChange={this.onChange}
              error={errors.password2}
            />
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      );
    }

    successfulContent = (
      <div>
        <h className="display-4 text-center">
          Password Changed Successfully <br />
        </h>
      </div>
    );

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto" hidden={PWSaved}>
              {userContent}
            </div>
            <div className="col-md-9 m-auto" hidden={!PWSaved}>
              {successfulContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ChangePassword.propTypes = {
  getUserByXid: PropTypes.func.isRequired,
  forgotEmail: PropTypes.object.isRequired,
  userPWUpdate: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  forgotEmail: state.forgotEmail,
  userPWUpdate: state.userPWUpdate,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getUserByXid, userPWUpdate }
)(ChangePassword);
