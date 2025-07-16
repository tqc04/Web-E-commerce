# Layout Optimization Guide

## Overview
Frontend đã được tối ưu với layout chuẩn, spacing đẹp và responsive design tốt hơn cho tất cả các trang.

## Key Improvements

### 1. Theme Optimization (`src/theme/theme.ts`)
- **Spacing**: Sử dụng spacing 8px base unit
- **Typography**: Cải thiện line-height và margin cho headings
- **Colors**: Sử dụng color palette chuẩn với text.primary và text.secondary
- **Components**: Tối ưu Container, Button, Card, TextField với responsive padding

### 2. App Layout (`src/App.tsx`)
- **Flexbox Layout**: Sử dụng flexbox để đảm bảo footer luôn ở cuối
- **Responsive Padding**: Padding thay đổi theo breakpoint
- **Theme Integration**: Tích hợp ThemeProvider và CssBaseline

### 3. Component Updates

#### Navbar (`src/components/Navbar.tsx`)
- **Sticky Position**: Navbar sticky thay vì fixed
- **Responsive Design**: Mobile drawer với search bar
- **User Menu**: Dropdown menu đẹp hơn với user info
- **Categories Menu**: Popper menu với smooth transitions

#### Footer (`src/components/Footer.tsx`)
- **Light Theme**: Sử dụng light theme thay vì dark
- **Responsive Grid**: Grid layout responsive cho mobile
- **Newsletter Section**: Form đăng ký newsletter
- **Social Links**: Icons với hover effects

#### HomePage (`src/pages/HomePage.tsx`)
- **Hero Section**: Gradient background với responsive text
- **Stats Section**: Cards với hover effects
- **Categories**: Grid responsive 6 columns → 2 columns mobile
- **Featured Products**: Cards với badges và ratings
- **Testimonials**: Avatar và ratings
- **CTA Section**: Call-to-action với gradient background

#### LoginPage (`src/pages/LoginPage.tsx`)
- **Container Layout**: Sử dụng Container thay vì full-screen
- **Social Login**: Buttons với brand colors
- **Form Layout**: Stack spacing cho form fields
- **Responsive Design**: Mobile-friendly layout

### 4. Global CSS (`src/index.css`)
- **Reset Styles**: CSS reset cho consistency
- **Utility Classes**: Margin, padding, flexbox utilities
- **Responsive Text**: Font size responsive
- **Animations**: Fade-in và slide-up animations
- **Scrollbar**: Custom scrollbar styling

### 5. Layout Component (`src/components/Layout.tsx`)
- **Wrapper Component**: Đảm bảo layout chuẩn cho tất cả pages
- **Responsive Container**: Container với responsive padding
- **Flexible Props**: maxWidth và sx props để customize

## Usage Examples

### Using Layout Component
```tsx
import Layout from '../components/Layout'

const MyPage = () => {
  return (
    <Layout maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h1">My Page</Typography>
      <Grid container spacing={3}>
        {/* Content */}
      </Grid>
    </Layout>
  )
}
```

### Responsive Grid
```tsx
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    {/* Card content */}
  </Grid>
</Grid>
```

### Responsive Typography
```tsx
<Typography 
  variant="h1" 
  sx={{ 
    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
    textAlign: { xs: 'center', md: 'left' }
  }}
>
  Responsive Heading
</Typography>
```

### Responsive Spacing
```tsx
<Box sx={{ 
  py: { xs: 2, sm: 3, md: 4 },
  px: { xs: 2, sm: 3, md: 4 }
}}>
  {/* Content */}
</Box>
```

## Breakpoints
- **xs**: 0px - 599px (Mobile)
- **sm**: 600px - 959px (Tablet)
- **md**: 960px - 1279px (Small Desktop)
- **lg**: 1280px - 1919px (Desktop)
- **xl**: 1920px+ (Large Desktop)

## Best Practices

### 1. Container Usage
- Sử dụng `Container` component với `maxWidth` prop
- Padding tự động responsive theo breakpoint

### 2. Grid System
- Sử dụng Material-UI Grid với responsive props
- `xs`, `sm`, `md`, `lg` cho different screen sizes

### 3. Typography
- Sử dụng theme typography variants
- Responsive fontSize với sx prop

### 4. Spacing
- Sử dụng theme spacing (8px base unit)
- Responsive spacing với breakpoint objects

### 5. Colors
- Sử dụng theme colors: `primary.main`, `text.primary`, `text.secondary`
- Consistent color palette across components

## Testing
- Test trên các screen sizes khác nhau
- Kiểm tra mobile navigation
- Verify responsive typography
- Test hover effects và animations

## Performance
- CSS animations sử dụng transform thay vì position
- Lazy loading cho images
- Optimized bundle size với tree shaking 