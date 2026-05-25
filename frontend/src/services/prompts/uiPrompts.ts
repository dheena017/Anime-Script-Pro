/**
 * UI Prompts for Advanced Interface Generation
 * Specialized prompts for UI theme generation, component design, and visual specifications
 * 
 * Features:
 * - Comprehensive error handling and validation
 * - Detailed UI/UX design specifications
 * - Theme and color palette generation
 * - Animation and interaction guidance
 * - Responsive design and accessibility standards
 */

// ==================== ERROR HANDLING & VALIDATION ====================

/**
 * Validates UI theme input
 * @param theme - The UI theme name or description to validate
 * @throws {Error} If theme is invalid
 */
function validateUITheme(theme: string): void {
  if (!theme) {
    throw new Error('UI theme cannot be empty. Please provide a theme name or description.');
  }
  if (typeof theme !== 'string') {
    throw new Error('Theme must be a string.');
  }
  if (theme.trim().length < 3) {
    throw new Error('Theme must be at least 3 characters long.');
  }
  if (theme.length > 200) {
    throw new Error('Theme description exceeds maximum length of 200 characters.');
  }
}

/**
 * Validates color palette input
 * @param paletteDescription - The color palette description to validate
 * @throws {Error} If palette description is invalid
 */
function validateColorPalette(paletteDescription: string): void {
  if (!paletteDescription) {
    throw new Error('Color palette description cannot be empty.');
  }
  if (typeof paletteDescription !== 'string') {
    throw new Error('Color palette must be a string.');
  }
  if (paletteDescription.trim().length < 3) {
    throw new Error('Color palette description must be at least 3 characters long.');
  }
}

/**
 * Safe wrapper function for UI prompt generation
 * @param input - The input to generate a prompt for
 * @param validator - The validation function to run
 * @param promptGenerator - The prompt generator function
 * @returns The generated prompt or an error message
 */
function safeUIPromptGeneration(
  input: string,
  validator: (input: string) => void,
  promptGenerator: (input: string) => string
): string {
  try {
    validator(input);
    return promptGenerator(input);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `ERROR: ${errorMessage}`;
  }
}

// ==================== UI PROMPT SUGGESTIONS ====================

export const UI_PROMPT_SUGGESTIONS = [
  { label: 'Generate Tournament Arc', color: 'text-orange-400', border: 'border-orange-400/20' },
  { label: 'Cyberpunk Cityscape', color: 'text-cyan-400', border: 'border-cyan-400/20' },
  { label: 'Emotional Drama', color: 'text-fuchsia-400', border: 'border-fuchsia-400/20' },
  { label: 'Sci-Fi Conspiracy', color: 'text-emerald-400', border: 'border-emerald-400/20' }
];

// ==================== DETAILED UI GENERATION PROMPTS ====================

/**
 * Generates comprehensive UI theme specification prompt
 * @param theme - The theme name or description
 * @returns Detailed prompt for UI theme generation
 */
