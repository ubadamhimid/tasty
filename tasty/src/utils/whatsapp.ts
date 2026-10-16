import { CartItem } from '../types';

export const RESTAURANT_WHATSAPP_NUMBER = '31684632782';
export const RESTAURANT_WHATSAPP_DISPLAY = '+31 6 84632782';
export const RESTAURANT_PHONE_DISPLAY = '035 204 2001';
export const DELIVERY_FEE = 4.0;

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
  const toppingsList = params.toppings.length > 0 ? params.toppings.join(', ') : 'None';
  const saucesList = params.sauces.length > 0 ? params.sauces.join(', ') : 'None';

  return `Hello TASTY! 👋
I would like to order a Custom Levantine Bowl:

🥗 Composition:
• Base: ${params.base}
• Protein: ${params.protein}
• Toppings: ${toppingsList}
• Sauces: ${saucesList}

💰 Total price: €${params.price.toFixed(2)}
🛵 Delivery / Pickup please!
📍 Address / Notes: `;
}

export function formatDishOrderMessage(dishName: string, price: number): string {
  return `Hello TASTY! 👋
I would like to order:
🍽️ ${dishName} (€${price.toFixed(2)})

🛵 Delivery / Pickup please!
📍 Address / Notes: `;
}

export type OrderType = 'delivery' | 'pickup';

export function formatCartOrderMessage(params: {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderType: OrderType;
  customerName: string;
  address: string;
  notes: string;
}): string {
  const lines = params.items.map((item) => {
    const lineTotal = (item.price * item.quantity).toFixed(2);
    const details = item.customizations && item.customizations.length > 0
      ? '\n' + item.customizations.map((c) => `   ↳ ${c}`).join('\n')
      : '';
    return `• ${item.quantity}x ${item.name} — €${lineTotal}${details}`;
  });

  const typeLine = params.orderType === 'delivery' ? '🛵 Order type: DELIVERY' : '🏪 Order type: PICKUP (I will collect it at the shop)';
  const parts = [
    'Hello TASTY! 👋',
    'I would like to place an order:',
    '',
    '🧾 My order:',
    ...lines,
    '',
    `🧮 Subtotal: €${params.subtotal.toFixed(2)}`,
    ...(params.orderType === 'delivery' ? [`🛵 Delivery fee: €${params.deliveryFee.toFixed(2)}`] : []),
    `💰 Total: €${params.total.toFixed(2)}`,
    typeLine,
  ];

  if (params.customerName.trim()) parts.push(`👤 Name: ${params.customerName.trim()}`);
  if (params.orderType === 'delivery') parts.push(`📍 Delivery address: ${params.address.trim()}`);
  if (params.notes.trim()) parts.push(`📝 Notes: ${params.notes.trim()}`);

  return parts.join('\n');
}


export function formatGeneralInquiryMessage(): string {
  return `Hello TASTY! 👋
I would like to place an order for delivery or pickup in Hilversum.`;
}
