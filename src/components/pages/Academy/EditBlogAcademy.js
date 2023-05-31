/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import {
  EditAcademyBlog,
  AddAcademyBlogPhoto,
} from "../../../services/Firebase/FirebaseBlog";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useParams } from "react-router-dom";

const EditBlogAcademy = () => {
  const { id } = useParams();
  const { blog } = useSelector((state) => state.blogs);
  const filteredBlog = blog.filter((item) => item.id === id);

  const [header, setHeader] = useState(filteredBlog[0].header);
  const [editorState, setEditorState] = useState(
    filteredBlog[0]?.content
      ? EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(filteredBlog[0]?.content)
          )
        )
      : EditorState.createEmpty()
  );

  const { user } = useSelector((state) => state.auth);
  const [downloadUrl, setDownloadUrl] = useState(filteredBlog[0].image);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const downloadUrl = await AddAcademyBlogPhoto(file);
    setDownloadUrl(downloadUrl);
  };

  const getHtmlFromEditorState = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    const markup = draftToHtml(raw);
    return markup;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const htmlContent = getHtmlFromEditorState(editorState);
    if (header && htmlContent && downloadUrl) {
      await EditAcademyBlog(filteredBlog[0].id, {
        mail: user.email,
        displayName: user.displayName,
        header,
        content: htmlContent,
        date: new Date(),
        image: downloadUrl,
        uid: user.uid,
      });
      window.location.href = "/academia";
    } else {
      toast.warning("Lütfen tüm alanları doldurunuz!");
    }
  };

  return (
    <div className="flex justify-center items-start mt-10 m-5 text-left">
      <div className="w-full max-w-7xl" onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3  border rounded p-2 shadow-md">
            <label
              className="block  tracking-wide text-gray-700  font-bold mb-2"
              htmlFor="header"
            >
              Başlık
            </label>
            <input
              className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="header"
              type="text"
              placeholder="Başlık"
              value={header}
              onChange={(event) => setHeader(event.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 border rounded p-2 shadow-md">
            <label
              className="block  tracking-wide text-gray-700  font-bold mb-2"
              htmlFor="content"
            >
              İçerik
            </label>
            <Editor
              placeholder="İçerik"
              editorState={editorState}
              onEditorStateChange={setEditorState}
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "fontFamily",
                  "list",
                  "textAlign",
                  "colorPicker",
                  "link",
                  "embedded",
                  "emoji",
                  "image",
                  "remove",
                  "history",
                ],
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 border rounded p-2 shadow-md">
            <label
              className="block  tracking-wide text-gray-700  font-bold mb-2"
              htmlFor="image"
            >
              Fotoğraf Seçin veya URL'si Girin
            </label>
            <input
              className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="file"
              id="image"
              onChange={handleUpload}
            />
            {downloadUrl && (
              <img src={downloadUrl} alt="image" className="w-full " />
            )}
            <label
              className="block  tracking-wide text-gray-700  font-bold mb-2"
              htmlFor="image"
            ></label>
            <input
              className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              id="image"
              placeholder="Fotoğraf URL'si"
              value={downloadUrl}
              onChange={(event) => setDownloadUrl(event.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            Güncelle
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBlogAcademy;
