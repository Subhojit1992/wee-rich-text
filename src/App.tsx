import React, { useState, useRef } from 'react';
import WeeRichText, { type WeeRichTextRef } from './components/WeeRichText';

function App() {
  const [content1, setContent1] = useState('');
  const [content2, setContent2] = useState('<p>Welcome to <strong>Wee Rich Text</strong>! This is a <em>sample</em> with <u>formatting</u>.</p>');
  const editorRef = useRef<WeeRichTextRef>(null);

  const handleSave = () => {
    const content = editorRef.current?.getContent();
    alert(`Saved content: ${content}`);
  };

  const handleClear = () => {
    editorRef.current?.setContent('');
  };

  const handleFocus = () => {
    editorRef.current?.focus();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Wee Rich Text Editor Demo</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2>Basic Usage</h2>
        <WeeRichText
          onChange={(html) => setContent1(html)}
          placeholder="Start typing here..."
          height="150px"
        />
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Content:</strong> {content1}
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>With Initial Content</h2>
        <WeeRichText
          initialContent={content2}
          onChange={(html) => setContent2(html)}
          height="200px"
          style={{ border: '2px solid #007bff' }}
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Programmatic Control</h2>
        <WeeRichText
          ref={editorRef}
          onChange={(html) => console.log('Changed:', html)}
          height="150px"
        />
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleSave} style={{ marginRight: '10px' }}>
            Save Content
          </button>
          <button onClick={handleClear} style={{ marginRight: '10px' }}>
            Clear
          </button>
          <button onClick={handleFocus}>
            Focus Editor
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Disabled State</h2>
        <WeeRichText
          initialContent="<p>This editor is <strong>disabled</strong> and cannot be edited.</p>"
          disabled={true}
          height="100px"
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Without Toolbar</h2>
        <WeeRichText
          toolbar={false}
          placeholder="This editor has no toolbar..."
          height="100px"
        />
      </div>
    </div>
  );
}

export default App;
