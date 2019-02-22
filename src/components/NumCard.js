import React from "react";

class NumCard extends React.PureComponent {
  render() {
    return (
      <div className="nameCard" id="numCard">
        {this.props.num.numbers.map(number => (
          <>
            <label key={number.toString()}>
              <button
                onMouseEnter={() => this.props.handleCurrent(number)}
                onMouseLeave={() => this.props.handleCurrent(number)}
                className="btn-num"
              >
                {number}
              </button>
            </label>
            <br />
          </>
        ))}
      </div>
    );
  }
}
export default NumCard;
