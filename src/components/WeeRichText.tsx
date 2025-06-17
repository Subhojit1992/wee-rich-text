// src/components/WeeRichText/index.tsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from '@emotion/styled';
import ToolbarButton from './ToolbarButton';

// Styled components
const Container = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const ToolbarContainer = styled.div`
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
`;

const EditorContainer = styled.div<{ disabled?: boolean; height?: string | number }>`
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: ${props => typeof props.height === 'number' ? `${props.height}px` : props.height || '200px'};
  padding: 12px;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  background-color: ${props => props.disabled ? '#f9f9f9' : '#fff'};
  color: ${props => props.disabled ? '#666' : '#000'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'text'};
  
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  &[data-placeholder]:empty::before {
    content: attr(data-placeholder);
    color: #999;
    font-style: italic;
  }
`;

// Tool definitions
export type ToolName = 'bold' | 'italic' | 'underline' | 'strikeThrough';

export interface ToolDefinition {
  name: ToolName;
  command: string;
  title: string;
  icon: React.ReactNode;
}

const DEFAULT_TOOLS: ToolDefinition[] = [
  {
    name: 'bold',
    command: 'bold',
    title: 'Bold (Ctrl+B)',
    icon: <strong>B</strong>
  },
  {
    name: 'italic',
    command: 'italic',
    title: 'Italic (Ctrl+I)',
    icon: <em>I</em>
  },
  {
    name: 'underline',
    command: 'underline',
    title: 'Underline (Ctrl+U)',
    icon: <u>U</u>
  },
  {
    name: 'strikeThrough',
    command: 'strikeThrough',
    title: 'Strikethrough',
    icon: <s>S</s>
  }
];

export interface WeeRichTextProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  toolbar?: boolean;
  tools?: ToolName[];
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
      tools = ['bold', 'italic', 'underline', 'strikeThrough'],
      height = "200px",
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [content, setContent] = useState<string>(initialContent);
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

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

    // Check formatting state at current cursor position
    const updateFormattingState = useCallback(() => {
      if (disabled || !editorRef.current) return;

      const newActiveFormats = new Set<string>();

      try {
        // Check each command state
        const commands = ['bold', 'italic', 'underline', 'strikeThrough'];
        commands.forEach((command) => {
          if (document.queryCommandState && document.queryCommandState(command)) {
            newActiveFormats.add(command);
          }
        });

        setActiveFormats(newActiveFormats);
      } catch {
        // Fallback: check DOM elements around selection
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          let node: Node | null = range.startContainer;

          // Walk up the DOM tree to check for formatting elements
          while (node && node !== editorRef.current) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const tagName = element.tagName?.toLowerCase();
              
              if (['strong', 'b'].includes(tagName)) {
                newActiveFormats.add('bold');
              }
              if (['em', 'i'].includes(tagName)) {
                newActiveFormats.add('italic');
              }
              if (tagName === 'u') {
                newActiveFormats.add('underline');
              }
              if (['s', 'strike', 'del'].includes(tagName)) {
                newActiveFormats.add('strikeThrough');
              }
              
              // Check CSS styles
              const computedStyle = window.getComputedStyle(element);
              if (computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight) >= 600) {
                newActiveFormats.add('bold');
              }
              if (computedStyle.fontStyle === 'italic') {
                newActiveFormats.add('italic');
              }
              if (computedStyle.textDecoration.includes('underline')) {
                newActiveFormats.add('underline');
              }
              if (computedStyle.textDecoration.includes('line-through')) {
                newActiveFormats.add('strikeThrough');
              }
            }
            node = node.parentNode;
          }
        }

        setActiveFormats(newActiveFormats);
      }
    }, [disabled]);

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
        // Update formatting state
        setTimeout(updateFormattingState, 0);
      } catch (error) {
        console.warn('Format command failed:', command, error);
      }
    }, [disabled, updateFormattingState]);

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
        // Update formatting state after content change
        setTimeout(updateFormattingState, 0);
      }
    }, [onChange, updateFormattingState]);

    // Handle selection changes (cursor movement, clicks)
    const handleSelectionChange = useCallback(() => {
      updateFormattingState();
    }, [updateFormattingState]);

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

    // Add selection change listener
    useEffect(() => {
      document.addEventListener('selectionchange', handleSelectionChange);
      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
      };
    }, [handleSelectionChange]);

    // Get filtered tools based on props
    const visibleTools = DEFAULT_TOOLS.filter(tool => tools.includes(tool.name));

    return (
      <Container className={`wee-rich-text ${className}`} style={style}>
        {toolbar && visibleTools.length > 0 && (
          <ToolbarContainer>
            {visibleTools.map((tool) => (
              <ToolbarButton
                key={tool.name}
                command={tool.command}
                title={tool.title}
                disabled={disabled}
                active={activeFormats.has(tool.command)}
                onClick={applyFormat}
              >
                {tool.icon}
              </ToolbarButton>
            ))}
          </ToolbarContainer>
        )}

        <EditorContainer
          ref={editorRef}
          contentEditable={!disabled}
          disabled={disabled}
          height={height}
          onInput={handleContentChange}
          onPaste={handlePaste}
          onMouseUp={updateFormattingState}
          onKeyUp={updateFormattingState}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
      </Container>
    );
  }
);

WeeRichText.displayName = 'WeeRichText';

export default WeeRichText;
