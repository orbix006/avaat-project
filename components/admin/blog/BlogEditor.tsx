'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Unlink, 
  Image as ImageIcon,
  Undo, 
  Redo,
  Type
} from 'lucide-react';

interface BlogEditorProps {
  content: string;
  onChange: (_html: string) => void;
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-gold hover:underline cursor-pointer transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-xl my-6 border border-gold/15 shadow-lg mx-auto block',
        },
      }),
    ],
    content: content || '<p>Start writing your design article here...</p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[350px] max-h-[600px] overflow-y-auto px-6 py-5 prose prose-invert max-w-none text-ivory text-sm leading-relaxed font-jost',
      },
    },
  });

  // Keep editor content in sync with external value if needed
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '<p></p>');
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="border border-gold/15 rounded-xl h-[400px] flex items-center justify-center bg-warm-black text-muted text-xs font-jost">
        Loading editorial workspace...
      </div>
    );
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL (e.g. https://example.com):', previousUrl);

    // Cancelled
    if (url === null) {
      return;
    }

    // Empty URL -> remove link
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetMark('link').run();
      return;
    }

    // Set link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    disabled?: boolean; 
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-all hover:bg-gold/10 hover:text-gold ${
        isActive ? 'bg-gold/15 text-gold border border-gold/20' : 'text-muted border border-transparent'
      } disabled:opacity-30 disabled:pointer-events-none`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gold/15 rounded-xl bg-warm-black overflow-hidden flex flex-col group focus-within:border-gold transition-colors duration-300">
      
      {/* Editorial Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-onyx/40 border-b border-gold/10 select-none">
        
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo className="w-3.5 h-3.5" />
        </ToolbarButton>

        <div className="w-[1px] h-6 bg-gold/10 mx-1 shrink-0" />

        {/* Text Formats */}
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive('bold')} 
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive('italic')} 
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>

        <div className="w-[1px] h-6 bg-gold/10 mx-1 shrink-0" />

        {/* Headings */}
        <ToolbarButton 
          onClick={() => editor.chain().focus().setParagraph().run()} 
          isActive={editor.isActive('paragraph')} 
          title="Paragraph Text"
        >
          <Type className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          isActive={editor.isActive('heading', { level: 1 })} 
          title="Heading 1"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive('heading', { level: 2 })} 
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          isActive={editor.isActive('heading', { level: 3 })} 
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </ToolbarButton>

        <div className="w-[1px] h-6 bg-gold/10 mx-1 shrink-0" />

        {/* Lists */}
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive('bulletList')} 
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive('orderedList')} 
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarButton>

        <div className="w-[1px] h-6 bg-gold/10 mx-1 shrink-0" />

        {/* Blockquote */}
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          isActive={editor.isActive('blockquote')} 
          title="Blockquote"
        >
          <Quote className="w-3.5 h-3.5" />
        </ToolbarButton>

        <div className="w-[1px] h-6 bg-gold/10 mx-1 shrink-0" />

        {/* Links */}
        <ToolbarButton 
          onClick={addLink} 
          isActive={editor.isActive('link')} 
          title="Insert Link"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().unsetLink().run()} 
          disabled={!editor.isActive('link')} 
          title="Remove Link"
        >
          <Unlink className="w-3.5 h-3.5" />
        </ToolbarButton>

        <div className="w-[1px] h-6 bg-gold/10 mx-1 shrink-0" />

        {/* Images */}
        <ToolbarButton 
          onClick={addImage} 
          title="Insert Image URL"
        >
          <ImageIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 bg-warm-black min-h-[350px]">
        <EditorContent editor={editor} />
      </div>

      {/* Formatting hint */}
      <div className="px-4 py-1.5 bg-onyx/10 border-t border-gold/5 text-[9px] text-muted tracking-wider flex justify-between font-mono">
        <span>Press Ctrl+Z to undo, Ctrl+Y to redo</span>
        <span>HTML output generated in real-time</span>
      </div>
    </div>
  );
}
