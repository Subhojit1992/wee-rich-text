// src/components/WysiwygEditor/index.tsx
import React, { useState, useRef, useCallback, useEffect } from "react";

export interface WeeRichTextProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  toolbar?: boolean;
  height?: string | number;
}

export interface WeeRichTextRef {
  getContent: () => string;
  setContent: (content: string) => void;
  focus: () => void;
  blur: () => void;
}

const WeeRichText = React.forwardRef<WeeRichTextRef, WeeRichTextProps>(
  (
    {
      initialContent = "",
      onChange,
      placeholder = "Start typing...",
      disabled = false,
      className = "",
      style = {},
      toolbar = true,
      height = "200px",
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [content, setContent] = useState<string>(initialContent);

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      getContent: () => content,
      setContent: (newContent: string) => {
        setContent(newContent);
        if (editorRef.current) {
          editorRef.current.innerHTML = newContent;
        }
      },
      focus: () => {
        editorRef.current?.focus();
      },
      blur: () => {
        editorRef.current?.blur();
      },
    }));

    // Function to handle text formatting using modern Selection API
    const applyFormat = useCallback((command: string) => {
      if (disabled || !editorRef.current) return;

      editorRef.current.focus();
      
      // Use modern approach when possible, fallback to execCommand
      try {
        if (document.queryCommandSupported && document.queryCommandSupported(command)) {
          document.execCommand(command, false, undefined);
        } else {
          // Fallback for modern browsers
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            applyFormatToRange(range, command);
          }
        }
        
        // Update content after formatting
        setContent(editorRef.current.innerHTML);
      } catch (error) {
        console.warn('Format command failed:', command, error);
      }
    }, [disabled]);

    // Modern approach for text formatting
    const applyFormatToRange = (range: Range, command: string) => {
      const selectedText = range.toString();
      if (!selectedText) return;

      let wrappedContent = '';
      switch (command) {
        case 'bold':
          wrappedContent = `<strong>${selectedText}</strong>`;
          break;
        case 'italic':
          wrappedContent = `<em>${selectedText}</em>`;
          break;
        case 'underline':
          wrappedContent = `<u>${selectedText}</u>`;
          break;
        case 'strikeThrough':
          wrappedContent = `<s>${selectedText}</s>`;
          break;
        default:
          return;
      }

      range.deleteContents();
      const fragment = range.createContextualFragment(wrappedContent);
      range.insertNode(fragment);
    };

    // Handle content changes
    const handleContentChange = useCallback(() => {
      if (editorRef.current) {
        const newContent = editorRef.current.innerHTML;
        setContent(newContent);
        onChange?.(newContent);
      }
    }, [onChange]);

    // Handle paste events to clean up content
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
      if (disabled) return;
      
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    }, [disabled]);

    // Set initial content
    useEffect(() => {
      if (editorRef.current && initialContent) {
        editorRef.current.innerHTML = initialContent;
        setContent(initialContent);
      }
    }, [initialContent]);

    // Toolbar component
    const ToolbarButton = ({ 
      command, 
      title, 
      children 
    }: { 
      command: string; 
      title: string; 
      children: React.ReactNode; 
    }) => (
      <button
        type="button"
        onClick={() => applyFormat(command)}
        disabled={disabled}
        title={title}
        style={{
          padding: '6px 12px',
          margin: '2px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: disabled ? '#f5f5f5' : '#fff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: '14px',
        }}
        onMouseDown={(e) => e.preventDefault()} // Prevent losing focus
      >
        {children}
      </button>
    );

    const editorStyle: React.CSSProperties = {
      border: '1px solid #ccc',
      borderRadius: '4px',
      minHeight: height,
      padding: '12px',
      outline: 'none',
      fontSize: '14px',
      lineHeight: '1.5',
      backgroundColor: disabled ? '#f9f9f9' : '#fff',
      color: disabled ? '#666' : '#000',
      cursor: disabled ? 'not-allowed' : 'text',
      ...style,
    };

    return (
      <div className={`wee-rich-text ${className}`}>
        {toolbar && (
          <div style={{ marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
            <ToolbarButton command="bold" title="Bold (Ctrl+B)">
              <strong>B</strong>
            </ToolbarButton>
            <ToolbarButton command="italic" title="Italic (Ctrl+I)">
              <em>I</em>
            </ToolbarButton>
            <ToolbarButton command="underline" title="Underline (Ctrl+U)">
              <u>U</u>
            </ToolbarButton>
            <ToolbarButton command="strikeThrough" title="Strikethrough">
              <s>S</s>
            </ToolbarButton>
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable={!disabled}
          style={editorStyle}
          onInput={handleContentChange}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
      </div>
    );
  }
);

WeeRichText.displayName = 'WeeRichText';

export default WeeRichText;
