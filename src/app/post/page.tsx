"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/hook/useToast";
import { marked } from "marked";
import {
  BoldIcon,
  UnderlineIcon,
  ItalicIcon,
  LinkIcon,
  PhotoIcon,
  StrikethroughIcon,
  ListBulletIcon,
  NumberedListIcon,
  CodeBracketIcon,
  H1Icon,
  CodeBracketSquareIcon,
  MinusIcon,
  TableCellsIcon,
  VideoCameraIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Loader from "@/app/components/Loader";
import { useSession } from "next-auth/react";

export default function CreatePost() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const {data: session, status} = useSession();

  if (status === "unauthenticated") {
    router.push("/login"); // Redirect to login if unauthenticated
  }

  const toast = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      const file = e.target.files[0];
      try {
        setLoading(true);
        const response = await axios.post("/api/upload", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image URL:", response.data.fileURL);
        const imageURL = response.data.fileURL;
        setPreviewUrl(imageURL);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const insertMarkdownSyntax = (startTag: string, endTag: string = "") => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const { selectionStart, selectionEnd, value } = textarea;
      const selectedText = value.substring(selectionStart, selectionEnd);
      const newText = `${startTag}${selectedText}${endTag}`;
      setMarkdown(
        `${value.substring(0, selectionStart)}${newText}${value.substring(
          selectionEnd
        )}`
      );

      // Set cursor position correctly after inserting syntax
      setTimeout(() => {
        // If there was selected text, place the cursor at the end of the selected text
        // Otherwise, place the cursor between the start and end tags
        const cursorPosition =
          selectionStart +
          startTag.length +
          (selectedText ? selectedText.length : 0);
        textarea.setSelectionRange(cursorPosition, cursorPosition);
        textarea.focus();
      }, 0);
    }
  };

  const handleBold = () => insertMarkdownSyntax("**", "**");
  const handleItalic = () => insertMarkdownSyntax("*", "*");
  const handleStrikethrough = () => insertMarkdownSyntax("~~", "~~");
  const handleUnderline = () => insertMarkdownSyntax("<u>", "</u>");
  const handleUnorderedList = () => insertMarkdownSyntax("- ");
  const handleOrderedList = () => insertMarkdownSyntax("1. ");
  const handleCode = () => insertMarkdownSyntax("`", "`");
  const handleCodeBlock = () => insertMarkdownSyntax("```\n", "\n```");
  const handleHeading = () => insertMarkdownSyntax("## ");
  const handleLink = () => insertMarkdownSyntax("[Link description](url)");
  const handleHorizontalRule = () => insertMarkdownSyntax("\n---\n");
  const handleTable = () =>
    insertMarkdownSyntax(
      "| Header1 | Header2 |\n| --- | --- |\n| Row1 | Row2 |"
    );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLoading(true);

      try {
        insertMarkdownSyntax("Upload in progress...");

        const response = await axios.post("/api/upload", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image URL:", response.data.fileURL);
        const imageURL = response.data.fileURL;
        // Replace placeholder with actual markdown image syntax
        setMarkdown((prevMarkdown) =>
          prevMarkdown.replace(
            "Upload in progress...",
            `![Image description](${imageURL})`
          )
        );
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log(file);
      console.log("File size:", file.size);

      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds the 10MB limit.");
        setError("File size exceeds the 10MB limit.");
        return;
      } else {
        setError(""); // Clear error message if file is valid
      }

      setLoading(true);
      try {
        insertMarkdownSyntax("Upload in progress...");

        const response = await axios.post("/api/upload", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Video URL:", response.data.fileURL);
        const videoURL = response.data.fileURL;
        setMarkdown((prevMarkdown) =>
          prevMarkdown.replace(
            "Upload in progress...",
            `<video controls width="600" height="600">
             <source src="${videoURL}" type="video/mp4"></video>`
          )
        );
        setLoading(false);
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  const handleImage = () => {
    if (textareaRef.current) {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (e) =>
        handleImageUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
      fileInput.click();
    }
  };

  const handleVideo = () => {
    if (textareaRef.current) {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "video/*";
      fileInput.onchange = (e) =>
        handleVideoUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
      fileInput.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(file);
    console.log(title);
    console.log(tags);
    console.log(markdown);

    if (!file || !tags || !title || !markdown) {
      toast.error("Please fill in all fields and select a file.");
      // setMessage("Please fill in all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("tags", tags);
    formData.append("content", markdown);

    try {
      setLoading(true);
      const response = await axios.post("/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post uploaded successfully!");
      setMessage("Post uploaded successfully!");

      setTimeout(() => {
        router.push("/allposts");
      }, 5000);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading post:", error);
      setMessage("Error uploading post. Please try again.");
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-5 bg-gray-300 box-border">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => router.back()} className="flex items-center">
            <ArrowLeftCircleIcon className="h-6 w-6" />
          </button>
          <h1 className="text-center flex-1">Create Post</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="image">
              <div
                style={{
                  backgroundColor: "#e0e0e0",
                  border: "2px dashed #ccc",
                  transition: "background-color 0.3s",
                }}
                className="hover:bg-gray-300 p-2 flex flex-col border-2 border-gray-300 transition-colors duration-300 items-center justify-center w-full h-64 rounded-md cursor-pointer relative"
              >
                {loading ? (
                  <Loader />
                ) : previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="w-full h-full object-cover rounded-sm"
                  />
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-12 h-12 text-muted-foreground"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" x2="12" y1="3" y2="15"></line>
                    </svg>
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        color: "#888",
                      }}
                    >
                      Drag and drop your cover picture or click to select a file
                    </p>
                  </>
                )}
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </label>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 text-base mt-2.5 box-border"
              placeholder="Enter the title of your post"
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              id="tags"
              className="w-full p-2.5 text-base mt-2.5 box-border"
              placeholder="Enter tags separated by commas"
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="markdown">Content:</label>
            <div className="flex flex-wrap mb-2.5 gap-3">
              <button
                className="w-6 m-2"
                title="Bold Text"
                type="button"
                onClick={handleBold}
              >
                <BoldIcon className="h-6 w-6" />
              </button>
              <button
                className="w-6 m-2"
                title="Italic Text"
                type="button"
                onClick={handleItalic}
              >
                <ItalicIcon className="h-6 w-6" />
              </button>
              <button
                className="w-6 m-2"
                title="Strikethrough Text"
                type="button"
                onClick={handleStrikethrough}
              >
                <StrikethroughIcon className="h-6 w-6" />
              </button>
              <button
                className="w-6 m-2"
                title="Underline Text"
                type="button"
                onClick={handleUnderline}
              >
                <UnderlineIcon className="h-6 w-6" />
              </button>
              <button
                className="w-6 m-2"
                title=" Bullet List"
                type="button"
                onClick={handleUnorderedList}
              >
                <ListBulletIcon className="h-6 w-6" />
              </button>
              <button
                className="w-6 m-2"
                title="Number List"
                type="button"
                onClick={handleOrderedList}
              >
                <NumberedListIcon className="h-6 w-6" />
              </button>
              <button
                className="w-6 m-2"
                title="Single line code"
                type="button"
                onClick={handleCode}
              >
                <CodeBracketIcon className="h-6 w-6" />
              </button>
              <button
                className="w-6 m-2"
                title="Code Block"
                type="button"
                onClick={handleCodeBlock}
              >
                <CodeBracketSquareIcon className="h-6 w-6" />
              </button>
              <button
                className="w-6 m-2"
                title="Header"
                type="button"
                onClick={handleHeading}
              >
                <H1Icon className="h-6 w-6" />
              </button>
              <button
                className="w-6 m-2"
                title="Add Link"
                type="button"
                onClick={handleLink}
              >
                <LinkIcon className="h-6 w-6" />
              </button>
              <button
                className="w-6 m-2"
                title="Add Image"
                type="button"
                onClick={handleImage}
              >
                <PhotoIcon className="h-6 w-6" />
              </button>
              <button
                className="w-6 m-2"
                title="Add Video"
                type="button"
                onClick={handleVideo}
              >
                <VideoCameraIcon className="h-6 w-6" />
              </button>
              <button
                className="w-6 m-2"
                title="Horizontal Rule"
                type="button"
                onClick={handleHorizontalRule}
              >
                <MinusIcon className="h-6 w-6" />
              </button>
              <button
                className="w-6 m-2"
                title="Table"
                type="button"
                onClick={handleTable}
              >
                <TableCellsIcon className="h-6 w-6" />
              </button>
            </div>
            <textarea
              ref={textareaRef}
              id="content"
              name="content"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-48 mt-2.5 p-2.5 font-mono text-base leading-6 border border-gray-300 rounded-md box-border"
              placeholder="Enter your content here"
            />
          </div>
          <div className="border border-gray-300 p-2.5 mb-3 rounded-md">
            <h2>Preview</h2>
            <div
              className="markdown-preview"
              dangerouslySetInnerHTML={{
                __html: marked.parse(markdown) as string,
              }}
              style={{ lineHeight: "1.5", whiteSpace: "pre-wrap" }} // Added whiteSpace property here
            />
          </div>
          <button
            type="submit"
            data-testid="Upload Post"
            className={
              "hover:bg-white px-5 py-2.5 text-base text-white bg-black rounded-md transition-colors duration-300 hover:text-black cursor-pointer `${loading ? 'opacity-50 cursor-not-allowed' : ''}`"
            }
          >
            Upload Post
          </button>
        </form>
        {message && <p>{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <style jsx>{`
          .markdown-preview a {
            color: blue;
            text-decoration: underline;
          }
        `}</style>
      </div>
    </>
  );
}
