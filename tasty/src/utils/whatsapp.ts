export const RESTAURANT_WHATSAPP_NUMBER = '31684632782';
export const RESTAURANT_WHATSAPP_DISPLAY = '+31 6 84632782';
export const RESTAURANT_PHONE_DISPLAY = '035 204 2001';

export function getWhatsAppOrderUrl(message: string): string {
  return `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function formatBowlOrderMessage(params: {
  base: string;
  protein: string;
  toppings: string[];
  sauces: string[];
  price: number;
}): string {
  const toppingsList = params.toppings.length > 0 ? params.toppings.join(', ') : 'None / Geen';
  const saucesList = params.sauces.length > 0 ? params.sauces.join(', ') : 'None / Geen';

  return `Hallo TASTY! 👋
Ik wil graag een Custom Levantine Bowl bestellen:

🥗 Samenstelling:
• Basis: ${params.base}
• Proteïne: ${params.protein}
• Toppings: ${toppingsList}
• Sauzen: ${saucesList}

💰 Totaalprijs: €${params.price.toFixed(2)}
🛵 Bezorging / Afhalen graag!
📍 Adres / Opmerkingen: `;
}

export function formatDishOrderMessage(dishName: string, price: number): string {
  return `Hallo TASTY! 👋
Ik wil graag bestellen:
🍽️ ${dishName} (€${price.toFixed(2)})

🛵 Bezorging / Afhalen graag!
📍 Adres / Opmerkingen: `;
}

export function formatGeneralInquiryMessage(): string {
  return `Hallo TASTY! 👋
Ik wil graag een bestelling plaatsen voor bezorging of afhalen in Hilversum.`;
}
