export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  tags: string[];
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
  colors?: string[];
  sizes?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'packaging' | 'delivering' | 'done';
  createdAt: number;
  address: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
}

export type Category = 'All' | 'Electronics' | 'Fashion' | 'Home & Living' | 'Beauty' | 'Sports' | 'Books' | 'Toys';
