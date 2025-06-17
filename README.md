# Wee Rich Text Editor

A lightweight, modern WYSIWYG rich text editor component for React applications.

## Features

- 🎨 **Modern Design**: Clean, customizable interface
- 📝 **Rich Text Formatting**: Support for bold, italic, underline, and strikethrough
- 🔧 **TypeScript Support**: Full TypeScript definitions included
- 📱 **Responsive**: Works on desktop and mobile devices
- 🎛️ **Customizable**: Configurable toolbar, styling, and behavior
- 🪶 **Lightweight**: Minimal dependencies
- ♿ **Accessible**: Proper ARIA attributes and keyboard navigation

## Installation

```bash
npm install wee-rich-text
```

## Basic Usage

```tsx
import React, { useState } from 'react';
import { WeeRichText } from 'wee-rich-text';

function App() {
  const [content, setContent] = useState('');

  return (
    <div>
      <WeeRichText
        onChange={(html) => setContent(html)}
        placeholder="Start typing..."
      />
    </div>
  );
}
```

## Advanced Usage

```tsx
import React, { useRef } from 'react';
import { WeeRichText, WeeRichTextRef } from 'wee-rich-text';

function App() {
  const editorRef = useRef<WeeRichTextRef>(null);

  const handleSave = () => {
    const content = editorRef.current?.getContent();
    console.log('Saved content:', content);
  };

  const handleClear = () => {
    editorRef.current?.setContent('');
  };

  return (
    <div>
      <WeeRichText
        ref={editorRef}
        initialContent="<p>Welcome to <strong>Wee Rich Text</strong>!</p>"
        onChange={(html) => console.log('Content changed:', html)}
        height="300px"
        className="my-editor"
        style={{ border: '2px solid #007bff' }}
      />
      
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialContent` | `string` | `""` | Initial HTML content for the editor |
| `onChange` | `(content: string) => void` | `undefined` | Callback fired when content changes |
| `placeholder` | `string` | `"Start typing..."` | Placeholder text shown when editor is empty |
| `disabled` | `boolean` | `false` | Whether the editor is disabled |
| `className` | `string` | `""` | Additional CSS class for the editor container |
| `style` | `React.CSSProperties` | `{}` | Additional inline styles for the editor |
| `toolbar` | `boolean` | `true` | Whether to show the formatting toolbar |
| `height` | `string \| number` | `"200px"` | Height of the editor |

### Ref Methods

The component exposes several methods through a ref:

```tsx
interface WeeRichTextRef {
  getContent: () => string;
  setContent: (content: string) => void;
  focus: () => void;
  blur: () => void;
}
```

| Method | Description |
|--------|-------------|
| `getContent()` | Returns the current HTML content |
| `setContent(content)` | Sets the HTML content |
| `focus()` | Focuses the editor |
| `blur()` | Blurs the editor |

### Formatting Options

The toolbar supports the following formatting options:

- **Bold** (`Ctrl+B` / `Cmd+B`)
- **Italic** (`Ctrl+I` / `Cmd+I`)
- **Underline** (`Ctrl+U` / `Cmd+U`)
- **Strikethrough**

## Styling

### Default Styling

The component comes with sensible default styles that provide a clean, modern appearance.

### Custom Styling

You can customize the appearance using CSS classes or inline styles:

```tsx
<WeeRichText
  className="custom-editor"
  style={{
    border: '2px solid #007bff',
    borderRadius: '8px',
    fontSize: '16px'
  }}
/>
```

```css
.custom-editor {
  font-family: 'Georgia', serif;
}

.custom-editor .wee-rich-text {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### 1.0.0
- Initial release
- Basic rich text formatting (bold, italic, underline, strikethrough)
- TypeScript support
- Customizable toolbar and styling
- Ref-based API for programmatic control
