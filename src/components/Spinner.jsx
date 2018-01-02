import React, { Component } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import debounce from "lodash/debounce"

/**
 * To account for the increase in width after rotation, the
 * canvas is scaled down by width / hypotenuse ≈ 0.7071067
 */
const Canvas = styled.canvas`
  display: block;
  margin: auto;
  transform: scale(0.7071067) rotate(-45deg);
`

class Spinner extends Component {
  componentDidMount() {
    this.ctx = this.canvas.getContext("2d")

    // The <svg>'s <path> is used for coords and length info
    this.pathOffset = 0
    this.pathLength = this.path.getTotalLength()

    // Set canvas size on mount and resize
    this.handleResize()
    this.handleResize = debounce(this.handleResize, 500).bind(this)
    window.addEventListener("resize", this.handleResize)

    // Draw canvas
    this.drawCanvas()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
    window.cancelAnimationFrame(this.raf)
  }

  /**
   * Get the coordinates for the plug and socket
   * An angle can be calculated using these two coords
   * Offset of 4 is added to prevent rotational stutter
   */
  getCoords() {
    this.plugNextCoords = this.path.getPointAtLength(this.pathOffset)
    this.plugPrevCoords = this.path.getPointAtLength(
      (this.pathOffset + 4) % this.pathLength,
    )
    this.socketNextCoords = this.path.getPointAtLength(
      (this.pathOffset + 14) % this.pathLength,
    )
    this.socketPrevCoords = this.path.getPointAtLength(
      (this.pathOffset + 18) % this.pathLength,
    )
  }

  drawCord() {
    // Spacing along the cord between the plug and socket
    this.ctx.setLineDash([this.pathLength - 20, 20])
    this.ctx.lineDashOffset = -(this.pathOffset + 16)

    // Draw the cord
    this.ctx.beginPath()
    this.ctx.moveTo(50, 50)
    this.ctx.lineTo(50, 70)
    this.ctx.arc(70, 70, 20, Math.PI, -Math.PI / 2, true)
    this.ctx.lineTo(30, 50)
    this.ctx.arc(30, 30, 20, Math.PI / 2, 0)
    this.ctx.lineTo(50, 50)
    this.ctx.stroke()
    this.ctx.closePath()
  }

  drawPlug() {
    // Save canvas transforms
    this.ctx.save()

    // Simplify drawing by translating, rotating canvas around object
    this.ctx.translate(this.plugNextCoords.x, this.plugNextCoords.y)
    this.ctx.rotate(
      Math.atan2(
        this.plugNextCoords.y - this.plugPrevCoords.y,
        this.plugNextCoords.x - this.plugPrevCoords.x,
      ) -
        Math.PI / 2,
    )

    // Draw the plug
    this.ctx.beginPath()
    this.ctx.arc(0, 0, 8, 0, Math.PI)
    this.ctx.rect(-4.8, -8, 3.2, 8)
    this.ctx.rect(1.6, -8, 3.2, 8)
    this.ctx.fill()

    // Restore canvas transforms
    this.ctx.restore()
  }

  drawSocket() {
    // Save canvas transforms
    this.ctx.save()

    // Simplify drawing by translating, rotating canvas around object
    this.ctx.translate(this.socketNextCoords.x, this.socketNextCoords.y)
    this.ctx.rotate(
      Math.atan2(
        this.socketNextCoords.y - this.socketPrevCoords.y,
        this.socketNextCoords.x - this.socketPrevCoords.x,
      ) +
        Math.PI / 2,
    )

    // Draw the socket
    this.ctx.beginPath()
    this.ctx.arc(0, 0, 8, 0, Math.PI)
    this.ctx.fill()

    // Restore canvas transforms
    this.ctx.restore()
  }

  handleResize() {
    // Value ranging from 0—100
    const size = Math.min(Math.max(0, this.props.size), 100)

    const width = this.canvas.parentNode.clientWidth
    const pixelRatio = window.devicePixelRatio
    const scaleRatio = Math.max(width * (size / 100) / 100, 1)

    this.canvas.style.width = `${width * (size / 100)}px`
    this.canvas.style.height = `${width * (size / 100)}px`

    this.canvas.width = 100 * scaleRatio * pixelRatio
    this.canvas.height = 100 * scaleRatio * pixelRatio

    this.ctx.scale(scaleRatio * pixelRatio, scaleRatio * pixelRatio)

    // Canvas styles
    this.ctx.lineWidth = 8
    this.ctx.fillStyle = this.props.color
    this.ctx.strokeStyle = this.props.color
  }

  drawCanvas() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Update pathOffset
    this.pathOffset = (this.pathOffset + this.props.speed) % this.pathLength

    // Get coordinates for the plug and socket
    this.getCoords()

    // Draw objects
    this.drawCord()
    this.drawPlug()
    this.drawSocket()

    this.raf = window.requestAnimationFrame(() => this.drawCanvas())
  }

  render() {
    return (
      <Canvas
        innerRef={c => {
          this.canvas = c
        }}
      >
        <svg viewBox="0 0 100 100">
          <path
            ref={c => {
              this.path = c
            }}
            d="m50,50v20a20,20,0,1,0,20,-20h-40a20,20,0,1,1,20,-20z"
          />
        </svg>
      </Canvas>
    )
  }
}

Spinner.defaultProps = {
  color: "rgb(251, 163, 10)",
  size: 100,
  speed: 1,
}

Spinner.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  speed: PropTypes.number,
}

export default Spinner
