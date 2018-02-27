import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import styled from "styled-components"
import Animated from "animated/lib/targets/react-dom"

import ItemData from "static/avatar/item"

const Wrap = styled.div`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`
const Item = Wrap.withComponent("svg")

class AvatarViewItem extends Component {
  constructor(props) {
    super(props)

    const { itemColor, itemOption } = props

    this.itemAnimVal = new Animated.Value(0)

    this.interpolate = this.itemAnimVal.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "-100%"],
    })

    this.state = {
      itemContent: ItemData.options[itemOption].data(
        ItemData.colors[itemColor],
      ),
    }
  }

  componentWillReceiveProps(nextProps) {
    Animated.spring(this.itemAnimVal, {
      toValue: 1,
      tension: 12,
      friction: 7,
    }).start(() => {
      const nextColor = ItemData.colors[nextProps.itemColor]
      const nextOption = nextProps.itemOption

      this.setState(() => ({
        itemContent: ItemData.options[nextOption].data(nextColor),
      }))

      Animated.spring(this.itemAnimVal, {
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
          <Item viewBox="0 0 500 500">
            <rect width="500" height="500" x="0" y="0" fill="none" />
            {this.state.itemContent}
          </Item>
        </Animated.div>
      </Wrap>
    )
  }
}

AvatarViewItem.propTypes = {
  itemColor: PropTypes.number.isRequired,
  itemOption: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  itemColor: state.player.itemColor,
  itemOption: state.player.itemOption,
})

export default connect(mapStateToProps)(AvatarViewItem)
