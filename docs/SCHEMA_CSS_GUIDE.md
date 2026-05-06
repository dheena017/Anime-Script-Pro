# Schema CSS Integration Guide

This guide explains how to use the separate CSS files created for styling API schemas and models across your Anime Script Pro project.

## 📁 CSS Files Created

### Backend Docs CSS Files (backend/static/docs/)
- **schemas.css** - Schema display components styling
- **schema-forms.css** - Form inputs and validation styling
- **api-documentation.css** - API documentation page styling
- **schemas-index.css** - Central import point for all docs stylesheets

### Backend CSS Files (backend/static/)
- **swagger-custom.css** - Custom styling for FastAPI Swagger UI at `/docs`

## 🎨 CSS Features

### 1. Schema Display (schemas.css)
- `.schema-container` - Main schema wrapper
- `.schema-header` - Schema title and metadata
- `.schema-properties` - Property list container
- `.schema-property` - Individual property styling
- `.schema-type-badge` - Type indicators (object, array, string, number, boolean)
- `.schema-nested` - Nested schema styling
- `.schema-example` - Example code blocks
- `.schema-expandable-*` - Collapsible schema sections

### 2. Schema Forms (schema-forms.css)
- `.schema-form` - Form container
- `.schema-form-field` - Individual form field
- `.schema-form-input`, `.schema-form-textarea`, `.schema-form-select` - Input elements
- `.schema-form-error` - Error state styling
- `.schema-form-array` - Array field handling
- `.schema-form-controls` - Submit/Reset/Cancel buttons
- `.schema-form-nested` - Nested form sections

### 3. API Documentation (api-documentation.css)
- `.api-documentation-container` - Main container
- `.api-endpoint-section` - Endpoint documentation block
- `.api-endpoint-method` - HTTP method badges (GET, POST, PUT, PATCH, DELETE)
- `.api-parameters-*` - Parameter tables and documentation
- `.api-response-*` - Response documentation and examples
- `.api-code-example` - Code block styling

### 4. Swagger Custom (swagger-custom.css)
- Custom styling for FastAPI Swagger UI
- Model documentation colors and layout
- Endpoint styling with method-specific colors
- Parameter and response formatting

## 📦 Integration Steps

### Step 1: Backend Docs CSS Is Loaded Automatically

The `/docs` page uses backend Swagger styling. No frontend import is required.

`backend/static/swagger-custom.css` imports:
```css
@import url('/static/docs/schemas-index.css');
```
This loads the docs CSS for Swagger UI at `/docs`.

### Step 2: Use Schema Classes in Components

**Example: Schema Display Component**
```tsx
export function SchemaDisplay({ schema }: { schema: any }) {
  return (
    <div className="schema-container">
      <div className="schema-header">
        <h2 className="schema-title">
          {schema.name}
          <span className="schema-type-badge object">Object</span>
        </h2>
      </div>
      
      <div className="schema-properties">
        {Object.entries(schema.properties).map(([key, prop]: [string, any]) => (
          <div key={key} className="schema-property">
            <div className="schema-property-name">{key}</div>
            <div className="schema-property-type">{prop.type}</div>
            {prop.required && <span className="schema-property-required">Required</span>}
            {!prop.required && <span className="schema-property-optional">Optional</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Example: Schema Form Component**
```tsx
export function SchemaForm({ schema, onSubmit }: { schema: any; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="schema-form" onSubmit={handleSubmit}>
      {Object.entries(schema.properties).map(([key, prop]: [string, any]) => (
        <div key={key} className={`schema-form-field ${errors[key] ? 'error' : ''}`}>
          <label className="schema-form-label">
            {key}
            {prop.required && <span className="schema-form-required-indicator">*</span>}
          </label>
          
          {prop.type === 'string' && (
            <input
              type="text"
              className="schema-form-input"
              placeholder={prop.description}
              value={formData[key as any] || ''}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
            />
          )}
          
          {errors[key] && (
            <div className="schema-form-error-message">
              {errors[key]}
            </div>
          )}
          
          {prop.description && (
            <div className="schema-form-helper-text">
              {prop.description}
            </div>
          )}
        </div>
      ))}
      
      <div className="schema-form-controls">
        <button type="submit" className="schema-form-submit-btn">Submit</button>
        <button type="reset" className="schema-form-reset-btn">Reset</button>
      </div>
    </form>
  );
}
```

### Step 3: Enable Custom Swagger CSS in Backend

Update `backend/fastapi_app.py` to serve custom Swagger CSS:

```python
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Mount static files for custom CSS
app.mount("/static", StaticFiles(directory="backend/static"), name="static")