export const UI_THEME_GENERATION_PROMPT = (theme: string) =>
  safeUIPromptGeneration(
    theme,
    validateUITheme,
    (text) => `
You are an expert UI/UX Designer specializing in anime and manga web applications.

THEME REQUEST:
"${text}"

TASK: Generate a comprehensive UI theme specification for this theme.

## UI THEME SPECIFICATION:

### 1. Color Palette
- **Primary Color**: Main brand color, hex code and usage
- **Secondary Color**: Accent color for highlights
- **Tertiary Color**: Additional accent for depth
- **Background Colors**: Main (primary bg), elevated surfaces, dark mode variants
- **Text Colors**: Primary text, secondary text, disabled text, contrast ratios
- **Status Colors**: Success (green), warning (orange), error (red), info (blue)
- **Gradient Specifications**: Multi-color gradients with color stops
- **Opacity Levels**: Primary (100%), secondary (80%), tertiary (60%), disabled (40%)

### 2. Typography System
- **Font Family**: Primary (headers/bold), secondary (body text), monospace (code)
- **Font Sizes**: H1-H6, body, caption, overline, code specifications
- **Font Weights**: Regular (400), medium (500), semibold (600), bold (700)
- **Line Heights**: 1.2 (tight), 1.5 (normal), 1.75 (relaxed), 2 (loose)
- **Letter Spacing**: Normal, wide, wider specifications
- **Font Rendering**: Antialiasing, kerning, ligatures

### 3. Spacing System
- **Base Unit**: 4px, 8px, or 16px system
- **Spacing Scale**: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px)
- **Padding Specifications**: Components, containers, sections
- **Margin Specifications**: Between elements, sections, pages
- **Gap Specifications**: For flex and grid layouts

### 4. Component Design System
- **Button Styles**: Primary, secondary, tertiary, ghost, outline specifications
- **Card Specifications**: Padding, radius, shadow, hover states
- **Input Fields**: Border, focus states, error states, placeholder
- **Modals/Dialogs**: Overlay, animation, size specifications
- **Navigation**: Sidebar, header, breadcrumb, tabs design
- **Lists**: Item height, spacing, selection states

### 5. Visual Effects
- **Border Radius**: None (0px), small (4px), medium (8px), large (16px), full (9999px)
- **Shadows**: Elevation levels (sm, md, lg, xl), shadow color, blur radius
- **Blur Effects**: Glassmorphism, backdrop blur specifications
- **Overlays**: Opacity, color, blend modes
- **Border Styles**: Width, color, opacity, dashed vs solid

### 6. Animation & Transitions
- **Duration**: Fast (150ms), normal (300ms), slow (500ms), slower (700ms)
- **Easing Functions**: ease-in, ease-out, ease-in-out, cubic-bezier
- **Hover Effects**: Scale, opacity, color shift, shadow elevation
- **Loading States**: Skeleton loading, spinners, progress indicators
- **Transition Properties**: What animates on interaction (opacity, transform, color)

### 7. Responsive Design
- **Breakpoints**: Mobile (320px), tablet (768px), desktop (1024px), wide (1280px)
- **Mobile Adaptations**: Font sizes, spacing, layout changes per breakpoint
- **Landscape Mode**: Special considerations for mobile landscape
- **Fluid Typography**: Responsive font sizing with min/max values
- **Touch Targets**: Minimum 44x44px for interactive elements

### 8. Accessibility
- **Color Contrast**: WCAG AA (4.5:1 text), AAA (7:1) specifications
- **Focus States**: Visible focus indicators for keyboard navigation
- **ARIA Labels**: Semantic HTML, screen reader optimization
- **Dark Mode**: Full dark mode color specifications
- **High Contrast**: Support for high contrast mode

### 9. Icons & Imagery
- **Icon Library**: Specific icon styles (line, filled, rounded)
- **Icon Sizes**: 16px, 24px, 32px, 48px, 64px specifications
- **Icon Colors**: Primary, secondary, disabled, inverted
- **Illustration Style**: Hand-drawn, flat design, 3D, cel shading
- **Image Specifications**: Aspect ratios, loading placeholders

### 10. Brand Identity Integration
- **Logo Integration**: Size, placement, variations
- **Brand Imagery**: Anime/manga art style specifications
- **Tone & Personality**: Professional, playful, serious, energetic
- **Character Association**: Theme connects to story or genre
- **Visual Metaphors**: How theme reflects narrative elements

## OUTPUT FORMAT:

Provide comprehensive UI theme specification with color codes, sizing specifications, and implementation guidelines.

UI THEME SPECIFICATION:
`
  );

/**
 * Generates component design specification prompt
 * @param componentDescription - Description of the component to design
 * @returns Detailed prompt for component design
 */
