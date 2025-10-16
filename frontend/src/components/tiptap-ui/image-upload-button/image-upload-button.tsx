"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { handleImageUpload } from "@/lib/tiptap-utils"

// --- Icons ---
import { ImagePlusIcon } from "@/components/tiptap-icons/image-plus-icon"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"

export interface ImageUploadButtonProps extends ButtonProps {
  editor?: Editor | null
  text?: string
  extensionName?: string
  noteId: string // Add noteId as required prop
}

export function isImageActive(
  editor: Editor | null,
  extensionName: string
): boolean {
  if (!editor) return false
  return editor.isActive(extensionName)
}
export function useImageUploadButton(
  editor: Editor | null,
  noteId: string,
  extensionName: string = "image",
  disabled: boolean = false
) {
  const isActive = isImageActive(editor, extensionName);
  
const handleInsertImage = React.useCallback(async (file: File) => {
  if (!editor || disabled) return false;

  try {
    // Upload the image first
    const imageUrl = await handleImageUpload(file, noteId);
    
    // Insert the actual image with the URL
    editor.chain().focus().insertContent({
      type: 'image',
      attrs: {
        src: imageUrl,
        alt: file.name,
        title: file.name,
      },
    }).run();

    return true;
  } catch (error) {
    console.error('Image upload failed:', error);
    return false;
  }
}, [editor, disabled, noteId]);

  return {
    isActive,
    handleInsertImage,
  };
}

export const ImageUploadButton = React.forwardRef<
  HTMLButtonElement,
  ImageUploadButtonProps
>(
  (
    {
      editor: providedEditor,
      extensionName = "image",
      text,
      className = "",
      disabled,
      onClick,
      children,
      noteId, // Destructure noteId from props
      ...buttonProps
    },
    ref
  ) => {
    const editor = useTiptapEditor(providedEditor)
    const { isActive, handleInsertImage } = useImageUploadButton(
      editor,
      noteId,
      extensionName,
      disabled
    )
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        if (file.type.match('image.*')) {
          await handleInsertImage(file)
        }
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)

      if (!e.defaultPrevented && !disabled) {
        fileInputRef.current?.click()
      }
    }

    if (!editor || !editor.isEditable) {
      return null
    }

    return (
      <>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <Button
          ref={ref}
          type="button"
          className={className.trim()}
          data-style="ghost"
          data-active-state={isActive ? "on" : "off"}
          role="button"
          tabIndex={-1}
          aria-label="Upload image"
          aria-pressed={isActive}
          tooltip="Upload image"
          onClick={handleClick}
          disabled={disabled}
          {...buttonProps}
        >
          {children || (
            <>
              <ImagePlusIcon className="tiptap-button-icon" />
              {text && <span className="tiptap-button-text">{text}</span>}
            </>
          )}
        </Button>
      </>
    )
  }
)

ImageUploadButton.displayName = "ImageUploadButton"

export default ImageUploadButton