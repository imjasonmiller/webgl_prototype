import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import styled from "styled-components"

import debounce from "lodash/debounce"

import { updateModal } from "actions/window"

const StyledContent = styled.div`
  padding: 0 1em;
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scroling: touch;
  color: ${props => props.theme.mineshaft};

  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.whitesmoke};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.orange};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.orange};
  }
`

class Content extends Component {
  constructor() {
    super()
    this.debounceScroll = debounce(this.handleScroll, 100).bind(this)
  }

  componentDidMount() {
    // Only add the event listener when the animation finishes,
    // as the user is able to restart it at any point in time.
    this.props.dispatch(
      updateModal(
        this.content.scrollTop,
        this.content.getBoundingClientRect().height,
      ),
    )
    this.content.addEventListener("scroll", this.debounceScroll)
  }

  componentWillUnmount() {
    this.content.removeEventListener("scroll", this.debounceScroll)
  }

  handleScroll() {
    this.props.dispatch(
      updateModal(
        this.content.scrollTop,
        this.content.getBoundingClientRect().height,
      ),
    )
  }

  render() {
    return (
      <StyledContent
        innerRef={c => {
          this.content = c
        }}
      >
        {this.props.children}
      </StyledContent>
    )
  }
}

Content.propTypes = {
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(Content)