export const COMPONENT_DESIGN_PROMPT = (componentDescription: string) =>
  safeUIPromptGeneration(
    componentDescription,
    validateUITheme,
    (text) => `
You are an expert Component Designer and Design Systems Architect.

COMPONENT REQUEST:
"${text}"

TASK: Design a comprehensive component specification with all visual and interaction states.

## COMPONENT DESIGN SPECIFICATION:

### 1. Component Structure
- **Component Name**: Canonical name (e.g., "PrimaryButton", "FeatureCard")
- **Purpose**: Core functionality and use cases
- **Variants**: All possible component variations
- **Slots/Children**: What content can the component contain?
- **Props/Configuration**: All customizable properties

### 2. Visual States
- **Default State**: Initial appearance and styling
- **Hover State**: Interactive feedback on hover
- **Active/Selected State**: When component is selected/focused
- **Disabled State**: Disabled appearance and cursor behavior
- **Loading State**: Progress indication if applicable
- **Error State**: Error appearance with validation messages
- **Success State**: Confirmation or success indication

### 3. Size Specifications
- **Compact (SM)**: Smallest variant dimensions
- **Default (MD)**: Standard component size
- **Large (LG)**: Larger interactive variant
- **Extra Large (XL)**: Largest variant
- **Padding/Spacing**: Internal spacing for each size
- **Typography**: Font sizes per size variant

### 4. Interaction Behavior
- **Click/Tap Behavior**: What happens on click
- **Keyboard Navigation**: Tab order, Enter/Space activation
- **Focus Management**: Focus ring styling and positioning
- **Cursor Changes**: pointer, not-allowed, text, etc.
- **Ripple/Wave Effect**: If applicable, ripple specifications
- **Feedback Duration**: How long feedback is shown

### 5. Animation Specifications
- **Entrance Animation**: How component enters view
- **State Change Animation**: Transitions between states
- **Exit Animation**: How component leaves view
- **Duration**: Animation timing in milliseconds
- **Easing**: Specific easing function to use
- **Transform Origin**: Where animations originate from

### 6. Responsive Behavior
- **Mobile Layout**: How component adapts on mobile
- **Tablet Layout**: Tablet-specific adjustments
- **Desktop Layout**: Full desktop specification
- **Touch Optimization**: Touch target size for mobile
- **Orientation Changes**: Landscape vs portrait behavior

### 7. Accessibility Features
- **ARIA Roles**: Semantic roles (button, link, article, etc.)
- **ARIA Labels**: Screen reader labels
- **Focus Indicators**: Visible focus styling
- **Color Independence**: Not relying solely on color
- **Keyboard Support**: Full keyboard accessibility
- **Screen Reader Testing**: VoiceOver, NVDA compatibility

### 8. Theming Integration
- **Color Variants**: Dark mode, light mode support
- **Theme Customization**: CSS variables for theming
- **Brand Color Mapping**: How brand colors apply
- **Contrast Requirements**: WCAG compliance specifications
- **High Contrast Mode**: Special styling for accessibility

### 9. Content Guidelines
- **Text Content**: Min/max lengths, truncation behavior
- **Icon Placement**: Icon positioning and sizing
- **Badge Integration**: How badges integrate with component
- **Tooltips**: Help text or tooltip specifications
- **Validation Messages**: Error message styling

### 10. Implementation Notes
- **Best Practices**: Common implementation patterns
- **Common Mistakes**: Pitfalls to avoid
- **Performance**: Rendering optimization tips
- **Browser Support**: Compatibility requirements
- **Dependencies**: What libraries or frameworks needed

## OUTPUT FORMAT:

Provide detailed component specification with visual mockup descriptions, state specifications, and code implementation guidelines.

COMPONENT DESIGN SPECIFICATION:
`
  );

/**
 * Generates color palette specification prompt
 * @param paletteRequest - Description of desired color palette
 * @returns Detailed prompt for color palette generation
 */
