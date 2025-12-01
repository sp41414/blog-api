import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  return (
    <Editor
      onInit={(evt, editor) => (editorRef.current = editor)}
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 500,
        menubar: true,
        base_url: "/tinymce",
        suffix: ".min",

        license_key: "gpl",

        promotion: false,

        skin: "oxide-dark",
        content_css: "dark",

        plugins: ["lists", "link", "image", "code", "table"],
        toolbar: "undo redo | bold italic | bullist numlist | link image code",
      }}
    />
  );
}
