"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Hightlight from '@tiptap/extension-highlight'
import HardBreak from '@tiptap/extension-hard-break'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  ImageIcon,
  RotateCcw,
  Type,
  ListCheck,
  Highlighter
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
  readonly?: boolean
}

export function RichTextEditor({
  content,
  onChange,
  placeholder,
  className = '',
  minHeight = '200px',
  readonly = false
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [currentFormatting, setCurrentFormatting] = useState({
    bold: false,
    italic: false,
    strike: false,
    code: false,
    codeBlock: false,
    heading: { level: 0 },
    bulletList: false,
    orderedList: false,
    blockquote: false,
    link: false,
    taskList: false,
    taskItem: false,
    highlight: false,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        code: {
          HTMLAttributes: {
            class: 'bg-muted px-1.5 py-0.5 rounded text-sm font-mono',
          },
        },
      }),
      HardBreak,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline font-medium',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'list-disc list-inside',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'list-item',
        },
      }),
      Hightlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-100 p-1 rounded',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    editable: !readonly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto focus:outline-none p-4 ${readonly ? 'cursor-not-allowed opacity-75' : ''}`,
        style: `min-height: ${minHeight};`,
      },
    },
  })

  // Track selection changes to update button states
  useEffect(() => {
    if (!editor) return

    const updateFormatting = () => {
      if (!editor) return

      setCurrentFormatting({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        strike: editor.isActive('strike'),
        code: editor.isActive('code'),
        codeBlock: editor.isActive('codeBlock'),
        heading: {
          level: editor.isActive('heading', { level: 1 }) ? 1 :
            editor.isActive('heading', { level: 2 }) ? 2 :
              editor.isActive('heading', { level: 3 }) ? 3 : 0
        },
        bulletList: editor.isActive('bulletList'),
        orderedList: editor.isActive('orderedList'),
        blockquote: editor.isActive('blockquote'),
        link: editor.isActive('link'),
        taskList: editor.isActive('taskList'),
        taskItem: editor.isActive('taskItem'),
        highlight: editor.isActive('highlight'),
      })
    }

    // Update immediately
    updateFormatting()

    // Listen for selection changes
    editor.on('selectionUpdate', updateFormatting)
    editor.on('update', updateFormatting)
    editor.on('focus', updateFormatting)

    return () => {
      editor.off('selectionUpdate', updateFormatting)
      editor.off('update', updateFormatting)
      editor.off('focus', updateFormatting)
    }
  }, [editor])

  // Keyboard shortcuts
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+B for bold
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault()
        editor.chain().focus().toggleBold().run()
      }
      // Ctrl+I for italic
      if (event.ctrlKey && event.key === 'i') {
        event.preventDefault()
        editor.chain().focus().toggleItalic().run()
      }
      // Ctrl+U for strikethrough
      if (event.ctrlKey && event.key === 'u') {
        event.preventDefault()
        editor.chain().focus().toggleStrike().run()
      }
      // Ctrl+K for inline code
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
        editor.chain().focus().toggleCode().run()
      }
      // Ctrl+Shift+K for code block
      if (event.ctrlKey && event.shiftKey && event.key === 'k') {
        event.preventDefault()
        editor.chain().focus().toggleCodeBlock().run()
      }
      // Ctrl+Shift+7 for ordered list
      if (event.ctrlKey && event.shiftKey && event.key === '7') {
        event.preventDefault()
        editor.chain().focus().toggleOrderedList().run()
      }
      // Ctrl+Shift+8 for bullet list
      if (event.ctrlKey && event.shiftKey && event.key === '8') {
        event.preventDefault()
        editor.chain().focus().toggleBulletList().run()
      }
      // Ctrl+Shift+9 for blockquote
      if (event.ctrlKey && event.shiftKey && event.key === '9') {
        event.preventDefault()
        editor.chain().focus().toggleBlockquote().run()
      }
      // Ctrl+Alt+0 for paragraph
      if (event.ctrlKey && event.altKey && event.key === '0') {
        event.preventDefault()
        editor.chain().focus().setParagraph().run()
      }
      // Ctrl+Alt+1,2,3 for headings
      if (event.ctrlKey && event.altKey && ['1', '2', '3'].includes(event.key)) {
        event.preventDefault()
        const level = parseInt(event.key) as 1 | 2 | 3
        editor.chain().focus().setHeading({ level }).run()
      }
      // Ctrl+Z for undo
      if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        editor.chain().focus().undo().run()
      }
      // Ctrl+Y or Ctrl+Shift+Z for redo
      if (event.ctrlKey && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
        event.preventDefault()
        editor.chain().focus().redo().run()
      }
      // Enter for hard break in headings/lists
      if (event.key === 'Enter' && (editor.isActive('heading') || editor.isActive('listItem'))) {
        if (event.shiftKey) {
          event.preventDefault()
          editor.chain().focus().setHardBreak().run()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor])

  if (!isMounted || !editor) {
    return (
      <div className={`border border-border rounded-lg ${className}`} style={{ minHeight }}>
        <div className="animate-pulse space-y-2 p-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  const addImage = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    try {
      const url = window.prompt('Enter image URL:')
      if (url && url.trim()) {
        editor.chain().focus().setImage({ src: url.trim() }).run()
      }
    } catch (error) {
      console.error('Error adding image:', error)
    }
  }

  const addLink = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    try {
      const url = window.prompt('Enter link URL:')
      if (url && url.trim()) {
        editor.chain().focus().setLink({ href: url.trim() }).run()
      }
    } catch (error) {
      console.error('Error adding link:', error)
    }
  }

  const removeLink = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    editor.chain().focus().unsetLink().run()
  }

  return (
    <div className={`shadow-lg rounded-lg bg-background ${className} relative`}>
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-1 p-3 border-b border-border rounded-t-lg sticky top-0 bg-background/95 backdrop-blur-sm z-10"
        onClick={(e) => e.preventDefault()}
      >
        {/* Text Formatting */}
        <div className="flex items-center gap-1 ">
          <Button
            type="button"
            variant={currentFormatting.bold ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={currentFormatting.italic ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={currentFormatting.strike ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            title="Strikethrough (Ctrl+U)"
          >
            <Strikethrough className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={currentFormatting.code ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor?.chain().focus().toggleCode().run()}
            title="Inline Code (Ctrl+K)"
          >
            <Code className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={currentFormatting.codeBlock ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            title="Code Block (Ctrl+Shift+K)"
          >
            <Code2 className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={currentFormatting.heading.level === 0 ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor?.chain().focus().setParagraph().run()}
            title="Paragraph (Ctrl+Alt+0)"
          >
            <Type className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={currentFormatting.heading.level === 1 ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor?.chain().focus().setHeading({ level: 1 }).run()}
            title="Heading 1 (Ctrl+Alt+1)"
          >
            <Heading1 className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={currentFormatting.heading.level === 2 ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor?.chain().focus().setHeading({ level: 2 }).run()}
            title="Heading 2 (Ctrl+Alt+2)"
          >
            <Heading2 className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={currentFormatting.heading.level === 3 ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor?.chain().focus().setHeading({ level: 3 }).run()}
            title="Heading 3 (Ctrl+Alt+3)"
          >
            <Heading3 className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Lists & Blocks */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={currentFormatting.bulletList ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              if (editor?.isActive('listItem')) {
                editor.chain().focus().toggleList('bulletList', 'listItem').run()
              } else {
                editor?.chain().focus().toggleBulletList().run()
              }
            }}
            title="Bullet List (Ctrl+Shift+8)"
          >
            <List className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={currentFormatting.orderedList ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              if (editor?.isActive('listItem')) {
                editor.chain().focus().toggleList('orderedList', 'listItem').run()
              } else {
                editor?.chain().focus().toggleOrderedList().run()
              }
            }}
            title="Ordered List (Ctrl+Shift+7)"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={currentFormatting.blockquote ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            title="Blockquote (Ctrl+Shift+9)"
          >
            <Quote className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={currentFormatting.taskList ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor?.chain().focus().toggleTaskList().run()}
            title="Task List (Ctrl+Shift+0)"
          >
            <ListCheck className="w-4 h-4" />
          </Button>
        </div>


        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Media & Links */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImage}
            title="Add Image"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={currentFormatting.link ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              if (editor?.isActive('link')) {
                removeLink(e)
              } else {
                addLink(e)
              }
            }}
            title={currentFormatting.link ? 'Remove Link' : 'Add Link'}
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={currentFormatting.highlight ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor?.chain().focus().toggleHighlight().run()}
            title="Highlight (Ctrl+Shift+H)"
          >
            <Highlighter className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Clear Formatting & Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().clearContent().run()}
            title="Clear Content"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
            title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative"
      >
        <EditorContent
          editor={editor}
          className="min-h-[200px] prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none focus-within:outline-none"
          style={{ minHeight }}
        />

        {/* Placeholder */}
        {editor?.isEmpty && placeholder && (
          <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
            {placeholder}
          </div>
        )}

        {/* Status Bar */}
        <div className="bottom-0 px-2 left-2 right-2 flex items-center justify-between sticky bg-background rounded-b-lg z-10">
          {/* Current Formatting Status */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="font-medium">Format:</span>
              {currentFormatting.heading.level > 0 && (
                <span className="bg-primary/20 text-primary px-1 rounded">
                  H{currentFormatting.heading.level}
                </span>
              )}
              {currentFormatting.bold && <span className="bg-primary/20 text-primary px-1 rounded">B</span>}
              {currentFormatting.italic && <span className="bg-primary/20 text-primary px-1 rounded">I</span>}
              {currentFormatting.strike && <span className="bg-primary/20 text-primary px-1 rounded">S</span>}
              {currentFormatting.code && <span className="bg-primary/20 text-primary px-1 rounded">C</span>}
              {currentFormatting.codeBlock && <span className="bg-primary/20 text-primary px-1 rounded">CB</span>}
              {currentFormatting.bulletList && <span className="bg-primary/20 text-primary px-1 rounded">•</span>}
              {currentFormatting.orderedList && <span className="bg-primary/20 text-primary px-1 rounded">1.</span>}
              {currentFormatting.blockquote && <span className="bg-primary/20 text-primary px-1 rounded">&quot;</span>}
              {currentFormatting.link && <span className="bg-primary/20 text-primary px-1 rounded">🔗</span>}
              {currentFormatting.heading.level === 0 && !currentFormatting.bold && !currentFormatting.italic &&
                !currentFormatting.strike && !currentFormatting.code && !currentFormatting.codeBlock && !currentFormatting.bulletList &&
                !currentFormatting.orderedList && !currentFormatting.blockquote && !currentFormatting.link && (
                  <span className="text-muted-foreground">Normal text</span>
                )}
            </span>
          </div>

          {/* Character Count */}
          <div className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
            {editor?.getText()?.length || 0} characters
          </div>
        </div>
      </div>
    </div>
  )
}
