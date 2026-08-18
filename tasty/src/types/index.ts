export type CategoryType = 'all' | 'kapsalon' | 'manaqish' | 'bowls' | 'durum' | 'dips' | string;

export interface MenuItem {
  id: string;
  name: string;
  dutchName?: string;
  category: CategoryType;
  price: number;
  description: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  calories?: string;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isPopular?: boolean;
  image: string;
  ingredients: string[];
}

export interface CustomBowlState {
  base: string;
  protein: string;
  toppings: string[];
  sauces: string[];
  extraSide: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customizations?: string[];
}
