"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Fragment, useRef, useState, type ChangeEvent } from "react";
import { uploadImage } from "../upload";

// WordPress's classic editor (TinyMCE "Visual" + quicktags "Text"), rebuilt on Tiptap with the same markup,
// so the vendored editor.css / skin.css style it exactly like wp-admin.

type Props = { name: string; defaultValue?: string; lastEdited?: string };

const FORMATS = [
  { value: "p", label: "Paragraph" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "h4", label: "Heading 4" },
];

function currentFormat(editor: Editor) {
  for (const level of [2, 3, 4] as const) if (editor.isActive("heading", { level })) return `h${level}`;
  return "p";
}

function elementPath(editor: Editor) {
  const { $from } = editor.state.selection;
  const names: string[] = [];
  for (let depth = 1; depth <= $from.depth; depth++) {
    const node = $from.node(depth);
    const tag =
      node.type.name === "heading"
        ? `h${node.attrs.level}`
        : ({ paragraph: "p", bulletList: "ul", orderedList: "ol", listItem: "li", blockquote: "blockquote", codeBlock: "pre" } as Record<string, string>)[node.type.name];
    if (tag) names.push(tag);
  }
  return names;
}

function promptLink(editor: Editor) {
  const previous = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("Paste URL or type to search", previous ?? "https://");
  if (url === null) return;
  if (!url || url === "https://") editor.chain().focus().extendMarkRange("link").unsetLink().run();
  else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
}

type ButtonProps = { icon: string; label: string; active?: boolean; disabled?: boolean; first?: boolean; last?: boolean; onClick: () => void };

function MceButton({ icon, label, active, disabled, first, last, onClick }: ButtonProps) {
  const classes = ["mce-widget", "mce-btn", first && "mce-first", last && "mce-last", active && "mce-active", disabled && "mce-disabled"]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} tabIndex={-1} role="button" aria-label={label} aria-pressed={active} aria-disabled={disabled}>
      <button
        role="presentation"
        type="button"
        tabIndex={-1}
        title={label}
        disabled={disabled}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
      >
        <i className={`mce-ico mce-i-${icon}`} />
      </button>
    </div>
  );
}

