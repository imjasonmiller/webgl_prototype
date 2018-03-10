import React, { Component } from "react"
import PropTypes from "prop-types"
import { Route, Redirect, withRouter } from "react-router-dom"
import styled, { injectGlobal, ThemeProvider } from "styled-components"
import { connect } from "react-redux"
import { IntlProvider, addLocaleData } from "react-intl"
import { hot } from "react-hot-loader"
import debounce from "lodash/debounce"

import { resizeWindow } from "actions/window"

import { Auth, Game } from "containers"

import localeEN from "react-intl/locale-data/en"
import localeNL from "react-intl/locale-data/nl"

import langEN from "static/messages/en.json"
import langNL from "static/messages/nl.json"

addLocaleData([...localeEN, ...localeNL])
const messages = { en: langEN, nl: langNL }

const theme = {
  // Colors
  cinnabar: "rgb(240, 90, 48)",
  trinidad: "rgb(193, 72, 39)",
  orange: "rgb(251, 163, 10)",
  white: "rgb(255, 255, 255)",
  whitesmoke: "rgb(248, 248, 248)",
  mercury: "rgb(225, 225, 225)",
  silver: "rgb(187, 187, 187)",
  mineshaft: "rgb(51, 51, 51)",
  royalblue: "rgb(61, 136, 232)",
  // Typography
  fontHead: "Roboto, sans-serif",
  fontBody: "'Helvetica Neue', Helvetica, Arial, sans-serif",
}

// Favicon
require("static/images/favicon.ico")

const fontRobotoBlack = require("static/fonts/roboto-v18-latin-900.woff2")

injectGlobal`
  /* Reset */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
  }

  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section, div {
    display: block;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  /* Roboto (900) - latin */
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 900;
    src: local('Roboto Black'), local('Roboto-Black'),
        url(${fontRobotoBlack}) format('woff2'),
  }

  html, body {
    width: 100%;
    height: 100%;
  }

  body {
    margin: 0;
    font: 400 100%/1.5 ${theme.fontBody};
    background: ${theme.cinnabar};
  }

  h2, h3 {
    font: 900 100%/1.5 ${theme.fontHead};
    color: ${theme.orange};
    margin: .5em 0;
  }

  h2 { font-size: 1.5em; }
  h3 { font-size: 1.25em; }

  strong { font-weight: 700 }

  a {
    color: ${theme.white};
    text-decoration: none;
    border-bottom: 3px solid ${theme.orange};
  }

  a:hover { color: ${theme.orange}; }
`
const Main = styled.main`
  position: absolute;
  width: 100%;
  height: 100%;
  color: ${props => props.theme.white};
  overflow-y: ${props => (props.modal ? "hidden" : "auto")};
`

class App extends Component {
  componentDidMount() {
    this.handleResize()
    this.handleResize = debounce(this.handleResize, 500).bind(this)
    window.addEventListener("resize", this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  handleResize() {
    // Get pixel ratio and window size
    this.props.dispatch(
      resizeWindow(
        window.innerWidth,
        window.innerHeight,
        window.devicePixelRatio,
      ),
    )
  }

  render() {
    return (
      <IntlProvider
        locale={this.props.locale}
        messages={messages[this.props.locale]}
      >
        <ThemeProvider theme={theme}>
          <Main>
            <Route
              exact
              path="/"
              render={() =>
                this.props.authenticated ? (
                  <Redirect to="/game" />
                ) : (
                  <Redirect to="/auth" />
                )
              }
            />
            <Route
              path="/auth"
              render={() =>
                this.props.authenticated ? <Redirect to="/" /> : <Auth />
              }
            />
            <Route
              path="/game"
              render={() =>
                this.props.authenticated ? <Game /> : <Redirect to="/auth" />
              }
            />
          </Main>
        </ThemeProvider>
      </IntlProvider>
    )
  }
}

App.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  authenticated: state.player.authenticated,
  locale: state.config.locale,
})

export default withRouter(hot(module)(connect(mapStateToProps)(App)))
