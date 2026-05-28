import { fireEvent, render, screen } from "@testing-library/react";
import NutritionCoach from "./App";

describe("NutritionCoach", () => {
  it("renders the intake form", () => {
    render(<NutritionCoach />);

    expect(screen.getByRole("heading", { name: /your personal nutrition coach/i })).toBeInTheDocument();
    expect(screen.getByText(/country of residence/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get my nutrition plan/i })).toBeInTheDocument();
  });

  it("shows required field errors before submit", () => {
    render(<NutritionCoach />);

    fireEvent.click(screen.getByRole("button", { name: /get my nutrition plan/i }));

    expect(screen.getByText(/please select your country/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your age/i)).toBeInTheDocument();
    expect(screen.getByText(/please select your activity level/i)).toBeInTheDocument();
  });
});
