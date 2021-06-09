import { render, screen } from "@testing-library/react";

import LinkedInShareLink from "../LinkedInShareLink";

const renderComponent = (props) => render(<LinkedInShareLink {...props} />);

test("should apply aria label", () => {
  const sharedLink = "https://helsinki.fi/some/";
  renderComponent({ sharedLink });

  expect(screen.getByLabelText("Jaa LinkedInissä"));
});

test("<LinkedInShareLink /> matches snapshot", () => {
  const sharedLink = "https://helsinki.fi/some/";
  const { container } = renderComponent({ sharedLink });

  expect(container.firstChild).toMatchSnapshot();
});
