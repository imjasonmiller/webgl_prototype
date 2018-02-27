import React, { Component } from "react"

// Higher Order Component that handles pagination
const AvatarEdit = (WrappedComponent, Data) =>
  class extends Component {
    constructor(props) {
      super(props)
      this.state = {
        colorsPageIndex: 0,
        optionsPageIndex: 0,
      }

      // Total length for colors and options arrays
      this.colorsLength = Data.colors.length
      this.optionsLength = Data.options.length

      // Page items length for colors and options
      this.colorsPageLength = 6
      this.optionsPageLength = 3
    }

    handlePrevColors() {
      if (this.state.colorsPageIndex > 0) {
        this.setState(state => ({
          colorsPageIndex: state.colorsPageIndex - 1,
        }))
      }
    }

    handleNextColors() {
      if (
        this.state.colorsPageIndex + 1 <
        this.colorsLength / this.colorsPageLength
      ) {
        this.setState(state => ({
          colorsPageIndex: state.colorsPageIndex + 1,
        }))
      }
    }

    handlePrevOptions() {
      if (this.state.optionsPageIndex > 0) {
        this.setState(state => ({
          optionsPageIndex: state.optionsPageIndex - 1,
        }))
      }
    }

    handleNextOptions() {
      if (
        this.state.optionsPageIndex + 1 <
        this.optionsLength / this.optionsPageLength
      ) {
        this.setState(state => ({
          optionsPageIndex: state.optionsPageIndex + 1,
        }))
      }
    }

    render() {
      return (
        <WrappedComponent
          colorsPageIndex={this.state.colorsPageIndex}
          colorsPageLength={this.colorsPageLength}
          optionsPageIndex={this.state.optionsPageIndex}
          optionsPageLength={this.optionsPageLength}
          handlePrevColors={() => this.handlePrevColors()}
          handleNextColors={() => this.handleNextColors()}
          handlePrevOptions={() => this.handlePrevOptions()}
          handleNextOptions={() => this.handleNextOptions()}
          {...this.props}
        />
      )
    }
  }

export default AvatarEdit
