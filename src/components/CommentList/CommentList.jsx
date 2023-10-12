import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import "./CommentList.css";

// eslint-disable-next-line react/prop-types
function CommentList({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsRef = collection(firestore, "comments");
        const q = query(
          commentsRef,
          where("postId", "==", postId),
          orderBy("createdAt", "desc") // เปลี่ยนเป็น "desc" เพื่อเรียงจากใหม่สุดไปยังเก่าสุด
        );
        const commentSnapshot = await getDocs(q);
        const commentList = commentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentList);
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
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(commentQuery, (snapshot) => {
      const updatedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(updatedComments);
    });
    return () => {
      // ยกเลิก subscribe เมื่อคอมโพเนนต์ถูกยกเลิก
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, postId]);

  return (
    <>
      <h3>Comments</h3>
      <ul id="comment-unorder">
        {comments.map((comment) => (
          <li key={comment.id}>
            <div className="comment-section">
              <img
                src={"/virieiei.jpg"}
                alt="รูปภาพตัวอย่าง"
              />
              <div className="comment-text">
                <label>Virieiei</label>
                <p>{comment.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default CommentList;
