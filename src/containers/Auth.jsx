import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import styled from "styled-components"
import { FormattedMessage } from "react-intl"

const Wrap = styled.div`
  position: relative;
  min-height: 100%;
`
const Header = styled.div`
  width: 370px;
  max-width: 100%;
  margin: auto;
  padding: 0 10px;
`
const Logo = styled.img`
  display: block;
  width: 200px;
`
const logoFile = require("static/images/logo_placeholder.svg")

const Login = styled.form`
  width: 370px;
  max-width: 100%;
  margin: auto;
  padding: 0 10px 300px;
`
const Input = styled.input`
  display: block;
  width: 100%;
  margin: 1em 0;
  padding: 0.5em;
  box-sizing: border-box;
  background: none;
  font: 700 1em/1.5 ${props => props.theme.fontBody};
  color: ${props => props.theme.white};
  outline: 0;
  border: 4px solid ${props => props.theme.orange};
  border-radius: 4px;

  ::placeholder {
    letter-spacing: initial;
    color: ${props => props.theme.orange};
  }
`
const Username = styled(Input)``
const Password = styled(Input)`
  letter-spacing: 0.5em;
`
const Submit = styled(Input)`
  cursor: pointer;
  text-align: left;
  width: auto;
`

class Auth extends Component {
  constructor() {
    super()
    this.state = {
      inputUsername: "",
      inputPassword: "",
    }
  }
  handleSubmit() {
    this.props.dispatch({
      type: "LOGIN_REQUEST",
      user: this.state.inputUsername,
      pass: this.state.inputPassword,
    })
  }

  render() {
    return (
      <Wrap>
        <Header>
          <h1>
            <Logo src={logoFile} />
          </h1>
        </Header>
        <Login>
          <h2>Auth</h2>
          <FormattedMessage
            id="login.intro"
            defaultMessage="Your world is one click away. Enter your details and explore!"
          />
          <Username
            autoComplete="username"
            placeholder="Username"
            onChange={e => {
              this.setState({ inputUsername: e.target.value })
            }}
            type="text"
          />
          <Password
            autoComplete="current-password"
            placeholder="Password"
            onChange={e => {
              this.setState({ inputPassword: e.target.value })
            }}
            type="password"
          />
          <Submit
            onClick={() => this.handleSubmit()}
            value="Login"
            type="button"
          />
        </Login>
      </Wrap>
    )
  }
}

Auth.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(Auth)
