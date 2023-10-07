// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
} from "firebase/firestore";
import "./CommentForm.css";
import SendIcon from "../Icons/SendIcon";

// eslint-disable-next-line react/prop-types
function CommentForm({ postId, firestore }) {
  const [comment, setComment] = useState("");
  const [textareaHeight, setTextareaHeight] = useState("auto");

  const handleTextareaChange = (e) => {
    setComment(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (comment.trim() === "") {
      return;
    }
  
    try {
      const commentsRef = collection(firestore, "comments");
      await addDoc(commentsRef, {
        postId,
        text: comment,
        createdAt: new Date(),
      });
  
      setComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  useEffect(() => {
    // ใช้ useEffect เพื่อตั้งค่าความสูงเริ่มต้นของ textarea เมื่อคอมโพเนนต์เริ่มโหลด
    const initialHeight = comment ? comment.scrollHeight + "px" : "auto";
    setTextareaHeight(initialHeight);
  }, [comment]);

  return (
    <>
      <h3>Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <div className="text-area-container">
          <textarea
            value={comment}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Write your comment here"
            className="text-coment-area"
            style={{ height: textareaHeight }}
          ></textarea>
          <div className="icon-interact">
          <button
            type="submit"
            className={`submit-button ${comment.trim() === "" ? "disabled" : ""}`}
            disabled={comment.trim() === ""}
          >
            <SendIcon width={'20.8px'} />
          </button></div>
        </div>
      </form>
    </>
  );
}

export default CommentForm;