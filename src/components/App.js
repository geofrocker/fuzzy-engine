import React, { Component } from "react";
import axios from "axios";
import { debounce } from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";

import "./app.css";
import NumCard from "./NumCard";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: [],
      active: false,
      limit: 100,
      genLimit: 100,
      currentNum: "",
      total: 0,
      error: ""
    };
  }

  componentDidMount() {
    this.getNums();
  }

  handleCurrent = num => {
    this.setState({
      currentNum: num
    });
  };

  handleGenLimit = e => {
    this.setState({
      genLimit: e.target.value
    });
  };

  exportCsv = () => {
    const rows = this.state.numbers[0].numbers;
    let csvContent =
      "data:text/csv;charset=utf-8," + rows.map(e => `0${e}`).join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${this.state.numbers[0].total} contacts generated on ${
        this.state.numbers[0].dateGen
      }`
    );
    document.body.appendChild(link);
    link.click();
  };

  getMoreNums = async () => {
    this.setState({
      limit:
        this.state.limit < this.state.total
          ? this.state.limit + 100
          : this.state.total
    });
    console.log("called", this.state.limit, this.state.total);
    return await axios
      .get(`http://localhost:4000/${this.state.limit}`)
      .then(({ data }) => {
        if (!data) {
          return this.setState({ error: "An error occured" });
        }
        if (data.numbers.length > 0) {
          this.setState({
            numbers: data.numbers,
            currentNum: data.numbers[0].numbers[0],
            active: true
          });
        }
      });
  };

  getNums = async (limit = 100, order = "none") => {
    return await axios
      .get(`http://localhost:4000/${limit}?order=${order}`)
      .then(({ data }) => {
        if (!data) {
          return this.setState({ error: "An error occured" });
        }
        if (data.numbers.length > 0) {
          this.setState({
            numbers: data.numbers,
            currentNum: data.numbers[0].numbers[0],
            active: true,
            total: data.numbers[0].total
          });
        } else {
          this.generateNums();
        }
      });
  };

  generateNums = debounce((n = 100) => {
    this.setState({ active: false });
    const nums = [];
    for (let i = 0; i < n; i++) {
      let num = `0${Math.floor(
        Math.random() * (999999999 - 100000000) + 100000000
      )}`;
      nums.push(num);
    }
    return axios.post("http://localhost:4000/", { nums }).then(({ data }) => {
      this.getNums();
    });
  }, 200);

  render() {
    if (this.state.error.length > 0) {
      return (
        <div>
          <i style={{ color: "red" }}>{this.state.error}</i>
        </div>
      );
    }
    if (this.state.numbers.length < 0) {
      return false;
    }

    return (
      <div className="App">
        <div className="box" id="box">
          <h1 style={{ color: "green" }}>Phone Generator</h1>
          {!this.state.active && <p style={{ color: "red" }}>Loading...</p>}
          {this.state.active && (
            <>
              <b>
                {this.state.numbers[0].total} contacts generated on{" "}
                {this.state.numbers[0].dateGen}
              </b>
              <br />
              <br />
              <InfiniteScroll
                dataLength={this.state.limit}
                next={this.getMoreNums}
                hasMore={true}
                scrollableTarget={"numCard"}
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>No more Phone numbers</b>
                  </p>
                }
              >
                {this.state.numbers.map(num => (
                  <NumCard
                    key={num.id}
                    handleCurrent={this.handleCurrent}
                    num={num}
                  />
                ))}
              </InfiniteScroll>
              <div className="detail-num">
                <button className="btn-detail">{this.state.currentNum}</button>
                <div className="minmax">
                  <b>Min:</b>
                  <i style={{ color: "green" }}>
                    {" "}
                    0{Math.min(...this.state.numbers[0].numbers)}
                  </i>
                  <br />
                  <b>Max:</b>
                  <i style={{ color: "green" }}>
                    {" "}
                    0{Math.max(...this.state.numbers[0].numbers)}
                  </i>
                </div>
              </div>
              <br />
            </>
          )}
        </div>
        {this.state.active && (
          <>
            <button
              style={{ color: "red" }}
              onClick={() => this.generateNums(this.state.genLimit)}
            >
              Generate Phone Numbers
            </button>
            <input
              type="number"
              min="1"
              max="7500"
              onChange={this.handleGenLimit}
              onKeyUp={this.handleGenLimit}
              value={this.state.genLimit}
            />
            &nbsp;
            <button
              style={{ color: "red" }}
              onClick={() => this.getNums(this.state.limit, "asc")}
            >
              Sort in Asc
            </button>
            <button
              style={{ color: "red" }}
              onClick={() => this.getNums(this.state.limit, "desc")}
            >
              Sort in Desc
            </button>
            <button style={{ color: "red" }} onClick={() => this.exportCsv()}>
              Export to csv
            </button>
          </>
        )}
      </div>
    );
  }
}

export default App;