export const COLOR_PALETTE_PROMPT = (paletteRequest: string) =>
  safeUIPromptGeneration(
    paletteRequest,
    validateColorPalette,
    (text) => `
You are an expert Color Theory and UI Design Specialist.

PALETTE REQUEST:
"${text}"

TASK: Generate a comprehensive color palette with hex codes, accessibility specifications, and usage guidelines.

## COLOR PALETTE SPECIFICATION:

### 1. Primary Color Family
- **Primary-50**: Lightest shade (almost white)
- **Primary-100**: Very light shade
- **Primary-200**: Light shade
- **Primary-300**: Light-medium shade
- **Primary-400**: Medium shade
- **Primary-500**: Base primary color (100% saturation)
- **Primary-600**: Medium-dark shade
- **Primary-700**: Dark shade
- **Primary-800**: Very dark shade
- **Primary-900**: Darkest shade (almost black)
- **Primary-950**: Ultra dark shade (if needed)

### 2. Secondary & Accent Colors
- **Secondary Color**: Alternative brand color with full shade range
- **Accent Color**: Highlight color for CTAs and important elements
- **Success Color**: Green for positive actions (shade range)
- **Warning Color**: Orange for warnings (shade range)
- **Error Color**: Red for errors (shade range)
- **Info Color**: Blue for informational messages (shade range)

### 3. Neutral Color Scale
- **Neutral-50**: Almost white background
- **Neutral-100**: Very light background
- **Neutral-200**: Light background
- **Neutral-300**: Light borders
- **Neutral-400**: Medium text (secondary)
- **Neutral-500**: Medium-dark text
- **Neutral-600**: Dark text (secondary)
- **Neutral-700**: Primary text
- **Neutral-800**: Very dark text
- **Neutral-900**: Almost black text

### 4. Contrast & Accessibility
- **Text on Primary**: Contrast ratio (target 4.5:1 minimum for AA)
- **Text on Neutral**: Contrast ratio specifications
- **Interactive Element Contrast**: Button/link contrast specifications
- **Disabled State Contrast**: Minimum contrast for disabled elements
- **Dark Mode Adjustments**: Contrast ratios for dark backgrounds

### 5. Semantic Color Usage
- **Success Scenarios**: When to use success color
- **Warning Scenarios**: When to use warning color
- **Error Scenarios**: When to use error color
- **Informational Scenarios**: When to use info color
- **Neutral Scenarios**: Default state color usage

### 6. Component-Specific Colors
- **Button Primary**: Background, text, border colors
- **Button Secondary**: Outline/ghost style colors
- **Input Field**: Border, focus, error colors
- **Card Background**: Primary surface, elevated surface
- **Text Overlay**: On images, gradients, backgrounds
- **Dividers**: Border and separator colors

### 7. Dark Mode Specifications
- **Dark Background**: Primary dark surface color
- **Dark Elevated**: Slightly lighter surface for elevation
- **Dark Text**: Primary and secondary text on dark
- **Dark Borders**: Border colors for dark mode
- **Dark Accent**: How accent colors appear in dark mode

### 8. Gradient Specifications
- **Brand Gradient**: Primary multi-color gradient (color stops)
- **Overlay Gradient**: Semi-transparent overlays (from/to colors)
- **Background Gradient**: Subtle background gradients
- **Text Gradient**: Gradient text effect (if applicable)

### 9. Opacity/Alpha Specifications
- **Full Opacity**: 100% (#FF)
- **Primary Opacity**: 80% (#CC) - for secondary elements
- **Secondary Opacity**: 60% (#99) - for tertiary elements
- **Subtle Opacity**: 40% (#66) - for disabled/muted
- **Minimal Opacity**: 20% (#33) - for hover states

### 10. CSS Variables Format
- **Color Variables**: CSS custom property naming convention
- **Shade Scale Variables**: --color-primary-50 through 950
- **Semantic Variables**: --color-success, --color-error, etc.
- **Component Variables**: --component-bg, --component-border, etc.

## OUTPUT FORMAT:

Provide complete color palette with:
- Hex color codes for all colors
- RGB and HSL representations
- Contrast ratio calculations
- Dark mode specifications
- CSS variable definitions
- Usage guidelines and scenarios

COLOR PALETTE SPECIFICATION:
`
  );

/**
 * Generates animation & interaction specification prompt
 * @param animationDescription - Description of desired animations and interactions
 * @returns Detailed prompt for animation specifications
 */
