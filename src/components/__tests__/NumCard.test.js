/* eslint-disable no-undef */
import React from "react";
import NumCard from "../App/NumCard";

describe("<App />", () => {
  const props = {
    num: {
      id: "91d71629-6ad0-4c79-a2a5-0966dd4fdb42",
      dateGen: "Friday, March 1, 2019, 11:02:49 PM",
      total: 10000,
      numbers: ["0905524117"]
    },
    handleCurrent: () => {}
  };
  it("should be rendered", () => {
    const wrapper = mount(<NumCard {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should simulate on mouse enter and on mouse leave", () => {
    const wrapper = mount(<NumCard {...props} />);
    wrapper.find("button").simulate("mouseenter");
    wrapper.find("button").simulate("mouseleave");
  });
});
