import { render, screen } from "@testing-library/react";

import TwitterShareLink from "../TwitterShareLink";

const renderComponent = (props) => render(<TwitterShareLink {...props} />);

test("should apply aria label", () => {
  const sharedLink = "https://helsinki.fi/some/";
  renderComponent({ sharedLink });

  expect(screen.getByLabelText("Jaa Twitterissä"));
});

test("<TwitterShareLink /> matches snapshot", () => {
  const sharedLink = "https://helsinki.fi/some/";
  const { container } = renderComponent({ sharedLink });

  expect(container.firstChild).toMatchSnapshot();
});
