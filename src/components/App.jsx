import React, { Component } from "react";
import axios from "axios";
import { debounce } from "lodash";
import "./app.css";
import "./query.css";
import NumCard from "./NumCard";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: [],
      active: false,
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
    this.setState({ error: "" });
    if (e.target.value > 10000) {
      this.setState({ error: "The number must be 10000 or less" });
      return false;
    } else {
      this.setState({
        genLimit: e.target.value
      });
    }
  };

  exportCsv = () => {
    const rows = this.state.numbers[0].numbers;
    let csvContent =
      "data:text/csv;charset=utf-8," + rows.map(e => `0${e}`).join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
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

  getNums = debounce(async (limit = 10000, order = "none") => {
    //this.setState({ active: false })
    return axios.get(`/${limit}?order=${order}`).then(({ data }) => {
      if (!data) {
        return this.setState({ error: "An error occured" });
      }
      console.log(data);
      if (data.numbers.length > 0 && data.numbers[0].numbers.length > 0) {
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
  }, 50);

  generateNums = (n = 100) => {
    this.setState({ active: false });
    const nums = [];
    for (let i = 0; i < n; i++) {
      let num = `0${Math.floor(
        Math.random() * (999999999 - 100000000) + 100000000
      )}`;
      nums.push(num);
    }
    return axios.post("/", { nums }).then(response => {
      console.log(response.status);
      if (response.status === 201) {
        this.getNums();
      }
    });
  };

  render() {
    if (this.state.numbers.length < 1) {
      return false;
    }

    return (
      <div className="App">
        <div className="box" id="box">
          <h1 style={{ color: "green" }}>Phone Generator</h1>
          {!this.state.active && (
            <div className="loader">
              <b>Loading...</b>
            </div>
          )}
          {this.state.active && (
            <div>
              <div>
                <b>
                  {this.state.numbers[0].total} contacts generated on{" "}
                  {this.state.numbers[0].dateGen}
                </b>
                <br />
                <br />
                {this.state.numbers.map(num => (
                  <NumCard
                    key={num.id}
                    handleCurrent={this.handleCurrent}
                    num={num}
                  />
                ))}
                <div className="detail-num">
                  <div className="detail-content">
                    <button className="btn-detail">
                      {this.state.currentNum}
                    </button>
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
                    {this.state.error && (
                      <h4 className="error" style={{ color: "red" }}>
                        {this.state.error}
                      </h4>
                    )}
                  </div>
                </div>
                <br />
              </div>
              <div className="actions">
                <button
                  ref="btn"
                  id="gen"
                  className="btn-action"
                  onClick={() => this.generateNums(this.state.genLimit)}
                >
                  Generate Phone Numbers
                </button>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  onChange={this.handleGenLimit}
                  onKeyUp={this.handleGenLimit}
                  value={this.state.genLimit}
                />
                &nbsp;
                <button
                  id="sort-asc"
                  className="btn-action"
                  onClick={() => this.getNums(10000, "asc")}
                >
                  Sort in Asc
                </button>
                <button
                  id="sort-desc"
                  className="btn-action"
                  onClick={() => this.getNums(10000, "desc")}
                >
                  Sort in Desc
                </button>
                <button
                  id="export-btn"
                  className="btn-action"
                  onClick={() => this.exportCsv()}
                >
                  Export to csv
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
