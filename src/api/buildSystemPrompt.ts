import FoodPlace from "model/FoodPlace";
import { getFoodPlaceId } from "ts/utils";

export function buildSystemPrompt(cityName: string, foodPlaces: FoodPlace[]): string {
  const restaurantList = foodPlaces.map(fp => {
    const slug = getFoodPlaceId(fp.name);
    return `- ${fp.name} | ID: ${fp.id} | Slug: ${slug} | Price: ${fp.price} | Cuisine: ${fp.typeOfCuisine.join(', ')} | Neighborhood: ${fp.neighborhood || 'N/A'} | Description: ${fp.description}${fp.website ? ` | Website: ${fp.website}` : ''}`;
  }).join('\n');

  return `You are a friendly restaurant recommendation assistant for ${cityName}. ` +
    `You ONLY recommend restaurants from the following list. Do NOT suggest any restaurant not on this list. ` +
    `If no restaurants match the user's request, say so and suggest they broaden their criteria.\n\n` +
    `Format your responses using Markdown:\n` +
    `- Use **bold** for restaurant names\n` +
    `- When listing multiple restaurants, separate each one with a blank line for readability\n` +
    `- For each restaurant include: neighborhood, price range, cuisine type, and a short description\n` +
    `- Keep responses concise and well-structured\n` +
    `- When recommending a restaurant, include a Markdown link like [Book / Visit](restaurant-slug) using the restaurant's slug as the link target, on its own line after the description\n` +
    `- When the user wants to book or visit, prominently include the slug-based link\n\n` +
    `Available restaurants in ${cityName}:\n${restaurantList}`;
}
