import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import styled from "styled-components"
import Animated from "animated/lib/targets/react-dom"

import WearData from "static/avatar/wear"

const Wrap = styled.div`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`
const Wear = Wrap.withComponent("svg")

class AvatarViewWear extends Component {
  constructor(props) {
    super(props)

    const { wearColor, wearOption } = props

    this.wearAnimVal = new Animated.Value(0)

    this.interpolate = this.wearAnimVal.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "-100%"],
    })

    this.state = {
      wearContent: WearData.options[wearOption].data(
        WearData.colors[wearColor],
      ),
    }
  }

  componentWillReceiveProps(nextProps) {
    Animated.spring(this.wearAnimVal, {
      toValue: 1,
      tension: 12,
      friction: 7,
    }).start(() => {
      const nextColor = WearData.colors[nextProps.wearColor]
      const nextOption = nextProps.wearOption

      this.setState(() => ({
        wearContent: WearData.options[nextOption].data(nextColor),
      }))

      Animated.spring(this.wearAnimVal, {
        toValue: 0,
        tension: 12,
        friction: 7,
      }).start()
    })
  }

  render() {
    return (
      <Wrap>
        <Animated.div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: [{ translateY: this.interpolate }],
          }}
        >
          <Wear viewBox="0 0 500 500">
            <rect width="500" height="500" x="0" y="0" fill="none" />
            {this.state.wearContent}
          </Wear>
        </Animated.div>
      </Wrap>
    )
  }
}

AvatarViewWear.propTypes = {
  wearColor: PropTypes.number.isRequired,
  wearOption: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  wearColor: state.player.wearColor,
  wearOption: state.player.wearOption,
})

export default connect(mapStateToProps)(AvatarViewWear)
