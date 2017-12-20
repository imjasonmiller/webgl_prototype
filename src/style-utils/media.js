import { css } from "styled-components"

const media = {
  sm: (...args) => css`
    @media (min-width: 320px) {
      ${css(...args)};
    }
  `,
  md: (...args) => css`
    @media (min-width: 480px) {
      ${css(...args)};
    }
  `,
  lg: (...args) => css`
    @media (min-width: 768px) {
      ${css(...args)};
    }
  `,
}

export default media
