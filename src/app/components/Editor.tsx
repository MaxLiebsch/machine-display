import React, { MutableRefObject } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-custom-build";
import { IProduct } from "../product/[...slug]/page";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

const MyEditor = ({
  onGetValues,
  onSetValue,
  name,
  ref,
}: {
  onGetValues: UseFormGetValues<IProduct>;
  onSetValue: UseFormSetValue<IProduct>;
  name: keyof IProduct;
  ref: MutableRefObject<ClassicEditor | null>;
}) => {
  return (
    <div>
      <CKEditor
       //@ts-ignore
        editor={ClassicEditor}
        data={onGetValues(name) as string}
        onReady={(editor) => {
          ref.current = editor;
        }}
        onChange={(event, editor) => {
        //@ts-ignore
          onSetValue(name, editor.getData());
        }}
        onBlur={(event, editor) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          console.log("Focus.", editor);
        }}
      />
    </div>
  );
};

export default MyEditor;
