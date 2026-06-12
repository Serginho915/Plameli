"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import styles from "./RichTextEditor.module.scss";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUploadImage: (file: File) => Promise<string>;
  onError?: (message: string) => void;
}

export function RichTextEditor({ label, value, onChange, onUploadImage, onError }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: value || "",
    onUpdate: ({ editor: activeEditor }) => {
      onChange(activeEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();
    if (value !== currentHtml) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  async function insertImage(file: File | null) {
    if (!editor || !file) {
      return;
    }

    try {
      const url = await onUploadImage(file);
      if (!url) {
        return;
      }
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Upload failed");
    }
  }

  function setLink() {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes("link").href || "";
    const nextUrl = window.prompt("URL", previousUrl);

    if (nextUrl === null) {
      return;
    }

    if (!nextUrl.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: nextUrl.trim() }).run();
  }

  return (
    <label className={styles.editorField}>
      {label}
      <div className={styles.toolbar}>
        <button
          type="button"
          className={`${styles.toolbarButton} ${editor?.isActive("bold") ? styles.toolbarButtonActive : ""}`}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          className={`${styles.toolbarButton} ${editor?.isActive("italic") ? styles.toolbarButtonActive : ""}`}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          className={`${styles.toolbarButton} ${editor?.isActive("heading", { level: 2 }) ? styles.toolbarButtonActive : ""}`}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={`${styles.toolbarButton} ${editor?.isActive("heading", { level: 3 }) ? styles.toolbarButtonActive : ""}`}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          type="button"
          className={`${styles.toolbarButton} ${editor?.isActive("bulletList") ? styles.toolbarButtonActive : ""}`}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          List
        </button>
        <button
          type="button"
          className={`${styles.toolbarButton} ${editor?.isActive("orderedList") ? styles.toolbarButtonActive : ""}`}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          1.
        </button>
        <button
          type="button"
          className={`${styles.toolbarButton} ${editor?.isActive("blockquote") ? styles.toolbarButtonActive : ""}`}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </button>
        <button type="button" className={styles.toolbarButton} onClick={setLink}>
          Link
        </button>
        <button type="button" className={styles.toolbarButton} onClick={() => fileInputRef.current?.click()}>
          Image
        </button>
        <button type="button" className={styles.toolbarButton} onClick={() => editor?.chain().focus().undo().run()}>
          Undo
        </button>
        <button type="button" className={styles.toolbarButton} onClick={() => editor?.chain().focus().redo().run()}>
          Redo
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={async (event) => {
          const file = event.target.files?.[0] || null;
          await insertImage(file);
          event.target.value = "";
        }}
      />

      <div className={styles.editorSurface}>
        <EditorContent editor={editor} />
      </div>
    </label>
  );
}