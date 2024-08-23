"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
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
  VideoCameraIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";

// interface EditPostProps {
//     post: {
//         title: string;
//         content: string;
//         imageURL: string;
//     };
// }

export default function EditPostPage({
  params,
}: {
  params: Record<string, string>;
}) {
  const router = useRouter();
  const { title } = params;

  const [newTitle, setNewTitle] = useState<string>("");
  const [markdown, setMarkdown] = useState("");
  const [newerror, setNewError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<string>("");
  const [file, setFile] = useState<string | File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    router.push("/login"); // Redirect to login if unauthenticated
  }

  const getPost = async (title: string) => {
    const response = await fetch(`/api/post/${title}`);
    const data = await response.json();
    return data;
  };

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["post", title],
    queryFn: () => getPost(title),
  });
  console.log(data);

  useEffect(() => {
    if (data) {
      setNewTitle(data.title);
      setMarkdown(data.content);
      const tagNames = data.tags.map((tag: { name: string }) => tag.name);
      setTags(tagNames.join(", "));
      setFile(data.imageURL);
    }
  }, [data]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post("/api/upload", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image URL:", response.data.fileURL);
        const imageURL = response.data.fileURL;
        setFile(imageURL);
        // setLoading(false);
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
  const handleHeading = () => insertMarkdownSyntax("# ");
  const handleLink = () => insertMarkdownSyntax("[Link description](url)");

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
        setNewError("File size exceeds the 10MB limit.");
        return;
      } else {
        setNewError(""); // Clear error message if file is valid
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
            `<video controls height="600">
             <source src="${videoURL}" type="video/mp4">Your browser does not support the video tag</video>`
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

  const updatePost = async () => {
    if (!data) return;
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    } else {
      formData.append("image", "");
    }
    formData.append("title", newTitle);
    formData.append("content", markdown);
    formData.append("tags", tags);

    const response = await axios.put(`/api/post/${title}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to update post");
    }
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      router.push(`/allposts/${newTitle}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if
    mutation.mutate();
  };

  if (isLoading) return <p className="flex justify-center items-center h-screen">Loading...</p>;
  if (error) return <p className="flex justify-center items-center h-screen">Error: {error.message}</p>;

  return (
    <>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "#ccc",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => router.back()} className="flex items-center">
            <ArrowLeftCircleIcon className="h-6 w-6" />
          </button>
          <h1 className="text-center flex-1">Edit Post</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="image">Cover Image:</label>
            <div onClick={() => fileInputRef.current?.click()} className="p-6">
              <div className="flex flex-col items-center justify-center w-full h-64 bg-muted rounded-md border-2 border-dashed border-muted-foreground/50 cursor-pointer transition-colors hover:bg-muted/50 relative">
                {file && (
                  <Image
                    src={typeof file === "string" ? file : ""}
                    alt="Cover Image"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover rounded-md"
                  />
                )}
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={newTitle}
              className="w-full p-2.5 text-base mt-2.5"
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="tags">Tags:</label>
            <input
              name="tags"
              type="text"
              id="tags"
              value={tags}
              className="w-full p-2.5 text-base mt-2.5"
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="content">Content:</label>
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
            </div>
            <textarea
              ref={textareaRef}
              id="content"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              style={{
                width: "100%",
                height: "200px",
                marginTop: "10px",
                padding: "10px",
                fontFamily: "monospace",
                fontSize: "16px",
                lineHeight: "1.5",
              }}
            />
          </div>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            <h2>Preview</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: marked.parse(markdown) as string,
              }}
              style={{ lineHeight: "1.5" }}
            />
          </div>
          <button
            className="bg-black text-white hover:bg-white hover:text-black"
            type="submit"
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Update Post
          </button>
        </form>
      </div>
    </>
  );
}
