import * as React from "react"
import { type Editor } from "@tiptap/react"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

export interface TiptapButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The TipTap editor instance.
   */
  editor?: Editor | null
  /**
   * Optional text to display alongside the icon.
   */
  text?: string
  /**
   * Whether the button should hide when the feature is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * The icon component to display.
   */
  icon?: React.ComponentType<{ className?: string }>
  /**
   * The label for the button.
   */
  label: string
  /**
   * The keyboard shortcut for the button.
   */
  shortcutKey?: string
  /**
   * Whether the button is active.
   */
  isActive?: boolean
  /**
   * Whether the button should be shown.
   */
  shouldShow?: boolean
  /**
   * The action to perform when the button is clicked.
   */
  onAction?: () => void
}

export const TiptapButton = React.forwardRef<HTMLButtonElement, TiptapButtonProps>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      className = "",
      disabled,
      onClick,
      children,
      icon: Icon,
      label,
      shortcutKey,
      isActive = false,
      shouldShow = true,
      onAction,
      ...buttonProps
    },
    ref
  ) => {
    const editor = useTiptapEditor(providedEditor)

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)

        if (!e.defaultPrevented && !disabled) {
          onAction?.()
        }
      },
      [onClick, disabled, onAction]
    )

    if (!shouldShow || !editor || !editor.isEditable) {
      return null
    }

    return (
      <button
        type="button"
        className={`tiptap-button ${className.trim()}`}
        disabled={disabled}
        data-style="ghost"
        data-active-state={isActive ? "on" : "off"}
        data-disabled={disabled}
        role="button"
        tabIndex={-1}
        aria-label={label}
        aria-pressed={isActive}
        title={label}
        data-shortcut={shortcutKey}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children || (
          <>
            {Icon && <Icon className="tiptap-button-icon" />}
            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </button>
    )
  }
)

TiptapButton.displayName = "TiptapButton" 