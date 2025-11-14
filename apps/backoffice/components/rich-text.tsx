"use client"

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Separator } from '@workspace/ui/components/separator'
import { Toggle } from '@workspace/ui/components/toggle'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Code,
} from 'lucide-react'

/**
 * Thanh công cụ (Toolbar) cho trình soạn thảo,
 * sử dụng các component <Toggle> của shadcn/ui
 */
const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="border border-input bg-transparent rounded-t-md p-2 flex items-center gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="h-8 w-[1px] mx-1" />
      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('codeBlock')}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code className="h-4 w-4" />
      </Toggle>
    </div>
  )
}


// --- COMPONENT CHÍNH ---
// Component này được thiết kế để hoạt động với <FormField> của shadcn/react-hook-form
// Nó nhận 'value' (HTML string) và 'onChange' (function)

interface RichTextEditorProps {
  value?: string
  onChange?: (richText: string) => void
  error?: string
}

export function RichTextEditor({ value, onChange, error }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: false,
        horizontalRule: false,
        dropcursor: false,
        gapcursor: false,
        hardBreak: false,
      }),
    ],
    content: value,
    
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm min-h-[150px] w-full rounded-b-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
    
    // Kích hoạt 'onChange' mỗi khi nội dung thay đổi
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="flex flex-col justify-stretch min-h-[200px]">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      {/* (Tùy chọn) Hiển thị lỗi nếu có */}
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}