import { render, screen } from "@testing-library/react";

import App from "../pages/index";

describe("App", () => {
  it("renders without crashing", () => {
    render(
      <App
        page={{
          layout: {
            navigationItems: [
              {
                id: "1",
                path: "/haku",
                target: "",
                title: "Haku",
                url: "/haku",
              },
              {
                id: "3",
                path: "/liikuntatunnit",
                target: "",
                title: "Liikuntatunnit",
                url: "/liikuntatunnit",
              },
            ],
            languages: [],
          },
        }}
      />
    );
    expect(screen.getByText("Liikunta-Helsinki")).toBeInTheDocument();
  });
});
