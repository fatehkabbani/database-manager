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
                { token: 'comment', foreground: '737373', fontStyle: 'italic' },
                { token: 'keyword', foreground: '3080ff', fontStyle: 'bold' },
                { token: 'string', foreground: '62cd5e' },
                { token: 'number', foreground: '90c5ff' },
                { token: 'operator', foreground: 'c4c4c4' },
                { token: 'type', foreground: '3080ff' },
                { token: 'function', foreground: 'fafafa' },
                { token: 'variable', foreground: 'c4c4c4' },
                { token: 'parameter', foreground: 'c4c4c4' },
                { token: 'property', foreground: 'c4c4c4' },
                { token: 'punctuation', foreground: 'c4c4c4' },
              ],
              colors: {
                'editor.background': '#0a0a0a',
                'editor.foreground': '#fafafa',
                'editorLineNumber.foreground': '#737373',
                'editorLineNumber.activeForeground': '#fafafa',
                'editor.selectionBackground': '#1447e655',
                'editor.inactiveSelectionBackground': '#1447e633',
                'editor.wordHighlightBackground': '#262626',
                'editor.wordHighlightStrongBackground': '#333333',
                'editor.findMatchBackground': '#1447e655',
                'editor.findMatchHighlightBackground': '#1447e633',
                'editorCursor.foreground': '#3080ff',
                'editorWhitespace.foreground': '#262626',
                'editorIndentGuide.background': '#262626',
                'editorIndentGuide.activeBackground': '#404040',
                'editorBracketMatch.background': '#1447e633',
                'editorBracketMatch.border': '#3080ff',
                'editorGutter.background': '#0a0a0a',
                'editorError.foreground': '#ff6568',
                'editorWarning.foreground': '#ffa502',
                'editorInfo.foreground': '#3080ff',
                'editorHoverWidget.background': '#171717',
                'editorHoverWidget.border': '#ffffff1a',
                'editorSuggestWidget.background': '#171717',
                'editorSuggestWidget.border': '#ffffff1a',
                'editorSuggestWidget.selectedBackground': '#262626',
                'editorSuggestWidget.highlightForeground': '#3080ff',
                'editorGroupHeader.tabsBackground': '#171717',
                'editorGroup.border': '#ffffff1a',
                'tab.activeBackground': '#262626',
                'tab.inactiveBackground': '#171717',
                'tab.activeForeground': '#fafafa',
                'tab.inactiveForeground': '#c4c4c4',
              }
            })
          }}
          theme="modern-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
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
