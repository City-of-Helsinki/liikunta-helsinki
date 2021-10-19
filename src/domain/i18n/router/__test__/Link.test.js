import { render, screen } from "../../../../tests/utils";
import Link from "../Link";

describe("<Link />", () => {
  it("should retain current pathname if none is provided in href object", () => {
    const label = "Test Link";

    render(
      <Link
        href={{
          query: {
            isOpenNow: true,
          },
        }}
      >
        {label}
      </Link>,
      undefined,
      {
        pathname: "/search",
      }
    );

    expect(
      screen.getByRole("link", {
        name: label,
      }).href
    ).toMatchInlineSnapshot(`"http://localhost/search?isOpenNow=true"`);
  });
});
