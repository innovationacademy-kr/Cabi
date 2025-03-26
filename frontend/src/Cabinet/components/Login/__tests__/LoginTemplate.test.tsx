import { render, screen } from "@testing-library/react";
import { describe, expect, it, test } from "vitest";
import LoginTemplate from "@/Cabinet/components/Login/LoginTemplate";

describe("Login Template test", () => {
  it("should render properly", () => {
    render(<LoginTemplate />);
    const pageTitleEl = screen.getByText(/42cabi/i);
    expect(pageTitleEl).toBeInTheDocument();
  });
});

// TODO : 무슨 파일인지 파악하기
