import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import media from "style-utils/media"
import { FormattedMessage } from "react-intl"
import Animated from "animated/lib/targets/react-dom"

const compassRotation = new Animated.Value(0)

const StyledWrap = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 105px;
  height: 105px;
  ${media.lg`
    width: 150px;
    height: 150px;
  `};
  user-select: none;
  cursor: pointer;
  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.25));
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const Wrap = ({ onClick, children }) => (
  <StyledWrap onClick={onClick}>{children}</StyledWrap>
)

Wrap.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

const Base = styled(Animated.div)`
  will-change: transform;
`

const Dial = styled.svg`
  display: block;
`

const BezelInner = styled.circle`
  fill: ${props => props.theme.white};
  stroke-width: 6;
  stroke: ${props => props.theme.cinnabar};
`

const BezelOuter = styled.circle`
  fill: none;
  stroke-width: 5;
  stroke: ${props => props.theme.orange};
`

const Marker = styled.path`
  fill: ${props => props.theme.cinnabar};
`

const AnimatedDirection = styled(Animated.div)`
  position: absolute;
  text-align: center;
  text-transform: uppercase;
  width: 2em;
  height: 2em;
  color: ${props => props.theme.white};
  font: 900 0.75em/2em ${props => props.theme.fontHead};
  ${media.lg`
    font: 900 1em/2em ${props => props.theme.fontHead};
  `};
  will-change: transform;
`

const North = styled(AnimatedDirection)`
  top: 0;
  left: calc(50% - 1em);
`

const East = styled(AnimatedDirection)`
  top: calc(50% - 1em);
  left: calc(100% - 2em);
`

const South = styled(AnimatedDirection)`
  top: calc(100% - 2em);
  left: calc(50% - 1em);
`

const West = styled(AnimatedDirection)`
  top: calc(50% - 1em);
  left: 0;
`

const Arrow = styled.svg`
  position: absolute;
  width: 30%;
  height: 30%;
  left: calc(50% - 15%);
  top: calc(50% - 15%);
`

const ArrowHead = styled.path`
  fill: ${props => props.theme.royalblue};
`

const ArrowPin = styled.circle`
  fill: ${props => props.theme.white};
  stroke-width: 5;
  stroke: ${props => props.theme.orange};
`
const Compass = ({ cameraRotation, handleCameraRotation }) => {
  const baseRotation = {
    transform: [
      {
        rotate: compassRotation.interpolate({
          inputRange: [0, 360],
          outputRange: ["0deg", "360deg"],
        }),
      },
    ],
  }

  const directionRotation = {
    transform: [
      {
        rotate: compassRotation.interpolate({
          inputRange: [0, 360],
          outputRange: ["360deg", "0deg"],
        }),
      },
    ],
  }

  if (CLIENT) {
    Animated.spring(compassRotation, {
      toValue: cameraRotation,
      tension: 150,
      friction: 100,
    }).start()
  }

  return (
    <Wrap onClick={handleCameraRotation}>
      <Base style={baseRotation}>
        <Dial viewBox="0 0 100 100">
          <BezelInner cx="50" cy="50" r="26" />
          <BezelOuter cx="50" cy="50" r="30" />
          <Marker d="M50,23L55,28L50,33L45,28Z" />
          <Marker d="M72,45L77,50L72,55L67,50Z" />
          <Marker d="M50,67L55,72L50,77L45,72Z" />
          <Marker d="M28,45L33,50L28,55L23,50Z" />
        </Dial>
        <North style={directionRotation}>
          <FormattedMessage defaultMessage="N" id="compass.direction.n" />
        </North>
        <East style={directionRotation}>
          <FormattedMessage defaultMessage="E" id="compass.direction.e" />
        </East>
        <South style={directionRotation}>
          <FormattedMessage defaultMessage="S" id="compass.direction.s" />
        </South>
        <West style={directionRotation}>
          <FormattedMessage defaultMessage="W" id="compass.direction.w" />
        </West>
      </Base>
      <Arrow viewBox="0 0 40 55">
        <ArrowHead d="M20,0L40,50L20,40L0,50Z" />
        <ArrowPin cx="20" cy="27.5" r="8" />
      </Arrow>
    </Wrap>
  )
}

Compass.propTypes = {
  cameraRotation: PropTypes.number.isRequired,
  handleCameraRotation: PropTypes.func.isRequired,
}

export default Compass
