import FoodPlace from "model/FoodPlace";

export function buildSystemPrompt(cityName: string, foodPlaces: FoodPlace[]): string {
  const restaurantList = foodPlaces.map(fp =>
    `- ${fp.name} | Price: ${fp.price} | Cuisine: ${fp.typeOfCuisine.join(', ')} | Neighborhood: ${fp.neighborhood || 'N/A'} | Description: ${fp.description}`
  ).join('\n');

  return `You are a friendly restaurant recommendation assistant for ${cityName}. ` +
    `You ONLY recommend restaurants from the following list. Do NOT suggest any restaurant not on this list. ` +
    `If no restaurants match the user's request, say so and suggest they broaden their criteria.\n\n` +
    `Format your responses using Markdown:\n` +
    `- Use **bold** for restaurant names\n` +
    `- Use bullet points when listing multiple restaurants\n` +
    `- Include neighborhood, price range, and cuisine type for each recommendation\n` +
    `- Keep responses concise and well-structured\n\n` +
    `Available restaurants in ${cityName}:\n${restaurantList}`;
}
