# Component Documentation

## Layout Components

### Navbar Component
**Location**: `src/components/layout/Navbar.tsx`

**Description**: Fixed navigation bar with search functionality, logo, and authentication links.

**Features**:
- Search bar with icon
- Centered brand logo
- Desktop navigation links
- Mobile responsive menu
- Login CTA button

**Props**: None (self-contained)

**Usage**:
```tsx
import Navbar from '@/components/layout/Navbar';

<Navbar />
```

---

### Footer Component
**Location**: `src/components/layout/Footer.tsx`

**Description**: Site-wide footer with navigation and information.

**Features**:
- Brand information
- Quick links section
- Account links section
- Copyright notice

**Props**: None

**Usage**:
```tsx
import Footer from '@/components/layout/Footer';

<Footer />
```

---

## Home Components

### HeroSection Component
**Location**: `src/components/home/HeroSection.tsx`

**Description**: Landing page hero section with headline, description, and product showcase.

**Features**:
- Large headline with supporting text
- Dual CTA buttons (Shop Now, Learn More)
- Product showcase grid with 4 product categories
- Decorative gradient elements
- Fully responsive design

**Props**: None

**Usage**:
```tsx
import HeroSection from '@/components/home/HeroSection';

<HeroSection />
```

---

## Type Definitions

### Product Type
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  featured?: boolean;
}
```

### User Type
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: Address;
  createdAt: Date;
}
```

### Cart Type
```typescript
interface Cart {
  items: CartItem[];
  total: number;
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}
```

### Order Type
```typescript
interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Utility Functions

### formatCurrency(amount: number)
Formats a number as PHP currency.

### formatDate(date: Date)
Formats a date object to a readable string.

### truncateText(text: string, maxLength: number)
Truncates text to specified length with ellipsis.

### generateSlug(text: string)
Generates a URL-friendly slug from text.

### isValidEmail(email: string)
Validates email format.

### isValidPhoneNumber(phone: string)
Validates Philippine phone number format.

---

## Page Structure

All pages follow this structure:
```tsx
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PageName() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow pt-16">
        {/* Page content */}
      </main>
      <Footer />
    </div>
  );
}
```

---

## Styling Guidelines

### Color Palette
- **Primary**: Black (#000000) - CTA buttons, important text
- **Background**: Gray shades (#F3F4F6, #F9FAFB) - Backgrounds
- **Text**: Gray-900 (#111827) - Headings
- **Text Secondary**: Gray-600 (#4B5563) - Body text
- **Accent**: Blue, Yellow - Product cards

### Spacing
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Section padding: `py-12` or `py-16`
- Card gap: `gap-4` or `gap-8`

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: `text-4xl sm:text-5xl lg:text-6xl font-bold`
- **Body**: `text-base sm:text-lg`
- **Small**: `text-sm`

### Responsive Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

---

## Future Components to Add

### UI Components
- Button
- Input
- Card
- Modal
- Toast notifications
- Loading spinner
- Badge
- Dropdown

### Product Components
- ProductCard
- ProductGrid
- ProductDetail
- ProductFilter
- ProductSearch

### Auth Components
- LoginForm
- RegisterForm
- PasswordReset
- UserProfile

### Cart Components
- CartItem
- CartSummary
- CheckoutForm
- OrderSummary

### Admin Components
- ProductManager
- OrderManager
- UserManager
- Dashboard
