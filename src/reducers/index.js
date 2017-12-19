import { combineReducers } from "redux"

import config from "./config"
import player from "./player"
import window from "./window"

export default combineReducers({
  config,
  player,
  window,
})
