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
        } else if (payload.xsrf !== xsrf) {
          reject(new Error("Invalid xsrf"))
        }

        resolve(payload)
      })
    })
  }

  createToken(ctx) {
    const { user, pass } = ctx.request.body

    return this.connector("users")
      .first("user_name as name", "user_pass as pass")
      .where("user_name", user)
      .then(res => {
        if (res && bcrypt.compareSync(pass, res.pass)) {
          const xsrf = tokens.create("?s789#3msd823!x")
          const token = jwt.sign(
            {
              xsrf,
              // id: res.id,
              sub: res.name,
            },
            APP_SECRET,
            {
              algorithm: "HS512",
              expiresIn: 60,
            },
          )

          ctx.cookies.set("token", token, { httpOnly: true, maxAge: 600000 })
          ctx.cookies.set("xsrf", xsrf, { httpOnly: false, maxAge: 600000 })

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
}

module.exports = Users
