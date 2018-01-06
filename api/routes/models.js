require("dotenv").config()

const { APP_SECRET } = process.env

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Tokens = require("csrf")

const tokens = new Tokens()

class Users {
  constructor({ connector }) {
    this.connector = connector
  }

  static verifyToken(token, xsrf) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, APP_SECRET, (err, payload) => {
        if (err) {
          reject(err)
        } else if (!tokens.verify(payload.xsrf, xsrf)) {
          reject(new Error("Token mismatch"))
        }

        resolve(payload)
      })
    })
  }

  createToken(ctx) {
    const { user, pass } = ctx.request.body

    return this.connector("players")
      .first(
        "player_name as name",
        "player_pass as pass",
        "player_locale as locale",
      )
      .where("player_name", user)
      .then(async res => {
        if (res && (await bcrypt.compare(pass, res.pass))) {
          const xsrfSecret = await tokens.secret()
          const xsrfToken = tokens.create(xsrfSecret)

          const token = jwt.sign(
            {
              sub: res.name,
              xsrf: xsrfSecret,
              locale: res.locale,
            },
            APP_SECRET,
            {
              algorithm: "HS512",
              expiresIn: 60,
            },
          )

          ctx.cookies.set("token", token, { httpOnly: true, maxAge: 600000 })
          ctx.cookies.set("xsrf", xsrfToken, {
            httpOnly: false,
            maxAge: 600000,
          })

          ctx.body = { token }
        } else {
          // Invalid login returns a 401 Unauthorized
          ctx.status = 401
        }
      })
      .catch(err => ctx.throw(500, err.message))
  }

  deleteToken(ctx) {
    return this.constructor
      .verifyToken(ctx.cookies.get("token"), ctx.header.xsrf)
      .then(
        () => {
          // Delete cookies via expiration
          ctx.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date("Thu, 01 Jan 1970 00:00:00 GMT"),
          })
          ctx.cookies.set("xsrf", "", {
            httpOnly: false,
            expires: new Date("Thu, 01 Jan 1970 00:00:00 GMT"),
          })
          ctx.status = 200
        },
        () => {
          ctx.status = 401
        },
      )
      .catch(err => ctx.throw(500, err.message))
  }

  getPlayer(ctx) {
    return this.constructor
      .verifyToken(ctx.cookies.get("token"), ctx.request.get("xsrf"))
      .then(token =>
        this.connector("players")
          .first(
            "player_name as name",
            "player_locale as locale",
            "player_terrain as terrain",
          )
          .where("player_name", token.sub)
          .then(res => {
            ctx.body = {
              time: Date.now(),
              locale: res.locale,
              terrain: res.terrain,
            }
          }),
      )
      .catch(err => {
        ctx.throw(401, err.message)
        // ctx.redirect("/auth")
      })
  }
}

module.exports = Users
