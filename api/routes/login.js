const Users = require("./models")

module.exports = (router, connector) => {
  const users = new Users({ connector })

  router
    .post("/api/token", async ctx => {
      await users.createToken(ctx)
    })
    .delete("/api/token", async ctx => {
      await users.deleteToken(ctx)
    })

  return router.routes()
}
