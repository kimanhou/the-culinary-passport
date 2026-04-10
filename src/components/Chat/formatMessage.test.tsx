import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { formatMessage } from "./formatMessage";
import FoodPlace from "../../model/FoodPlace";

/** Helper: renders formatMessage output into the DOM and returns the container */
function renderMessage(
  text: string,
  slugMap?: Map<string, FoodPlace>,
  onOpenCard?: (fp: FoodPlace) => void
) {
  const { container } = render(<>{formatMessage(text, slugMap, onOpenCard)}</>);
  return container;
}

/** Helper: creates a minimal FoodPlace for testing */
function makeFoodPlace(overrides: Partial<FoodPlace> & { id: number; name: string }): FoodPlace {
  return new FoodPlace(
    overrides.id,
    overrides.name,
    overrides.tags ?? [],
    overrides.description ?? "",
    overrides.price ?? "",
    overrides.typeOfCuisine ?? [],
    overrides.neighborhood,
    overrides.images,
    overrides.googleMaps,
    overrides.instagram,
    overrides.website
  );
}

describe("formatMessage – Markdown link rendering", () => {
  /** Validates: Requirements 3.1 */
  it("renders [text](url) as a clickable anchor element", () => {
    renderMessage("Check out [Example](https://example.com) for details");

    const link = screen.getByRole("link", { name: /Example/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  /** Validates: Requirements 3.2 */
  it("opens links in a new tab via target=_blank", () => {
    renderMessage("[Visit](https://example.com)");

    const link = screen.getByRole("link", { name: /Visit/ });
    expect(link).toHaveAttribute("target", "_blank");
  });

  /** Validates: Requirements 3.3 */
  it('includes rel="noopener noreferrer" for security', () => {
    renderMessage("[Book](https://restaurant.com)");

    const link = screen.getByRole("link", { name: /Book/ });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  /** Validates: Requirements 3.4 */
  it("renders a plain URL as plain text (no auto-linking)", () => {
    const container = renderMessage(
      "Visit https://example.com for more info"
    );

    expect(container.querySelector("a")).toBeNull();
    expect(container.textContent).toContain("https://example.com");
  });

  /** Validates: Requirements 3.1, 3.2, 3.3 combined with bold/italic */
  it("renders links alongside bold and italic text correctly", () => {
    renderMessage(
      "Try **Chez Marie** – *amazing food* [Book / Visit](https://chezmarie.com)"
    );

    const link = screen.getByRole("link", { name: /Book \/ Visit/ });
    expect(link).toHaveAttribute("href", "https://chezmarie.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");

    expect(screen.getByText("Chez Marie").tagName).toBe("STRONG");
    expect(screen.getByText("amazing food").tagName).toBe("EM");
  });

  /** Validates: Requirements 3.1, 3.2, 4.3 – backward compatible without slugMap */
  it("renders HTTP links as <a> tags when called without slugMap", () => {
    renderMessage("[Visit](https://example.com)");

    const link = screen.getByRole("link", { name: /Visit/ });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
  });
});

describe("formatMessage – slug link rendering", () => {
  const fp = makeFoodPlace({ id: 1, name: "Chez Marie", website: "https://chezmarie.com" });
  const slugMap = new Map<string, FoodPlace>([["chez-marie", fp]]);

  /** Validates: Requirements 3.1, 3.2 */
  it("renders [text](slug) as a <button> when slug is in slugMap", () => {
    const onOpenCard = jest.fn();
    const container = renderMessage("[Book / Visit](chez-marie)", slugMap, onOpenCard);

    const button = screen.getByRole("button", { name: /Book \/ Visit/ });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("chat-booking-link");
    // Should NOT render an anchor
    expect(container.querySelector("a")).toBeNull();
  });

  /** Validates: Requirements 4.1 */
  it("calls onOpenCard with the correct FoodPlace when slug button is clicked", () => {
    const onOpenCard = jest.fn();
    renderMessage("[See details](chez-marie)", slugMap, onOpenCard);

    const button = screen.getByRole("button", { name: /See details/ });
    fireEvent.click(button);

    expect(onOpenCard).toHaveBeenCalledTimes(1);
    expect(onOpenCard).toHaveBeenCalledWith(fp);
  });

  /** Validates: Requirements 3.4, 4.3 */
  it("renders [text](unknown-slug) as plain text when slug is NOT in slugMap", () => {
    const onOpenCard = jest.fn();
    const container = renderMessage("[Visit](unknown-place)", slugMap, onOpenCard);

    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("button")).toBeNull();
    expect(container.textContent).toContain("Visit");
  });

  /** Validates: Requirements 3.1, 3.2, 3.3, 4.3 */
  it("renders both a slug link and an HTTP link correctly in the same message", () => {
    const onOpenCard = jest.fn();
    renderMessage(
      "Try [Book](chez-marie) or visit [Website](https://chezmarie.com)",
      slugMap,
      onOpenCard
    );

    const button = screen.getByRole("button", { name: /Book/ });
    expect(button).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /Website/ });
    expect(link).toHaveAttribute("href", "https://chezmarie.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  /** Validates: Requirements 3.1, 3.3 – backward compatible */
  it("renders HTTP links as <a> tags when slugMap is not provided", () => {
    renderMessage("[Visit](https://example.com)");

    const link = screen.getByRole("link", { name: /Visit/ });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
