"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Minus,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colorSwatches: { label: string; value: string | null }[] = [
    { label: "Default", value: null },
    { label: "Dark", value: "#222023" },
    { label: "Plum", value: "#522A6F" },
    { label: "Gold", value: "#FBCF4F" },
    { label: "Pink", value: "#F29CB7" },
    { label: "Lilac", value: "#DDAAFF" },
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base focus:outline-none max-w-none min-h-[400px] p-6",
      },
    },
  });

  if (!editor) return null;

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/blog/upload-image", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        editor.chain().focus().setImage({ src: url }).run();
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Network error during upload");
    } finally {
      setIsUploading(false);
    }
  };

  interface MenuButtonProps {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
  }

  const MenuButton = ({ onClick, isActive, children, title, disabled }: MenuButtonProps) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-2 rounded-sm transition-colors hover:bg-brand-neutral/50 disabled:opacity-50",
        isActive ? "bg-brand-neutral text-brand-plum" : "text-gray-500"
      )}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-4 bg-brand-neutral/50 mx-1" />;

  return (
    <div className="border border-brand-neutral/50 rounded-sm overflow-hidden bg-white focus-within:border-brand-plum/30 transition-all">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-brand-neutral/30 bg-brand-neutral/5">
        <MenuButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive("paragraph") && !editor.isActive("heading")}
          title="Paragraph / Body"
        >
          <Pilcrow className="w-4 h-4" />
        </MenuButton>
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
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </MenuButton>

        <Divider />

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
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </MenuButton>

        <div className="relative">
          <MenuButton
            onClick={() => setShowColorPicker((v) => !v)}
            isActive={showColorPicker}
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </MenuButton>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-brand-neutral rounded-sm shadow-md p-2 flex gap-1">
              {colorSwatches.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  title={c.label}
                  onClick={() => {
                    if (c.value === null) {
                      editor.chain().focus().unsetColor().run();
                    } else {
                      editor.chain().focus().setColor(c.value).run();
                    }
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 rounded-sm border border-brand-neutral/60 hover:scale-110 transition-transform flex items-center justify-center"
                  style={c.value ? { backgroundColor: c.value } : undefined}
                >
                  {c.value === null && <span className="text-[10px] text-gray-500">×</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <Divider />

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </MenuButton>

        <Divider />

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
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </MenuButton>

        <Divider />

        <MenuButton
          onClick={() => {
            const previous = editor.getAttributes("link").href as string | undefined;
            const url = window.prompt("Enter URL", previous ?? "https://");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          isActive={editor.isActive("link")}
          title="Add / Edit Link"
        >
          <LinkIcon className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => fileInputRef.current?.click()}
          isActive={false}
          disabled={isUploading}
          title="Upload Image"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </MenuButton>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
            e.target.value = "";
          }}
        />

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
