import React from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router-dom"
import { ServerStyleSheet, StyleSheetManager } from "styled-components"
import { Provider } from "react-redux"

import jwt from "jsonwebtoken"

import App from "./containers/App"

import configureStore from "./store"

require("dotenv").config()

const { APP_SECRET } = process.env

const server = () => async ctx => {
  const store = configureStore()
  const initialState = store.getState()

  jwt.verify(
    ctx.cookies.get("token"),
    APP_SECRET,
    { algorithms: ["HS512"] },
    (err, data) => {
      if (!err) {
        initialState.player.authenticated = true
        initialState.config.locale = data.locale
      } else {
        initialState.config.locale = ctx.acceptsLanguages(
          "en",
          "hr",
          "nl",
          "pt",
        )
      }
    },
  )

  const context = {}
  const styleSheet = new ServerStyleSheet()
  const renderString = await renderToString(
    <Provider store={store}>
      <StaticRouter location={ctx.url} context={context}>
        <StyleSheetManager sheet={styleSheet.instance}>
          <App />
        </StyleSheetManager>
      </StaticRouter>
    </Provider>,
  )

  if (context.url) {
    ctx.redirect(context.url)
  } else {
    const styleTags = styleSheet.getStyleTags()

    ctx.type = "html"
    ctx.body = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0">
          <meta name="apple-mobile-web-app-capable" content="yes">
          <title>Prototype WebGL Game</title>
          ${styleTags}
        </head>
        <body>
          <div id="root">${renderString}</div>
          <script>window.initialState = ${JSON.stringify(initialState)}</script>
          <script src="/client.js"></script>
        </body>
      </html>
    `
  }
}

export default server
