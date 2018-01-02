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
    .get("/api/player/me", async ctx => {
      await users.getPlayer(ctx)
    })

  return router.routes()
}
