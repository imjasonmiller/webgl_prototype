### 👨‍🔬 Prototype WebGL Application

A prototype of a WebGL application for a school project.

---

There is [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) support. Translations can be found in `src/static/messages`

### npm scripts

#### Creating the database

First make sure that [PostgreSQL](https://www.postgresql.org/download/) is installed. I used version 10.0, but releases that are less recent should also work fine.

```
$ npm run db         # init the webgl_prototype database
```

#### Starting or building the server

Note that `npm run dev` hot reloads and renders universally.

```
$ npm run dev        # start the dev server
$ npm run prod       # build into the build dir
```

#### Environment variables

Make sure to create a `.env` file with the environment variables below, although APP_HTTPS can be left out. For more information, see the [dotenv repository](https://github.com/motdotla/dotenv).

| Option     | Default           |
| ---------- | ----------------- |
| APP_HOST   | `localhost`       |
| APP_PORT   | `8080`            |
| APP_HTTPS  | `false`           |
| APP_SECRET |                   |
| DB_USER    | `postgres`        |
| DB_PASS    |
| DB_HOST    | `localhost`       |
| DB_PORT    | `5432`            |
| DB_NAME    | `webgl_prototype` |

#### Testing

```
$ npm run test       # lint code using ESLint
```
