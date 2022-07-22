import { render, screen } from "@testing-library/react";
import Video from "../Video";

describe("<Video />", () => {
  it("should render", () => {
    render(<Video source={{ url: "https://fake/test.mp4", width: 1, height: 1 }} data-testid="video" />);
    expect(screen.getByTestId("video")).toBeInTheDocument();
  });
});
