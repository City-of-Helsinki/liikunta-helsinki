import { useState } from "react";

import { render, screen, userEvent } from "../../../../tests/utils";
import DateTimePicker from "../DateTimePicker";

function TestDateInputPicker(props) {
  const [value, setValue] = useState(null);

  const onChange = (nextDate) => {
    setValue(nextDate);
  };

  return <DateTimePicker {...props} value={value} onChange={onChange} />;
}

describe("DateTimePicker", () => {
  it("should allow the user to select a date and a time", () => {
    const label = "Time and Date";

    render(<TestDateInputPicker locale="en" label={label} />);

    const button = screen.getByText(label);

    userEvent.click(button);
    userEvent.type(screen.getByLabelText("date_input.label"), "12.12.2012");
    userEvent.type(screen.getByLabelText("time_input.hours_label"), "14");
    userEvent.type(screen.getByLabelText("time_input.minutes_label"), "16");
    userEvent.click(screen.getByRole("button", { name: "select" }));

    expect(
      screen.getByLabelText(label, { exact: false }).textContent
    ).toMatchInlineSnapshot(`"12.12.2012 14:16"`);
  });
});
