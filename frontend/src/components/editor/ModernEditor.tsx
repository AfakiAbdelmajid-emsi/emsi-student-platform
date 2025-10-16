import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  CheckSquare,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
  X
} from 'lucide-react';
import styles from './ModernEditor.module.css';

interface ModernEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  placeholder?: string;
}

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', color: '#fef08a' },
  { name: 'Green', color: '#86efac' },
  { name: 'Blue', color: '#93c5fd' },
  { name: 'Pink', color: '#fbcfe8' },
  { name: 'Orange', color: '#fdba74' },
  { name: 'Purple', color: '#d8b4fe' },
  { name: 'Red', color: '#fca5a5' },
];

const ModernEditor: React.FC<ModernEditorProps> = ({ 
  content, 
  onUpdate,
  placeholder = 'Start writing...'
}) => {
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const highlightButtonRef = useRef<HTMLButtonElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const linkMenuRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: 'code-block',
          },
          exitOnTripleEnter: true,
          exitOnArrowDown: true,
        },
        bulletList: {
          HTMLAttributes: {
            class: 'bullet-list',
          },
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          HTMLAttributes: {
            class: 'ordered-list',
          },
          keepMarks: true,
          keepAttributes: false,
        },
        listItem: {
          HTMLAttributes: {
            class: 'list-item',
          },
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'highlight',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
      Image,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'editor-link',
          target: '_blank',
          rel: 'noopener noreferrer',
          onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            const href = event.currentTarget.getAttribute('href');
            if (href) {
              window.open(href, '_blank', 'noopener,noreferrer');
            }
          },
        },
        validate: href => /^https?:\/\//.test(href),
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const content = editor.getJSON();
      onUpdate(JSON.stringify(content));
    },
    editorProps: {
      handleClick: (view, pos, event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'A') {
          event.preventDefault();
          const href = target.getAttribute('href');
          if (href) {
            window.open(href, '_blank', 'noopener,noreferrer');
          }
        }
        return false;
      },
      handleKeyDown: (view, event) => {
        // Exit code block with Escape
        if (event.key === 'Escape' && editor?.isActive('codeBlock')) {
          editor.chain().focus().exitCode().run();
          return true;
        }
        // Exit code block with Enter at the end
        if (event.key === 'Enter' && editor?.isActive('codeBlock')) {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;
          const isAtEnd = $from.parentOffset === $from.parent.content.size;
          if (isAtEnd) {
            editor.chain().focus().exitCode().run();
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (highlightButtonRef.current && !highlightButtonRef.current.contains(event.target as Node)) {
        setShowHighlightMenu(false);
      }
      if (linkButtonRef.current && !linkButtonRef.current.contains(event.target as Node) &&
          linkMenuRef.current && !linkMenuRef.current.contains(event.target as Node)) {
        setShowLinkMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (editor && content) {
      try {
        // Parse the content if it's a string
        const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        if (parsedContent !== editor.getJSON()) {
          editor.commands.setContent(parsedContent);
        }
      } catch (error) {
        console.error('Error parsing content:', error);
        // If parsing fails, try to set the content as is
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    if (!editor) return;
    
    if (linkUrl) {
      // If text is selected, add link to the selection
      if (editor.state.selection.empty) {
        // If no text is selected, insert the URL as text with link
        editor.chain()
          .focus()
          .insertContent(`<a href="${linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`}">${linkUrl}</a>`)
          .run();
      } else {
        // Add link to selected text
        editor.chain()
          .focus()
          .setLink({ href: linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}` })
          .run();
      }
      setLinkUrl('');
      setShowLinkMenu(false);
    }
  };

  const removeLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setShowLinkMenu(false);
  };

  const handleLinkInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setLink();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowLinkMenu(false);
    }
  };

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${styles.toolbarButton} ${editor.isActive('bold') ? styles.active : ''}`}
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${styles.toolbarButton} ${editor.isActive('italic') ? styles.active : ''}`}
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${styles.toolbarButton} ${editor.isActive('underline') ? styles.active : ''}`}
            title="Underline"
          >
            <UnderlineIcon size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${styles.toolbarButton} ${editor.isActive('strike') ? styles.active : ''}`}
            title="Strikethrough"
          >
            <Strikethrough size={18} />
          </button>
        </div>

        <div className={styles.toolbarSeparator} />

        <div className={styles.toolbarGroup}>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 1 }) ? styles.active : ''}`}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </button>
        </div>

        <div className={styles.toolbarSeparator} />

        <div className={styles.toolbarGroup}>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${styles.toolbarButton} ${editor.isActive('bulletList') ? styles.active : ''}`}
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${styles.toolbarButton} ${editor.isActive('orderedList') ? styles.active : ''}`}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`${styles.toolbarButton} ${editor.isActive('taskList') ? styles.active : ''}`}
            title="Task List"
          >
            <CheckSquare size={18} />
          </button>
        </div>

        <div className={styles.toolbarSeparator} />

        <div className={styles.toolbarGroup}>
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'left' }) ? styles.active : ''}`}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'center' }) ? styles.active : ''}`}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'right' }) ? styles.active : ''}`}
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'justify' }) ? styles.active : ''}`}
            title="Justify"
          >
            <AlignJustify size={18} />
          </button>
        </div>

        <div className={styles.toolbarSeparator} />

        <div className={styles.toolbarGroup}>
          <div className={styles.highlightButton}>
            <button
              ref={highlightButtonRef}
              onClick={() => setShowHighlightMenu(!showHighlightMenu)}
              className={`${styles.toolbarButton} ${editor.isActive('highlight') ? styles.active : ''}`}
              title="Highlight"
            >
              <Highlighter size={18} />
            </button>
            {showHighlightMenu && (
              <div className={styles.highlightMenu}>
                {HIGHLIGHT_COLORS.map(({ name, color }) => (
                  <button
                    key={name}
                    className={styles.colorButton}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      if (editor.isActive('highlight')) {
                        editor.chain().focus().unsetHighlight().run();
                      }
                      editor.chain().focus().setHighlight({ color }).run();
                      setShowHighlightMenu(false);
                    }}
                    title={name}
                  />
                ))}
                {editor.isActive('highlight') && (
                  <button
                    className={styles.removeHighlight}
                    onClick={() => {
                      editor.chain().focus().unsetHighlight().run();
                      setShowHighlightMenu(false);
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`${styles.toolbarButton} ${editor.isActive('codeBlock') ? styles.active : ''}`}
            title="Code Block"
          >
            <Code size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${styles.toolbarButton} ${editor.isActive('blockquote') ? styles.active : ''}`}
            title="Blockquote"
          >
            <Quote size={18} />
          </button>
        </div>

        <div className={styles.toolbarSeparator} />

        <div className={styles.toolbarGroup}>
          <div className={styles.highlightButton}>
            <button
              ref={linkButtonRef}
              onClick={() => {
                if (editor.isActive('link')) {
                  setLinkUrl(editor.getAttributes('link').href || '');
                }
                setShowLinkMenu(!showLinkMenu);
              }}
              className={`${styles.toolbarButton} ${editor.isActive('link') ? styles.active : ''}`}
              title="Link"
            >
              <LinkIcon size={18} />
            </button>
            {showLinkMenu && (
              <div 
                ref={linkMenuRef}
                className={styles.highlightMenu}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={handleLinkInputKeyDown}
                  placeholder="Enter URL"
                  className={styles.linkInput}
                  autoFocus
                />
                <button
                  className={styles.removeHighlight}
                  onClick={setLink}
                >
                  Add Link
                </button>
                {editor.isActive('link') && (
                  <button
                    className={styles.removeHighlight}
                    onClick={removeLink}
                  >
                    Remove Link
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            onClick={addImage}
            className={styles.toolbarButton}
            title="Image"
          >
            <ImageIcon size={18} />
          </button>
        </div>

        <div className={styles.toolbarSeparator} />

        <div className={styles.toolbarGroup}>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={styles.toolbarButton}
            title="Undo"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={styles.toolbarButton}
            title="Redo"
          >
            <Redo size={18} />
          </button>
        </div>
      </div>
      <div className={styles.editorContent}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default ModernEditor; 