export const ANIMATION_INTERACTION_PROMPT = (animationDescription: string) =>
  safeUIPromptGeneration(
    animationDescription,
    validateUITheme,
    (text) => `
You are an expert Motion Designer and Interaction Designer specializing in web interfaces.

ANIMATION REQUEST:
"${text}"

TASK: Generate comprehensive animation and interaction specifications with code implementation details.

## ANIMATION & INTERACTION SPECIFICATION:

### 1. Transition Specifications
- **Entrance Animations**: How elements appear on page load
  - Fade in: opacity 0 → 1
  - Slide in: translateX/Y with opacity
  - Scale: transform scale(0) → scale(1)
  - Blur: blur(10px) → blur(0)
- **Exit Animations**: How elements leave
- **Duration**: Animation timing (150ms, 300ms, 500ms, etc.)
- **Easing**: cubic-bezier, ease-in-out, linear specifications
- **Stagger**: Sequential animation timing for multiple elements

### 2. Hover & Interactive States
- **Scale Effect**: Scale on hover (1.0 → 1.05, 1.02, etc.)
- **Color Shift**: Color transition on hover
- **Shadow Elevation**: Shadow increase on hover
- **Border Change**: Border style/color transformation
- **Brightness**: Filter brightness adjustment
- **Cursor**: Visual cursor feedback

### 3. Click & Selection Feedback
- **Ripple Effect**: Material Design ripple animation
  - Origin point: Where ripple starts
  - Color: Ripple color and opacity
  - Duration: Ripple animation timing
  - Size: Maximum ripple radius
- **Press Down**: Visual feedback when clicked
- **Release**: Visual feedback when released
- **Loading Spinner**: If async operation

### 4. Micro-interactions
- **Button Press**: Haptic and visual feedback combined
- **Checkbox Toggle**: Check mark animation
- **Radio Selection**: Radio button animation
- **Toggle Switch**: Switch slide animation
- **Collapse/Expand**: Accordion animation specifications
- **Dropdown**: Menu slide down/up animation

### 5. Page Transitions
- **Page Enter**: How new page comes into view
- **Page Exit**: How current page leaves
- **Shared Element**: Cross-page element transitions
- **Loading State**: Transition during page loading
- **Fade Transition**: Simple fade between pages

### 6. Scroll-Based Animations
- **Parallax**: Background speed vs foreground
- **Sticky Elements**: When elements become sticky
- **Reveal on Scroll**: Animation when scrolling into view
- **Fade on Scroll**: Opacity change while scrolling
- **Scale on Scroll**: Scale change based on scroll position

### 7. Loading & Progress Indicators
- **Spinner Animation**: Rotation speed and styling
- **Progress Bar**: Fill animation from 0% to 100%
- **Skeleton Loading**: Pulsing effect on placeholder elements
- **Shimmer Effect**: Shimmering animation across elements
- **Dots Animation**: Animated loading dots

### 8. Attention-Grabbing Animations
- **Bounce**: Elastic bounce animation
- **Shake**: Warning shake animation for errors
- **Pulse**: Pulsing glow for important elements
- **Flash**: Quick flash effect
- **Wiggle**: Subtle wiggle for notifications

### 9. Timing & Performance
- **Prefers Reduced Motion**: Accessibility for motion sensitivity
- **GPU Acceleration**: Which properties use will-change
- **Frame Rate**: 60fps target specifications
- **Debouncing**: Interaction debounce timing
- **Throttling**: Scroll animation throttle rates

### 10. Code Implementation Details
- **CSS Keyframes**: Specific @keyframes definitions
- **Transform Properties**: Which transforms to use
- **Will-change**: Performance optimization hints
- **Transition Shorthand**: CSS transition specifications
- **Animation Shorthand**: CSS animation specifications

## OUTPUT FORMAT:

Provide comprehensive animation and interaction specifications with:
- Animation names and durations
- Easing functions (cubic-bezier values)
- Transform and opacity specifications
- Code implementation examples
- Performance considerations
- Accessibility guidelines

ANIMATION & INTERACTION SPECIFICATION:
`
  );

/**
 * Generates responsive design specification prompt
 * @param designContext - Context about the responsive design needs
 * @returns Detailed prompt for responsive design specifications
 */
