import React, { MutableRefObject } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-custom-build";
import { IProduct } from "../product/[...slug]/page";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

const Editor = ({
  onGetValues,
  onSetValue,
  ref,
}: {
  onGetValues: UseFormGetValues<IProduct>;
  onSetValue: UseFormSetValue<IProduct>;
  ref: MutableRefObject<ClassicEditor | null>;
}) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={onGetValues("details")}
      onReady={(editor) => {
        ref.current = editor;
      }}
      onChange={(event, editor) => {
        onSetValue("details", editor.getData());
      }}
      onBlur={(event, editor) => {
        console.log("Blur.", editor);
      }}
      onFocus={(event, editor) => {
        console.log("Focus.", editor);
      }}
    />
  );
};

export default Editor;
