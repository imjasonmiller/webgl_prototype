import React, { Component } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import Animated from "animated/lib/targets/react-dom"
import Easing from "animated/lib/Easing"

const Button = styled.canvas`
  position: absolute;
  top: 1em;
  right: 1em;
  width: 50px;
  height: 50px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

class Close extends Component {
  constructor() {
    super()
    this.ratio = window.devicePixelRatio || 1

    this.arc = new Animated.Value(0)
    this.lineA = new Animated.ValueXY({ x: -40, y: 40 })
    this.lineB = new Animated.ValueXY({ x: -40, y: -40 })

    // These values are consumed by the canvas shapes
    this.arcVal = 0
    this.lineValA = 0
    this.lineValB = 0

    // Listeners will update the values above
    this.arc_ID = this.arc.addListener(({ value }) => {
      this.arcVal = value
    })

    this.lineA_ID = this.lineA.addListener(value => {
      this.lineValA = value
    })

    this.lineB_ID = this.lineB.addListener(value => {
      this.lineValB = value
    })
  }
  componentDidMount() {
    this.ctx = this.canvas.getContext("2d")
    this.ctx.scale(this.ratio, this.ratio)

    // Set styles
    this.ctx.strokeStyle = this.props.color
    this.ctx.lineWidth = 4

    // Start animation
    this.onAnimate()

    Animated.timing(this.arc, {
      toValue: Math.PI * 2,
      delay: 1250,
      duration: 750,
      easing: Easing.out(Easing.circle),
    }).start()

    Animated.sequence([
      Animated.delay(1400),
      Animated.spring(this.lineA, {
        delay: 400,
        toValue: { x: 0, y: 0 },
        speed: 3,
        bounciness: 10,
      }),
    ]).start()

    Animated.sequence([
      Animated.delay(1700),
      Animated.spring(this.lineB, {
        toValue: { x: 0, y: 0 },
        speed: 3,
        bounciness: 10,
      }),
    ]).start()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.raf)

    this.arc.removeListener(this.arc_ID)
    this.lineA.removeListener(this.lineA_ID)
    this.lineB.removeListener(this.lineB_ID)
  }

  onAnimate() {
    // Clear the canvas after each frame
    this.ctx.clearRect(0, 0, 50, 50)

    this.ctx.lineCap = "butt"

    // Circle
    this.ctx.beginPath()
    this.ctx.arc(25, 25, 20, 0, this.arcVal)
    this.ctx.stroke()

    this.ctx.lineCap = "round"

    // Line 1
    this.ctx.beginPath()
    this.ctx.moveTo(20 + this.lineValA.x, 30 + this.lineValA.y)
    this.ctx.lineTo(30 + this.lineValA.x, 20 + this.lineValA.y)
    this.ctx.stroke()

    // Line 2
    this.ctx.beginPath()
    this.ctx.moveTo(20 + this.lineValB.x, 20 + this.lineValB.y)
    this.ctx.lineTo(30 + this.lineValB.x, 30 + this.lineValB.y)
    this.ctx.stroke()

    this.raf = requestAnimationFrame(() => this.onAnimate())
  }

  render() {
    return (
      <Button
        width={this.ratio * 50}
        height={this.ratio * 50}
        onClick={this.props.onHide}
        innerRef={c => {
          this.canvas = c
        }}
      />
    )
  }
}

Close.defaultProps = {
  color: "rgb(240, 90, 48)",
}

Close.propTypes = {
  onHide: PropTypes.func.isRequired,
  color: PropTypes.string,
}

export default Close
