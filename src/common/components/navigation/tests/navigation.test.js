import { render } from "../../../../tests/utils";
import Navigation from "../Navigation";

describe("<Navigation />", () => {
  it("should render correctly", () => {
    const { container } = render(
      <Navigation
        navigationItems={[
          {
            id: "1",
            label: "Test",
            title: "Test",
            url: "/url",
          },
        ]}
        languages={[
          {
            id: "1",
            name: "Suomeksi",
            slug: "fi",
          },
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
