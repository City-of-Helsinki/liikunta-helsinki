import { render, screen } from "@testing-library/react";

import FacebookShareLink from "../FacebookShareLink";

const renderComponent = (props) => render(<FacebookShareLink {...props} />);

test("should apply aria label", () => {
  const sharedLink = "https://helsinki.fi/some/";
  renderComponent({ sharedLink });

  expect(screen.getByLabelText("facebook"));
});

test("<FacebookShareLink /> matches snapshot", () => {
  const sharedLink = "https://helsinki.fi/some/";
  const { container } = renderComponent({ sharedLink });

  expect(container.firstChild).toMatchSnapshot();
});
