import React from "react";
import { List } from "react-virtualized";

const listHeight = 600;
const rowHeight = 28;
const rowWidth = 285;

class NumCard extends React.Component {
  renderRow=({ index, key, style}) =>{
    return (
      <div style={style} key={key}>
          <button
            onMouseEnter={() => this.props.handleCurrent(this.props.num.numbers[index])}
            onMouseLeave={() => this.props.handleCurrent(this.props.num.numbers[index])}
            className="btn-num"
          >
            {this.props.num.numbers[index]}
          </button>
        <br />
      </div>
    );
  }
  render() {
    return (
      <div className="nameCard" id="numCard">
        <List
            width={rowWidth}
            height={listHeight}
            rowHeight={rowHeight}
            rowRenderer={this.renderRow}
            rowCount={this.props.num.numbers.length}
          />
      </div>
    );
  }
}
export default NumCard;
