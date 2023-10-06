// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";



// eslint-disable-next-line react/prop-types
function CommentForm({ postId, firestore }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsRef = collection(firestore, "comments");
        const q = query(
          commentsRef,
          where("postId", "==", postId),
          orderBy("createdAt", "asc")
        );
        const commentSnapshot = await getDocs(q);
        const commentList = commentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comments: ", error);
      }
    };

    fetchComments();

    // สมัครสมาชิกในคอลเลกชันความคิดเห็นเพื่อสตรีมข้อมูล
    const commentsRef = collection(firestore, "comments");
    const commentQuery = query(
      commentsRef,
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(commentQuery, (snapshot) => {
      const updatedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(updatedComments);
    });

    return () => {
      // ยกเลิกการสมัครสมาชิกเมื่อคอมโพเนนต์ถูกยกเลิก
      unsubscribe();
    };
  }, [firestore, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

  return (
    <div>
      <h3>Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          cols="50"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here"
        ></textarea>
        <button type="submit">Submit</button>
      </form>

      <h3>Comments</h3>
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>{comment.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentForm;
