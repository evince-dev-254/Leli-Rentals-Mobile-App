# Tailwind CSS Setup for Leli Rentals

This guide shows how to set up and use Tailwind CSS with NativeWind in your React Native/Expo app.

## Installation

Run these commands to install the required dependencies:

```bash
npm install tailwindcss nativewind
```

## Configuration Files Created

### 1. `tailwind.config.js`
- Custom color palette matching Leli Rentals brand
- Extended theme with your specific colors
- Content paths for all your app files

### 2. `babel.config.js` (Updated)
- Added `nativewind/babel` plugin
- Enables Tailwind CSS processing

### 3. `global.css`
- Tailwind base, components, and utilities
- Imported in `app/_layout.tsx`

### 4. `nativewind-env.d.ts`
- TypeScript declarations for NativeWind
- Added to `tsconfig.json`

## How to Use Tailwind Classes

### Basic Usage
Replace StyleSheet with className props:

```tsx
// Before (StyleSheet)
<View style={styles.container}>
  <Text style={styles.title}>Hello World</Text>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefce8',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
  },
});

// After (Tailwind)
<View className="flex-1 bg-background p-4">
  <Text className="text-2xl font-bold text-text-primary">Hello World</Text>
</View>
```

### Custom Colors Available

Your Tailwind config includes all your brand colors:

```tsx
// Primary colors
className="bg-primary-brand text-primary-foreground"

// Background colors
className="bg-background bg-card bg-muted-background"

// Text colors
className="text-text-primary text-text-secondary text-text-light"

// Vibrant colors
className="bg-vibrant-plum bg-vibrant-green bg-vibrant-orange"

// Category colors
className="bg-category-electronics bg-category-tools bg-category-vehicles"
```

### Example Components

See `components/TailwindExample.tsx` for a complete example showing:
- Layout with flexbox
- Typography with custom fonts
- Cards with shadows
- Buttons with custom colors
- Status indicators

## Migration Strategy

1. **Start with new components** - Use Tailwind for new components
2. **Gradually migrate** - Update existing components one by one
3. **Keep StyleSheet as fallback** - For complex animations or platform-specific styles

## Benefits

- **Faster development** - No need to write custom styles
- **Consistent design** - Predefined color palette and spacing
- **Responsive design** - Built-in responsive utilities
- **Better maintainability** - Utility-first approach

## Next Steps

1. Install the dependencies: `npm install tailwindcss nativewind`
2. Start using Tailwind classes in your components
3. Gradually migrate existing StyleSheet components
4. Use the custom color palette for consistent branding

## Troubleshooting

If you encounter issues:
1. Make sure NativeWind is properly installed
2. Check that babel.config.js includes the nativewind/babel plugin
3. Ensure global.css is imported in your root layout
4. Restart your development server after configuration changes
