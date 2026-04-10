import { buildSystemPrompt } from "./buildSystemPrompt";
import FoodPlace from "model/FoodPlace";
import { getFoodPlaceId } from "ts/utils";

function makeFoodPlace(overrides: Partial<FoodPlace> = {}): FoodPlace {
  return new FoodPlace(
    overrides.id ?? 1,
    overrides.name ?? "Test Restaurant",
    overrides.tags ?? ["tag"],
    overrides.description ?? "A great place",
    overrides.price ?? "$$",
    overrides.typeOfCuisine ?? ["Italian"],
    overrides.neighborhood ?? "Downtown",
    overrides.images,
    overrides.googleMaps,
    overrides.instagram,
    overrides.website,
  );
}

describe("buildSystemPrompt", () => {
  it("includes the website URL for a restaurant that has one", () => {
    const place = makeFoodPlace({ website: "https://example.com" });
    const prompt = buildSystemPrompt("Paris", [place]);

    expect(prompt).toContain("| Website: https://example.com");
  });

  it("omits the website segment when website is undefined", () => {
    const place = makeFoodPlace({ website: undefined });
    const prompt = buildSystemPrompt("Paris", [place]);

    expect(prompt).not.toContain("Website:");
  });

  it("omits the website segment when website is an empty string", () => {
    const place = makeFoodPlace({ website: "" });
    const prompt = buildSystemPrompt("Paris", [place]);

    expect(prompt).not.toContain("Website:");
  });

  it("includes Markdown link formatting instruction with slug-based target", () => {
    const prompt = buildSystemPrompt("Paris", []);

    expect(prompt).toContain("[Book / Visit](restaurant-slug)");
  });

  it("includes instruction to prominently show slug-based link on booking intent", () => {
    const prompt = buildSystemPrompt("Paris", []);

    expect(prompt).toContain(
      "When the user wants to book or visit, prominently include the slug-based link"
    );
  });

  it("includes ID and Slug for each restaurant in the prompt", () => {
    const place1 = makeFoodPlace({ id: 42, name: "Le Petit Bistro" });
    const place2 = makeFoodPlace({ id: 7, name: "Sushi Palace" });
    const prompt = buildSystemPrompt("Paris", [place1, place2]);

    expect(prompt).toContain("ID: 42");
    expect(prompt).toContain("Slug:");
    expect(prompt).toContain("ID: 7");
  });

  it("slug in prompt matches getFoodPlaceId for a known restaurant", () => {
    const place = makeFoodPlace({ id: 10, name: "L'Amour de la Cuisine" });
    const prompt = buildSystemPrompt("Paris", [place]);
    const expectedSlug = getFoodPlaceId("L'Amour de la Cuisine");

    expect(prompt).toContain(`Slug: ${expectedSlug}`);
  });
});
