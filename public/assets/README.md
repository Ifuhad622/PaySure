# Logo Setup Instructions

## How to Add Your Official Logo

To replace the placeholder logo with your official MelHad Investment logo:

### 1. Logo Files Needed
- **Main Logo**: `logo.png` (for light backgrounds)
- **White Logo**: `logo-white.png` (for dark backgrounds like footer)

### 2. File Specifications
- **Format**: PNG with transparent background (recommended)
- **Size**: 200x200 pixels minimum (vector/high resolution preferred)
- **Aspect Ratio**: Square or rectangular (will be automatically fitted)

### 3. File Placement
Place your logo files in this directory:
```
public/assets/
├── logo.png        (Main logo for header)
├── logo-white.png  (White version for footer)
└── README.md       (This file)
```

### 4. Alternative Formats
If you don't have PNG files, you can also use:
- `.jpg` or `.jpeg`
- `.svg` (vector format - best quality)
- `.webp`

Just update the file extensions in the HTML:
- Header logo: `public/index.html` line with `src="./assets/logo.png"`
- Footer logo: `public/index.html` line with `src="./assets/logo-white.png"`

### 5. Fallback
If no logo files are provided, the system will automatically show a building icon placeholder.

### 6. Testing
After adding your logo files:
1. Refresh the website
2. Check that logos appear in header and footer
3. Verify they look good on both light and dark backgrounds

### Contact
If you need help with logo implementation, contact your developer.
