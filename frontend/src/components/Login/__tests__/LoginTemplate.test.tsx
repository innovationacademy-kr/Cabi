import LoginTemplate from "@/components/Login/LoginTemplate";
import { render, screen } from "@testing-library/react";
import { describe, it, test, expect } from "vitest";

describe("Login Template test", () => {
  it("should render properly", () => {
    const url = `${import.meta.env.VITE_BE_HOST}/auth/login`;
    const pageTitle = "42cabi";
    const pageSubTitle = "여러분의 일상을 가볍게";
    render(
      <LoginTemplate
        url={url}
        pageTitle={pageTitle}
        pageSubTitle={pageSubTitle}
      />
    );
    const pageTitleEl = screen.getByText(/42cabi/i);
    expect(pageTitleEl).toBeInTheDocument();
  });
});
