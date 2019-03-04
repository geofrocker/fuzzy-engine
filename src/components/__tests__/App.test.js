/* eslint-disable no-undef */
import React from "react";
import App from "./../App";
import { resolve } from "uri-js";
let clock;

jest.useFakeTimers();

describe("<App />", () => {
  const data = [
    {
      id: "91d71629-6ad0-4c79-a2a5-0966dd4fdb42",
      dateGen: "Friday, March 1, 2019, 11:02:49 PM",
      total: 10000,
      numbers: ["0905524117"]
    }
  ];
  beforeEach(function() {
    clock = sinon.useFakeTimers();
    moxios.install();
  });

  afterEach(function() {
    clock.restore();
    moxios.uninstall();
  });

  it("should be rendered", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ active: true, numbers: data });
    expect(wrapper).toMatchSnapshot();
  });

  it("should return false", () => {
    const wrapper = mount(<App />);
    wrapper.setState({ numbers: [] });
    expect(wrapper).toMatchSnapshot();
  });

  it("should should div with App class/>", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ numbers: ["89899"] });
    expect(wrapper.find("div.App").length).toEqual(1);
  });

  it("should show a loader/>", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ active: false, numbers: ["89899"] });
    expect(wrapper.find("b").text()).toContain("Loading...");
  });

  it("should show generated number rows/>", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ active: true, numbers: data });
    expect(wrapper.find("NumCard").length).toEqual(1);
  });

  it("should show a detail-num div/>", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ active: true, numbers: data });
    expect(wrapper.find(".detail-num").length).toEqual(1);
  });

  it("should show error message/>", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({
      active: true,
      numbers: data,
      error: "An error occured"
    });
    expect(wrapper.find("h4").text()).toContain("An error occured");
  });

  it("should click Generate Phone Numbers/>", async done => {
    const wrapper = shallow(<App />);
    wrapper.setState({ active: true, numbers: data, limit: 5 });
    expect(wrapper.find("div>button#gen").text()).toEqual(
      "Generate Phone Numbers"
    );
    wrapper.find("input").simulate("change", { target: { value: 10 } });
    wrapper.find("div>button#gen").simulate("click");
    clock.tick(200);
    wrapper.update();
    moxios.stubRequest(`http://localhost:4000/`, {
      status: 201,
      response: { numbers: data }
    });
    done();
    wrapper.unmount();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(wrapper).toMatchSnapshot();
  });

  it("should return an error in case the user tries to generate >10000/>", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ active: true, numbers: data, limit: 5 });
    wrapper.find("input").simulate("change", { target: { value: 100000 } });
    expect(wrapper).toMatchSnapshot();
  });

  it("should sort numbers in asc/>", async done => {
    const wrapper = shallow(<App />);
    wrapper.setState({ active: true, numbers: data, limit: 5 });
    expect(wrapper.find("div>button#sort-asc").text()).toEqual("Sort in Asc");
    wrapper.find("div>button#sort-asc").simulate("click");
    clock.tick(50);
    wrapper.update();
    moxios.stubRequest(`http://localhost:4000/10000?order=asc`, {
      status: 200,
      response: { numbers: data }
    });
    done();
    wrapper.unmount();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(wrapper).toMatchSnapshot();
  });

  it("should return an error incase of a problem in sorting/>", async done => {
    const wrapper = shallow(<App />);
    wrapper.setState({ active: true, numbers: data, limit: 5 });
    wrapper.find("div>button#sort-asc").simulate("click");
    clock.tick(50);
    wrapper.update();
    moxios.stubRequest(`http://localhost:4000/10000?order=asc`, {
      status: 200,
      response: null
    });
    done();
    wrapper.unmount();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(wrapper).toMatchSnapshot();
  });

  it("should generate new numbers incase the are no numbers/>", async done => {
    const wrapper = shallow(<App />);
    wrapper.setState({ active: true, numbers: data, limit: 5 });
    wrapper.find("div>button#sort-asc").simulate("click");
    clock.tick(50);
    wrapper.update();
    moxios.stubRequest(`http://localhost:4000/10000?order=asc`, {
      status: 200,
      response: { numbers: [] }
    });
    done();
    wrapper.unmount();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(wrapper).toMatchSnapshot();
  });

  it("should sort numbers in desc/>", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ active: true, numbers: data, limit: 5 });
    expect(wrapper.find("div>button#sort-desc").text()).toEqual("Sort in Desc");
    wrapper.find("div>button#sort-desc").simulate("click");
    expect(wrapper).toMatchSnapshot();
  });

  it("should export contacts/>", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ active: true, numbers: data, limit: 5 });
    expect(wrapper.find("div>button#export-btn").text()).toEqual(
      "Export to csv"
    );
    wrapper.find("div>button#export-btn").simulate("click");
    expect(wrapper).toMatchSnapshot();
  });

  it("invokes `componentDidMount` when mounted", () => {
    jest.spyOn(App.prototype, "componentDidMount");
    mount(<App />);
    expect(App.prototype.componentDidMount).toHaveBeenCalled();
    App.prototype.componentDidMount.mockRestore();
  });
});
