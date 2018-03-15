import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const Icon = styled.div`
  position: relative;
  cursor: pointer;
  width: 20%;
`
const ProgressBackground = styled.circle`
  fill: #ececec;
  stroke: ${props => props.theme.whitesmoke};
  stroke-width: 4;
`

const ProgressForeground = styled.circle`
  fill: #ececec;
  stroke: ${props => props.theme.orange};
  stroke-dasharray: ${({ percentage }) => `${100 - percentage}, ${percentage}`};
  stroke-dashoffset: 25;
  stroke-width: 4;
`

const Progress = styled.svg`
  display: block;
`
const Image = styled.img`
  display: block;
  width: 70%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border-radius: 50%;
`

const ConstructIcon = ({ onClick, energyAmount, energyTarget, imageSrc }) => {
  const percentage = 100 - energyAmount / energyTarget * 100
  return (
    <Icon onClick={onClick}>
      <Progress viewBox="0 0 42 42">
        <ProgressBackground r="15.91549430918953" cx="21" cy="21" />
        <ProgressForeground
          r="15.91549430918953"
          cx="21"
          cy="21"
          percentage={percentage}
        />
      </Progress>
      <Image src={imageSrc} />
    </Icon>
  )
}

ConstructIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
  energyAmount: PropTypes.number.isRequired,
  energyTarget: PropTypes.number.isRequired,
  imageSrc: PropTypes.string.isRequired,
}

export default ConstructIcon
