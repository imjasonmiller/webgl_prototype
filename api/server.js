/* eslint-disable global-require */
require("dotenv").config()

const {
  DEV = false,
  APP_HOST = "localhost",
  APP_PORT = 8080,
  DB_USER = "postgres",
  DB_HOST = "localhost",
  DB_PORT = 5432,
  DB_NAME = "webgl_prototype",
} = process.env

// Prepend a colon to the password for a valid connection string
const DB_PASS = process.env.DB_PASS ? `:${process.env.DB_PASS}` : ""

// Logging
const bunyan = require("bunyan")

const log = bunyan.createLogger({ name: "dev server" })

const Koa = require("koa")
const Router = require("koa-router")
const koaStatic = require("koa-static")
const koaBodyparser = require("koa-bodyparser")

const app = new Koa()
const router = new Router()

/**
 * Test the database connection by performing a query
 * @param {Promise} database - The Knex database connection
 * @return {Promise}
 */
const databaseConn = database =>
  database.raw("SELECT 1 + 1 AS result").catch(err => {
    throw new Error(err)
  })

const db = require("knex")({
  client: "pg",
  connection: `postgresql://${DB_USER}${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
})

const routes = require("./routes/login")(router, db)

if (DEV === "true") {
  const webpack = require("webpack")
  const webpackConfig = require("../webpack/webpack.dev.js")
  const koaWebpack = require("koa-webpack")
  const hotServerMiddleware = require("webpack-hot-server-middleware")

  const compiler = webpack(webpackConfig)

  const devHot = koaWebpack({
    compiler,
    dev: {
      publicPath:
        webpackConfig.find(c => c.name === "client").output.publicPath || "/",
      serverSideRender: true,
      stats: { colors: true },
    },
  })

  const hotServer = hotServerMiddleware(compiler, {
    createHandler: hotServerMiddleware.createKoaHandler,
    serverRendererOptions: {
      foo: "Bar",
    },
  })

  app
    .use(koaBodyparser())
    .use(routes)
    .use(router.allowedMethods())
    .use(devHot)
    .use(hotServer)
} else {
  // React server bundle, generated by Webpack
  const server = require("../build/server.js").default

  app
    .use(koaStatic("build/public"))
    .use(koaBodyparser())
    .use(routes)
    .use(router.allowedMethods())
    .use(server())
}

databaseConn(db)
  .then(() => {
    log.info("Connected to the database")

    app.listen(APP_PORT, err => {
      if (err) {
        throw new Error(err)
      }
      log.info(`Listening on http://${APP_HOST}:${APP_PORT}`)
    })
  })
  .catch(err => log.warn({ err }, "Error: %s", err))