import React from "react"
import PropTypes from "prop-types"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

const Wrap = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  grid-template-areas: "prev spacer next";
  margin-bottom: 1em;
  user-select: none;
`
const Button = styled.a`
  display: inline-grid;
  grid-gap: 0.5em;
  padding: 0.25em;
  align-items: center;
  border: 3px solid
    ${props => (props.active ? props.theme.orange : props.theme.whitesmoke)};
  border-radius: 3px;
  cursor: ${props => (props.active ? "pointer" : "auto")};
  font-weight: 600;
  color: ${props =>
    props.active ? props.theme.orange : props.theme.gainsboro};

  &:hover {
    color: ${props =>
      props.active ? props.theme.orange : props.theme.gainsboro};
  }
`
const ButtonPrev = Button.extend`
  grid-area: prev;
  padding: 0.25em 0.5em 0.25em 0.25em;
  grid-template-columns: 1em 1fr;
`

const ButtonNext = Button.extend`
  grid-area: next;
  padding: 0.25em 0.5em 0.25em 0.5em;
  grid-template-columns: 1fr 1em;
`

const ButtonIcon = styled.svg`
  width: 1.25em;
  stroke: ${props =>
    props.active ? props.theme.orange : props.theme.gainsboro};
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
`

const Pagination = ({
  handlePrev,
  handleNext,
  listIndex,
  listLength,
  totalLength,
}) => {
  const prevItemsAvailable = listIndex > 0
  const nextItemsAvailable = listIndex + 1 < totalLength / listLength

  return (
    <Wrap>
      <ButtonPrev
        role="button"
        active={prevItemsAvailable}
        onClick={handlePrev}
      >
        <ButtonIcon viewBox="0 0 25 25" active={prevItemsAvailable}>
          <path d="M15,2,5,12,15,22" />
        </ButtonIcon>
        <FormattedMessage
          id="pagination.previous"
          description="A previous button that the user can click"
          defaultMessage="Previous"
        />
      </ButtonPrev>
      <ButtonNext
        role="button"
        active={nextItemsAvailable}
        onClick={handleNext}
      >
        <FormattedMessage
          id="pagination.next"
          description="A next button that the user can click"
          defaultMessage="Next"
        />
        <ButtonIcon viewBox="0 0 25 25" active={nextItemsAvailable}>
          <path d="M10,2,20,12,10,22" />
        </ButtonIcon>
      </ButtonNext>
    </Wrap>
  )
}

Pagination.propTypes = {
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  listIndex: PropTypes.number.isRequired,
  listLength: PropTypes.number.isRequired,
  totalLength: PropTypes.number.isRequired,
}

export default Pagination
