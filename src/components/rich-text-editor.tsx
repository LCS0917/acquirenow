"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base focus:outline-none max-w-none min-h-[400px] p-6",
      },
    },
  });

  if (!editor) return null;

  const MenuButton = ({ onClick, isActive, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "p-2 rounded-sm transition-colors hover:bg-brand-neutral/50",
        isActive ? "bg-brand-neutral text-brand-plum" : "text-gray-500"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-brand-neutral/50 rounded-sm overflow-hidden bg-white focus-within:border-brand-plum/30 transition-all">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-brand-neutral/30 bg-brand-neutral/5">
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>
        
        <div className="w-px h-4 bg-brand-neutral/50 mx-1" />

        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        
        <div className="w-px h-4 bg-brand-neutral/50 mx-1" />

        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-4 bg-brand-neutral/50 mx-1" />

        <MenuButton 
          onClick={() => {
            const url = window.prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          isActive={editor.isActive("link")}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </MenuButton>

        <div className="flex-1" />

        <MenuButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo className="w-4 h-4" />
        </MenuButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
