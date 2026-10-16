// Shop schedule helpers. The shop is in the Netherlands, so "today" is always
// evaluated in Amsterdam time, no matter where the customer's phone is.
export const SHOP_TIME_ZONE = 'Europe/Amsterdam';
export const CLOSED_WEEKDAY = 'Monday';

export const CLOSED_TITLE = "We're closed today";
export const CLOSED_TEXT =
  "We're closed on Mondays, so we can't take orders today. We're back tomorrow at 11:00!";

export function isShopClosedToday(now: Date = new Date()): boolean {
  const weekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: SHOP_TIME_ZONE,
  }).format(now);
  return weekday === CLOSED_WEEKDAY;
}
