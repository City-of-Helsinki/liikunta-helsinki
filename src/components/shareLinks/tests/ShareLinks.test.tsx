import { render, screen } from "@testing-library/react";

import ShareLinks from "../ShareLinks";

const renderComponent = () => render(<ShareLinks />);

test("should have discoverable link address copy button as well as Facebook, Twitter and LinkedIn share links", () => {
  renderComponent();
  const shareLinkLabelsFI = [
    "Kopioi linkin osoite",
    "Jaa Facebookissa",
    "Jaa Twitterissä",
    "Jaa LinkedInissä",
  ];

  shareLinkLabelsFI.forEach((label) => {
    expect(screen.queryByLabelText(label)).not.toEqual(null);
  });
});
