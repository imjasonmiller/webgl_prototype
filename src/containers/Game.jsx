import React from "react"
import styled, { withTheme } from "styled-components"
import { Overlay, Renderer } from "containers"

const WrapOverflow = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
`

const Game = () => (
  <div>
    <WrapOverflow>
      {/* <Loader size={50} speed={2} color={theme.orange} /> */}
      <Renderer />
      <Overlay />
    </WrapOverflow>
  </div>
)

export default withTheme(Game)