function Toolbar({ first, last, children }: { first?: boolean; last?: boolean; children: React.ReactNode }) {
  return (
    <div className={`mce-container mce-toolbar mce-stack-layout-item${first ? " mce-first" : ""}${last ? " mce-last" : ""}`} role="toolbar">
      <div className="mce-container-body mce-flow-layout">
        <div className="mce-container mce-flow-layout-item mce-first mce-last mce-btn-group" role="group">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

// Quicktags (Text tab): wrap the selection in a tag.
const QUICKTAGS: { id: string; value: string; label: string; open: string; close: string }[] = [
  { id: "strong", value: "b", label: "Bold", open: "<strong>", close: "</strong>" },
  { id: "em", value: "i", label: "Italic", open: "<em>", close: "</em>" },
  { id: "block", value: "b-quote", label: "Blockquote", open: "\n\n<blockquote>", close: "</blockquote>\n\n" },
  { id: "del", value: "del", label: "Deleted text (strikethrough)", open: "<del>", close: "</del>" },
  { id: "ul", value: "ul", label: "Bulleted list", open: "<ul>\n", close: "</ul>\n\n" },
  { id: "ol", value: "ol", label: "Numbered list", open: "<ol>\n", close: "</ol>\n\n" },
  { id: "li", value: "li", label: "List item", open: "\t<li>", close: "</li>\n" },
  { id: "code", value: "code", label: "Code", open: "<code>", close: "</code>" },
];

export default function ClassicEditor({ name, defaultValue = "", lastEdited }: Props) {
  const [mode, setMode] = useState<"tmce" | "html">("tmce");
  const [html, setHtml] = useState(defaultValue);
  const [advanced, setAdvanced] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const mediaInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false, autolink: true } }),
      Image,
    ],
    content: defaultValue,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  function switchTo(next: "tmce" | "html") {
    if (next === mode) return;
    if (next === "tmce") editor?.commands.setContent(html, { emitUpdate: false });
    setMode(next);
  }

  function insertQuicktag(open: string, close: string) {
    const el = textarea.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value } = el;
    const next = value.slice(0, start) + open + value.slice(start, end) + close + value.slice(end);
    setHtml(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + open.length, end + open.length);
    });
  }

  async function onMedia(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file, "blog");
      if (mode === "tmce") editor?.chain().focus().setImage({ src: url, alt: "" }).run();
      else insertQuicktag(`<img src="${url}" alt="" />`, "");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "The image could not be uploaded.");
    } finally {
      setUploading(false);
    }
  }

  const plainText = html.replace(/<[^>]+>/g, " ").trim();
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const path = editor ? elementPath(editor) : ["p"];

  return (
    <div id="postdivrich" className="postarea wp-editor-expand">
      <div id="wp-content-wrap" className={`wp-core-ui wp-editor-wrap ${mode === "tmce" ? "tmce-active" : "html-active"} has-dfw`}>
        <div id="wp-content-editor-tools" className="wp-editor-tools hide-if-no-js">
          <div id="wp-content-media-buttons" className="wp-media-buttons">
            <button
              type="button"
              id="insert-media-button"
              className="button insert-media add_media"
              disabled={uploading}
              onClick={() => mediaInput.current?.click()}
            >
              <span className="wp-media-buttons-icon" /> {uploading ? "Uploading…" : "Add Media"}
            </button>
            <input ref={mediaInput} type="file" accept="image/*" hidden onChange={onMedia} />
          </div>
          <div className="wp-editor-tabs">
            <button type="button" id="content-tmce" className="wp-switch-editor switch-tmce" aria-pressed={mode === "tmce"} onClick={() => switchTo("tmce")}>
              Visual
            </button>
            <button type="button" id="content-html" className="wp-switch-editor switch-html" aria-pressed={mode === "html"} onClick={() => switchTo("html")}>
              Text
            </button>
          </div>
        </div>

        <div id="wp-content-editor-container" className="wp-editor-container">
          {mode === "html" && (
            <div id="ed_toolbar" className="quicktags-toolbar hide-if-no-js">
              {QUICKTAGS.slice(0, 2).map((tag) => (
                <input key={tag.id} type="button" id={`qt_content_${tag.id}`} className="ed_button button button-small" aria-label={tag.label} value={tag.value} onClick={() => insertQuicktag(tag.open, tag.close)} />
              ))}
              <input
                type="button"
                id="qt_content_link"
                className="ed_button button button-small"
                aria-label="Insert link"
                value="link"
                onClick={() => {
                  const url = window.prompt("Enter the destination URL", "https://");
                  if (url) insertQuicktag(`<a href="${url}">`, "</a>");
                }}
              />
              {QUICKTAGS.slice(2, 4).map((tag) => (
                <input key={tag.id} type="button" id={`qt_content_${tag.id}`} className="ed_button button button-small" aria-label={tag.label} value={tag.value} onClick={() => insertQuicktag(tag.open, tag.close)} />
              ))}
              <input
                type="button"
                id="qt_content_img"
                className="ed_button button button-small"
                aria-label="Insert image"
                value="img"
                onClick={() => {
                  const src = window.prompt("Enter the URL of the image", "https://");
                  if (src) insertQuicktag(`<img src="${src}" alt="" />`, "");
                }}
              />
              {QUICKTAGS.slice(4).map((tag) => (
                <input key={tag.id} type="button" id={`qt_content_${tag.id}`} className="ed_button button button-small" aria-label={tag.label} value={tag.value} onClick={() => insertQuicktag(tag.open, tag.close)} />
              ))}
            </div>
          )}

          <div className="mce-tinymce mce-container mce-panel" role="application" style={{ display: mode === "tmce" ? undefined : "none", borderWidth: 1 }}>
            <div className="mce-container-body mce-stack-layout">
              <div className="mce-top-part mce-container mce-stack-layout-item mce-first">
                <div className="mce-container-body">
                  <div className="mce-toolbar-grp mce-container mce-panel mce-first mce-last" role="group">
                    <div className="mce-container-body mce-stack-layout">
                      <Toolbar first last={!advanced}>
                        <div className="mce-widget mce-btn mce-menubtn mce-fixed-width mce-listbox mce-first mce-btn-has-text" role="button" aria-haspopup="true" style={{ position: "relative" }}>
                          <button role="presentation" type="button" tabIndex={-1}>
                            <span className="mce-txt">{FORMATS.find((f) => f.value === (editor ? currentFormat(editor) : "p"))?.label}</span>{" "}
                            <i className="mce-caret" />
                          </button>
                          <select
                            aria-label="Paragraph"
                            value={editor ? currentFormat(editor) : "p"}
                            onChange={(event) => {
                              const value = event.target.value;
                              if (!editor) return;
                              if (value === "p") editor.chain().focus().setParagraph().run();
                              else editor.chain().focus().setHeading({ level: Number(value.slice(1)) as 2 | 3 | 4 }).run();
                            }}
                          >
                            {FORMATS.map((format) => (
                              <option key={format.value} value={format.value}>
                                {format.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <MceButton icon="bold" label="Bold (Ctrl+B)" active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()} />
                        <MceButton icon="italic" label="Italic (Ctrl+I)" active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()} />
                        <MceButton icon="bullist" label="Bulleted list (Shift+Alt+U)" active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
                        <MceButton icon="numlist" label="Numbered list (Shift+Alt+O)" active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
                        <MceButton icon="blockquote" label="Blockquote (Shift+Alt+Q)" active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()} />
                        <MceButton icon="link" label="Insert/edit link (Ctrl+K)" active={editor?.isActive("link")} onClick={() => editor && promptLink(editor)} />
                        <MceButton icon="unlink" label="Remove link" disabled={!editor?.isActive("link")} onClick={() => editor?.chain().focus().extendMarkRange("link").unsetLink().run()} />
                        <MceButton icon="wp_adv" label="Toolbar Toggle (Shift+Alt+Z)" active={advanced} last onClick={() => setAdvanced((value) => !value)} />
                      </Toolbar>
                      {advanced && (
                        <Toolbar last>
                          <MceButton icon="strikethrough" label="Strikethrough (Shift+Alt+D)" first active={editor?.isActive("strike")} onClick={() => editor?.chain().focus().toggleStrike().run()} />
                          <MceButton icon="underline" label="Underline (Ctrl+U)" active={editor?.isActive("underline")} onClick={() => editor?.chain().focus().toggleUnderline().run()} />
                          <MceButton icon="hr" label="Horizontal line" onClick={() => editor?.chain().focus().setHorizontalRule().run()} />
                          <MceButton icon="removeformat" label="Clear formatting" onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()} />
                          <MceButton icon="undo" label="Undo (Ctrl+Z)" disabled={!editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()} />
                          <MceButton icon="redo" label="Redo (Ctrl+Y)" disabled={!editor?.can().redo()} last onClick={() => editor?.chain().focus().redo().run()} />
                        </Toolbar>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mce-edit-area mce-container mce-panel mce-stack-layout-item" role="group" style={{ borderWidth: "1px 0px 0px" }}>
                <EditorContent editor={editor} />
              </div>
              <div className="mce-statusbar mce-container mce-panel mce-stack-layout-item mce-last" role="group" style={{ borderWidth: "1px 0px 0px" }}>
                <div className="mce-container-body mce-flow-layout">
                  <div className="mce-path mce-flow-layout-item mce-first">
                    {path.map((tag, index) => (
                      <Fragment key={index}>
                        {index > 0 && <div className="mce-divider" aria-hidden="true">{" » "}</div>}
                        <div role="button" className={`mce-path-item${index === path.length - 1 ? " mce-last" : ""}`} tabIndex={-1} aria-level={index + 1}>
                          {tag}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {mode === "html" && (
            <textarea
              ref={textarea}
              className="wp-editor-area"
              rows={20}
              autoComplete="off"
              cols={40}
              id="content"
              value={html}
              onChange={(event) => setHtml(event.target.value)}
            />
          )}
          <input type="hidden" name={name} value={html} />
        </div>
      </div>

      <table id="post-status-info">
        <tbody>
          <tr>
            <td id="wp-word-count" className="hide-if-no-js">
              Word count: <span className="word-count">{wordCount}</span>
            </td>
            <td className="autosave-info">
              <span className="autosave-message">&nbsp;</span>
              {lastEdited && <span id="last-edit">{lastEdited}</span>}
            </td>
            <td id="content-resize-handle" className="hide-if-no-js">
              <br />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
