import { render, screen } from "@testing-library/react";
import { describe, expect, it, test } from "vitest";
import LoginTemplate from "@/Cabinet/components/Login/LoginTemplate";


describe("Login Template test", () => {
  it("should render properly", () => {
    const pageTitle = "42cabi";
    const pageSubTitle = "여러분의 일상을 가볍게";
    render(<LoginTemplate pageTitle={pageTitle} pageSubTitle={pageSubTitle} />);
    const pageTitleEl = screen.getByText(/42cabi/i);
    expect(pageTitleEl).toBeInTheDocument();
  });
});