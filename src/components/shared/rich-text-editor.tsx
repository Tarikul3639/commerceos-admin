"use client"

import { useState } from "react"

import {
  Bold,
  Eraser,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react"

import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface LinkSelection {
  from: number
  to: number
}

export function RichTextEditor({
  value = "",
  onChange,
  disabled = false,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkSelection, setLinkSelection] = useState<LinkSelection | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  const activeStates = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold") ?? false,
      italic: editor?.isActive("italic") ?? false,
      strike: editor?.isActive("strike") ?? false,
      heading1: editor?.isActive("heading", { level: 1 }) ?? false,
      heading2: editor?.isActive("heading", { level: 2 }) ?? false,
      heading3: editor?.isActive("heading", { level: 3 }) ?? false,
      heading4: editor?.isActive("heading", { level: 4 }) ?? false,
      heading5: editor?.isActive("heading", { level: 5 }) ?? false,
      heading6: editor?.isActive("heading", { level: 6 }) ?? false,
      bulletList: editor?.isActive("bulletList") ?? false,
      orderedList: editor?.isActive("orderedList") ?? false,
      blockquote: editor?.isActive("blockquote") ?? false,
      link: editor?.isActive("link") ?? false,
    }),
  })

  if (!editor) {
    return null
  }

  const active = activeStates ?? {
    bold: false,
    italic: false,
    strike: false,
    heading1: false,
    heading2: false,
    heading3: false,
    heading4: false,
    heading5: false,
    heading6: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
    link: false,
  }

  const activeClass =
    "data-[active=true]:bg-background data-[active=true]:text-primary data-[active=true]:shadow-sm"

  const getCurrentHeading = () => {
    if (active.heading1) return "Heading 1"
    if (active.heading2) return "Heading 2"
    if (active.heading3) return "Heading 3"
    if (active.heading4) return "Heading 4"
    if (active.heading5) return "Heading 5"
    if (active.heading6) return "Heading 6"

    return "Paragraph"
  }

  const setHeading = (level: HeadingLevel) => {
    editor.chain().focus().toggleHeading({ level }).run()
  }

  const handleLinkClick = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run()
      return
    }

    const { from, to } = editor.state.selection

    if (from === to) {
      return
    }

    const currentUrl = editor.getAttributes("link").href ?? ""

    setLinkSelection({ from, to })
    setLinkUrl(currentUrl)
    setLinkOpen(true)
  }

  const handleAddLink = () => {
    const url = linkUrl.trim()

    if (!url || !linkSelection) {
      return
    }

    editor
      .chain()
      .focus()
      .setTextSelection(linkSelection)
      .setLink({ href: url })
      .run()

    setLinkUrl("")
    setLinkSelection(null)
    setLinkOpen(false)
  }

  const handleCloseLink = () => {
    setLinkUrl("")
    setLinkSelection(null)
    setLinkOpen(false)
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/50 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              className="min-w-24 justify-between rounded-sm"
            >
              {getCurrentHeading()}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem
              className="text-xs font-normal"
              onSelect={() => editor.chain().focus().setParagraph().run()}
            >
              Paragraph
            </DropdownMenuItem>

            {[1, 2, 3, 4, 5, 6].map((level) => (
              <DropdownMenuItem
                key={level}
                className={
                  level === 1
                    ? "text-lg font-bold"
                    : level === 2
                      ? "text-base font-bold"
                      : level === 3
                        ? "text-sm font-semibold"
                        : level === 4
                          ? "text-sm font-semibold"
                          : level === 5
                            ? "text-xs font-semibold"
                            : "text-xs font-medium"
                }
                onSelect={() => setHeading(level as HeadingLevel)}
              >
                Heading {level}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          data-active={active.bold}
          className={activeClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
          <span className="sr-only">Bold</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          data-active={active.italic}
          className={activeClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
          <span className="sr-only">Italic</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          data-active={active.strike}
          className={activeClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-4" />
          <span className="sr-only">Strikethrough</span>
        </Button>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          data-active={active.bulletList}
          className={activeClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
          <span className="sr-only">Bullet list</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          data-active={active.orderedList}
          className={activeClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
          <span className="sr-only">Ordered list</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          data-active={active.blockquote}
          className={activeClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-4" />
          <span className="sr-only">Blockquote</span>
        </Button>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <Popover
          open={linkOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleCloseLink()
            } else {
              setLinkOpen(true)
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              data-active={active.link}
              className={activeClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleLinkClick}
            >
              <LinkIcon className="size-4" />
              <span className="sr-only">Link</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent align="start" className="w-72 p-3">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Add link</p>

                <p className="text-xs text-muted-foreground">
                  Add a URL to the selected text.
                </p>
              </div>

              <Input
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="https://example.com"
                type="url"
                autoFocus
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseLink}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  size="sm"
                  disabled={!linkUrl.trim()}
                  onClick={handleAddLink}
                >
                  Add link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="size-4" />
          <span className="sr-only">Horizontal rule</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
        >
          <Eraser className="size-4" />
          <span className="sr-only">Clear formatting</span>
        </Button>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled || !editor.can().undo()}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="size-4" />
          <span className="sr-only">Undo</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled || !editor.can().redo()}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="size-4" />
          <span className="sr-only">Redo</span>
        </Button>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-40 text-sm leading-7 [&_.ProseMirror]:p-3 [&_.ProseMirror]:outline-none [&_a]:cursor-pointer [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary/80 [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h5]:mb-2 [&_h5]:text-base [&_h5]:font-semibold [&_h6]:mb-2 [&_h6]:text-sm [&_h6]:font-semibold [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6"
      />
    </div>
  )
}