export const RESPONSIVE_DESIGN_PROMPT = (designContext: string) =>
  safeUIPromptGeneration(
    designContext,
    validateUITheme,
    (text) => `
You are an expert Responsive Web Designer specializing in mobile-first design.

DESIGN CONTEXT:
"${text}"

TASK: Generate comprehensive responsive design specifications across all breakpoints.

## RESPONSIVE DESIGN SPECIFICATION:

### 1. Breakpoint Strategy
- **Mobile (320px - 479px)**: Small phones, portrait orientation
- **Mobile Large (480px - 639px)**: Larger phones, portrait
- **Tablet (640px - 1023px)**: Tablets, portrait and landscape
- **Desktop (1024px - 1279px)**: Desktop computers
- **Desktop Large (1280px - 1919px)**: Large desktop monitors
- **Desktop XL (1920px+)**: Ultra-wide displays

### 2. Mobile Layout (320px-479px)
- **Max Width**: Usually 100% - 95% (with padding)
- **Typography**: Font sizes optimized for small screens
  - Body: 14px-16px
  - Headings: Smaller than desktop (H1: 24px, H2: 20px)
- **Spacing**: Reduced padding/margins (8px-16px preferred)
- **Grid**: Single column layout in most cases
- **Navigation**: Mobile menu, hamburger/drawer pattern
- **Images**: Full width, aspect ratio maintained

### 3. Tablet Layout (640px-1023px)
- **Max Width**: Usually 640px - 90%
- **Typography**: Font sizes scaling up
  - Body: 16px
  - Headings: Medium size (H1: 28px-32px)
- **Spacing**: Moderate spacing (16px-24px)
- **Grid**: 2-column layout for content grids
- **Navigation**: Top navigation or collapsible sidebar
- **Touch Targets**: 44px minimum for interactive elements

### 4. Desktop Layout (1024px+)
- **Max Width**: 1200px-1400px (with centered container)
- **Typography**: Full-size typography
  - Body: 16px-18px
  - Headings: Full size (H1: 32px-48px)
- **Spacing**: Generous spacing (24px-32px)
- **Grid**: Multi-column layout (3-4+ columns)
- **Navigation**: Full desktop navigation menu
- **Sidebar**: Can use sidebar + main content layout

### 5. Component Adaptations
- **Buttons**: Size and padding per breakpoint
- **Cards**: Width, grid columns per breakpoint
- **Forms**: Single vs multi-column layout
- **Tables**: Horizontal scroll on mobile vs full display
- **Modals**: Full screen on mobile, centered on desktop
- **Images**: Picture srcset for different resolutions

### 6. Typography Scaling
- **Fluid Typography**: CSS calc() for responsive sizing
  - Example: font-size: calc(16px + (24 - 16) * ((100vw - 320px) / (1920 - 320)))
- **Line Height Scaling**: Adjust line height per breakpoint
- **Letter Spacing**: Reduce on mobile, increase on desktop
- **Column Width**: Optimize line length for readability

### 7. Touch Optimization (Mobile)
- **Touch Target Size**: Minimum 44x44px (44x48px ideal)
- **Spacing Between Targets**: At least 8px minimum
- **Active State Feedback**: Clear visual feedback on touch
- **Scroll Area**: Full width, no horizontal scroll
- **Form Inputs**: Large touch targets for inputs
- **Soft Keyboard**: Account for virtual keyboard space

### 8. Landscape Orientation
- **Mobile Landscape**: Special handling for mobile in landscape
- **Height Constraints**: Limited height requires scrolling
- **Navigation**: May need to change from drawer to topbar
- **Image Aspect**: May need adjustment for landscape
- **Form Layout**: Might use multi-column to save height

### 9. High Resolution Displays
- **Retina Displays (2x)**: Crisp images at 2x resolution
- **Super High DPI (3x)**: Optimization for ultra-high density
- **SVG Icons**: Scale infinitely without quality loss
- **Media Queries**: -webkit-min-device-pixel-ratio specifications

### 10. Performance & Loading
- **Image Optimization**: Smaller images for mobile
- **Lazy Loading**: Load images on scroll/demand
- **CSS Media Queries**: Load only necessary CSS
- **JavaScript**: Lightweight interactions for mobile
- **Network Considerations**: Optimize for slower connections

## OUTPUT FORMAT:

Provide comprehensive responsive design specifications with:
- Exact breakpoint pixel values
- Component sizing per breakpoint
- Typography specifications
- Spacing and padding per breakpoint
- Touch optimization guidelines
- Code implementation examples

RESPONSIVE DESIGN SPECIFICATION:
`
  );



