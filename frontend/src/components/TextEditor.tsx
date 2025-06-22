import Editor from '@monaco-editor/react'
import { useRef, useState, useEffect, useCallback } from "react"

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [editorHeight, setEditorHeight] = useState(300) 

  const handleResize = useCallback(() => {
    if (containerRef.current) {
      const height = containerRef.current.offsetHeight
      setEditorHeight(height)
    }
  }, [])

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      handleResize()
    })

    if (containerRef.current) {
      observer.observe(containerRef.current)
      handleResize() 
    }

    return () => {
      observer.disconnect()
    }
  }, [handleResize])
  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  }

  return (
    <div className="mb-2 h-full rounded-lg overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
      <div  ref={containerRef} className="w-full h-full mt-1">
        <Editor
          height={editorHeight}
          defaultLanguage="sql"
          value={value}
          onChange={handleEditorChange}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme('modern-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                { token: 'keyword', foreground: '4a9eff', fontStyle: 'bold' },
                { token: 'string', foreground: '00d4ff' },
                { token: 'number', foreground: 'b5cea8' },
                { token: 'operator', foreground: '6c63ff' },
                { token: 'type', foreground: '4a9eff' },
                { token: 'function', foreground: 'dcdcaa' },
                { token: 'variable', foreground: '9cdcfe' },
                { token: 'parameter', foreground: '9cdcfe' },
                { token: 'property', foreground: '9cdcfe' },
                { token: 'punctuation', foreground: 'd4d4d4' },
              ],
              colors: {
                'editor.background': '#101828',
                'editor.foreground': '#e6f1ff',
                'editorLineNumber.foreground': '#6c63ff',
                'editorLineNumber.activeForeground': '#4a9eff',
                'editor.selectionBackground': '#2a3a5a',
                'editor.inactiveSelectionBackground': '#1e2a4a',
                'editor.wordHighlightBackground': '#1e2a4a',
                'editor.wordHighlightStrongBackground': '#2a3a5a',
                'editor.findMatchBackground': '#2a3a5a',
                'editor.findMatchHighlightBackground': '#1e2a4a',
                'editorCursor.foreground': '#4a9eff',
                'editorWhitespace.foreground': '#2a2a4a',
                'editorIndentGuide.background': '#2a2a4a',
                'editorIndentGuide.activeBackground': '#3a3a5a',
                'editorBracketMatch.background': '#2a3a5a',
                'editorBracketMatch.border': '#4a9eff',
                'editorGutter.background': '#101828',
                'editorError.foreground': '#ff4757',
                'editorWarning.foreground': '#ffa502',
                'editorInfo.foreground': '#4a9eff',
                'editorHoverWidget.background': '#1a1a2e',
                'editorHoverWidget.border': '#2a3a5a',
                'editorSuggestWidget.background': '#1a1a2e',
                'editorSuggestWidget.border': '#2a3a5a',
                'editorSuggestWidget.selectedBackground': '#2a3a5a',
                'editorSuggestWidget.highlightForeground': '#4a9eff',
                'editorGroupHeader.tabsBackground': '#1a1a2e',
                'editorGroup.border': '#2a3a5a',
                'tab.activeBackground': '#2a3a5a',
                'tab.inactiveBackground': '#1a1a2e',
                'tab.activeForeground': '#e6f1ff',
                'tab.inactiveForeground': '#a0aec0',
              }
            })
          }}
          theme="modern-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineNumbers: 'on',
            roundedSelection: true,
            lineHeight: 24,
            scrollBeyondLastLine: true,
            readOnly: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'none',
            renderWhitespace: 'boundary',
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            contextmenu: true,
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: 'allDocuments',
            parameterHints: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            links: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            foldingHighlight: true,
            foldingImportsByDefault: true,
            unfoldOnClickAfterEndOfLine: false,
            matchBrackets: 'always',
            renderValidationDecorations: 'on',
            renderControlCharacters: true,
            renderLineHighlightOnlyWhenFocus: false,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: true,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
              arrowSize: 11,
            },
          }}
          className='h-full' />
      </div>
    </div>
  )
}
