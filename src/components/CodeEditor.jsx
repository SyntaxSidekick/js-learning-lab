import { Editor } from '@monaco-editor/react'
import { 
  Box
} from '@mui/material'

const CodeEditor = ({ value, onChange, readOnly = false }) => {

  const handleEditorDidMount = (editor, monaco) => {
    // Define Monokai theme
    monaco.editor.defineTheme('monokai', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '75715e', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'f92672' },
        { token: 'string', foreground: 'e6db74' },
        { token: 'number', foreground: 'ae81ff' },
        { token: 'regexp', foreground: 'ae81ff' },
        { token: 'operator', foreground: 'f92672' },
        { token: 'namespace', foreground: 'f92672' },
        { token: 'type', foreground: '66d9ef' },
        { token: 'struct', foreground: 'a6e22e' },
        { token: 'class', foreground: 'a6e22e' },
        { token: 'interface', foreground: 'a6e22e' },
        { token: 'parameter', foreground: 'fd971f' },
        { token: 'variable', foreground: 'f8f8f2' },
        { token: 'function', foreground: 'a6e22e' },
        { token: 'member', foreground: 'a6e22e' },
        { token: 'identifier', foreground: 'f8f8f2' },
        { token: 'delimiter', foreground: 'f8f8f2' },
      ],
      colors: {
        'editor.background': '#272822',
        'editor.foreground': '#f8f8f2',
        'editorLineNumber.foreground': '#90908a',
        'editorCursor.foreground': '#f8f8f0',
        'editor.selectionBackground': '#49483e',
        'editor.lineHighlightBackground': '#3e3d32',
        'editorWhitespace.foreground': '#464741',
        'editorIndentGuide.background': '#464741',
        'editorIndentGuide.activeBackground': '#767771',
      }
    })
    
    // Apply the theme immediately
    monaco.editor.setTheme('monokai')
    
    // Force a layout refresh
    setTimeout(() => {
      editor.layout()
    }, 100)
  }

  return (
    <Box sx={{ height: '100%' }}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={value}
        onChange={onChange}
        theme="monokai"
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
          lineNumbers: readOnly ? 'off' : 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: readOnly ? 8 : 16, bottom: readOnly ? 8 : 16 },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          renderLineHighlight: readOnly ? 'none' : 'gutter',
          selectionHighlight: !readOnly,
          occurrencesHighlight: !readOnly,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: false,
          contextmenu: false,
          links: false,
          smoothScrolling: true,
          cursorBlinking: readOnly ? 'solid' : 'smooth',
          cursorSmoothCaretAnimation: readOnly ? "off" : "on",
          readOnly: readOnly,
          domReadOnly: readOnly,
          quickSuggestions: !readOnly,
          suggestOnTriggerCharacters: !readOnly,
          acceptSuggestionOnEnter: readOnly ? 'off' : 'on',
          tabCompletion: readOnly ? 'off' : 'on',
          wordBasedSuggestions: !readOnly,
          parameterHints: { enabled: !readOnly },
          autoIndent: 'full',
          formatOnType: !readOnly,
          formatOnPaste: !readOnly,
        }}
      />
    </Box>
  )
}

export default CodeEditor