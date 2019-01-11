import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { userEmailExists } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";
import Spinner from "../common/Spinner";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
      email: this.state.email
    };

    this.props.userEmailExists(userData);
  }

  render() {
    const { errors } = this.state;
    const { PWEmailSent, loading } = this.props.forgotEmail;
    let userContent;
    let successfulContent;

    if (loading) {
      userContent = <Spinner />;
    } else {
      userContent = (
        <div>
          <h1 className="display-4 text-center">Forgot Password</h1>
          <form onSubmit={this.onSubmit}>
            <TextFieldGroup
              placeholder="Email Address"
              name="email"
              type="email"
              value={this.state.email}
              onChange={this.onChange}
              error={errors.email}
            />
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      );
    }

    successfulContent = (
      <div className="display-4 text-center">
        <h>Email Sent</h>
        <p className="lead text-center">
          Please follow the link in the email in order to change your password.
        </p>
        <Link to="/login" className="btn btn-info btn-lg btn-block">
          Login
        </Link>
      </div>
    );

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto" hidden={PWEmailSent}>
              {userContent}
            </div>
            <div className="col-md-5 m-auto" hidden={!PWEmailSent}>
              {successfulContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  userEmailExists: PropTypes.func.isRequired,
  forgotEmail: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  forgotEmail: state.forgotEmail,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { userEmailExists }
)(Login);
