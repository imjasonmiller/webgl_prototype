import React, { Component } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import Animated from "animated/lib/targets/react-dom"

import Close from "./Close"

const Wrap = styled.div`
  position: fixed;
  width: 690px;
  max-width: calc(100% - 20px);
  height: calc(100% - 20px);
  max-height: 480px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: ${props => props.opacity};
  margin: auto;
`

const Background = styled(Animated.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  tranform: scaleX(0);
  transform-origin: 0;
  background: ${props => props.theme.cinnabar};
`

const Foreground = styled(Animated.div)`
  display: flex;
  flex-direction: column;
  padding: 1em;
  height: 100%;
  background: ${props => props.theme.white};
`

const Header = styled.header`
  padding-left: 1em;
`

const Heading = styled.h2`
  min-height: 60px;
  margin: 0 2em 0 0;
  color: ${props => props.theme.yellow};
`

const Content = styled.div`
  position: relative;
  padding: 0 1em;
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scroling: touch;
  color: ${props => props.theme.mineshaft};
`

class Modal extends Component {
  constructor() {
    super()
    this.state = {
      showModal: false,
    }

    this.backgroundIndex = new Animated.Value(0)
    this.backgroundScaleX = new Animated.Value(0)
    this.foregroundOpacity = new Animated.Value(0)
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      if (nextProps.isOpen) {
        this.setState({ showModal: true })

        Animated.sequence([
          Animated.timing(this.backgroundIndex, {
            toValue: 1,
            duration: 0,
          }),
          Animated.spring(this.backgroundScaleX, {
            toValue: 0.5,
            tension: 250,
            friction: 30,
          }),
          Animated.timing(this.foregroundOpacity, {
            toValue: 1,
            duration: 0,
          }),
          Animated.spring(this.backgroundScaleX, {
            toValue: 1,
            tension: 250,
            friction: 30,
          }),
          Animated.timing(this.backgroundIndex, {
            toValue: 0,
            duration: 0,
          }),
        ]).start()
      } else {
        Animated.sequence([
          Animated.timing(this.backgroundIndex, {
            toValue: 1,
            duration: 0,
          }),
          Animated.spring(this.backgroundScaleX, {
            toValue: 0.5,
            tension: 250,
            friction: 30,
          }),
          Animated.timing(this.foregroundOpacity, {
            toValue: 0,
            duration: 0,
          }),
          Animated.spring(this.backgroundScaleX, {
            toValue: 0,
            tension: 250,
            friction: 30,
          }),
        ]).start(() => this.props.handleHide())
      }
    }
  }

  componentWillUnmount() {}

  render() {
    const backgroundStyle = {
      transform: [
        {
          scaleX: this.backgroundScaleX.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ["0", "1", "0"],
          }),
        },
      ],
      transformOrigin: this.backgroundScaleX.interpolate({
        inputRange: [0, 0.5, 0.5, 1],
        outputRange: ["0%", "0%", "100%", "100%"],
      }),
      zIndex: this.backgroundIndex,
    }

    const foregroundStyle = {
      opacity: this.foregroundOpacity,
    }

    return this.state.showModal ? (
      <Wrap>
        <Background style={backgroundStyle} />
        <Foreground style={foregroundStyle}>
          <Header>
            <Heading>{this.props.heading}</Heading>
            <Close onHide={this.props.handleHide} />
          </Header>
          <Content>{this.props.children}</Content>
        </Foreground>
      </Wrap>
    ) : null
  }
}

Modal.defaultProps = {
  heading: "",
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  handleHide: PropTypes.func.isRequired,
  heading: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
}

export default Modal