@app.get("/docs", include_in_schema=False)
async def get_swagger_ui_with_custom_css():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - API",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_ui_parameters={"url": app.openapi_url},
        swagger_css_url="/static/swagger-custom.css"  # Custom CSS URL
    )
```

### Step 4: API Documentation Page Usage

**Example: API Reference Page**
```tsx
export function ApiReferencePage() {
  const [endpoints, setEndpoints] = React.useState([]);

  React.useEffect(() => {
    fetch('/api/openapi.json')
      .then(r => r.json())
      .then(data => setEndpoints(Object.values(data.paths || {})));
  }, []);

  return (
    <div className="api-documentation-container">
      <div className="api-documentation-header">
        <h1 className="api-documentation-title">API Reference</h1>
        <p className="api-documentation-subtitle">Complete API Documentation</p>
      </div>

      {endpoints.map((endpoint: any, idx: number) => (
        <div key={idx} className="api-endpoint-section">
          <div className="api-endpoint-header">
            <span className="api-endpoint-method GET">GET</span>
            <div className="api-endpoint-path">
              <span className="api-endpoint-path-text">/api/endpoint</span>
            </div>
          </div>
          
          <p className="api-endpoint-description">Endpoint description</p>
          
          <div className="api-parameters-section">
            <h3 className="api-parameters-title">Parameters</h3>
            <table className="api-parameters-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="api-parameter-name">id</span></td>
                  <td><span className="api-parameter-type">string</span></td>
                  <td>Resource ID</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 🎯 Class Naming Convention

All schema-related classes follow this convention:
- `schema-*` - Schema display and structure
- `schema-form-*` - Form-related styling
- `api-*` - API documentation styling
- `api-endpoint-*` - Endpoint-specific styling
- `api-parameter-*` - Parameter styling
- `api-response-*` - Response styling

## 🎨 Color System

The CSS uses your existing design system:
- **Primary Blue**: `#60a5fa` (rgb(96, 165, 250))
- **Success Green**: `#4ade80` (rgb(74, 222, 128))
- **Warning Orange**: `#fb923c` (rgb(251, 146, 60))
- **Error Red**: `#ef4444` / `#fca5a5`
- **Purple**: `#d8b4fe` (rgb(216, 180, 254))
- **Gray**: `#d1d5db` / `#6b7280`

## 📱 Responsive Design

All CSS includes responsive breakpoints:
- Mobile: `max-width: 768px`
- Tablet: `max-width: 1024px`
- Desktop: `min-width: 1025px`

## 🔧 Customization

To customize colors or styling:

1. Edit the CSS files directly
2. Override classes in your component styles
3. Use CSS variables for dynamic theming (recommended for future)

Example override:
```css
/* In your component CSS */
.schema-container {
  border-color: rgba(your-color, 0.2);
}
```

## ✨ Features

✅ **Dark Theme**: All styles optimized for dark backgrounds
✅ **Accessibility**: Proper color contrast and semantic HTML
✅ **Responsive**: Mobile-friendly layouts
✅ **Type Badges**: Visual indicators for schema types
✅ **Validation States**: Error, success, warning visual feedback
✅ **Nested Structures**: Support for complex nested schemas
✅ **Code Examples**: Styled code blocks for examples
✅ **Form Controls**: Complete form styling with accessibility
✅ **API Documentation**: Professional API reference styling

## 📝 Usage Examples

See `src/styles/` directory for complete CSS files and examples of class names.

## 🚀 Next Steps

1. Import the styles in your main app file
2. Create schema-aware components using the provided classes
3. Test on different screen sizes
4. Customize colors/spacing as needed
5. Use in your API documentation and form pages

---

For questions or customization needs, refer to individual CSS files for detailed comments on each class.
