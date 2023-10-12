/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import CommentForm from "../CommentForm/CommentForm";
import { firestore } from "../../firebase/firebase";
import "./PostList.css";
import IconHeartCircle from "../Icons/IconHeartCircle";
import IconComment from "../Icons/IconComment";
import CommentList from "../CommentList/CommentList";

function PostListItem({ post, index, openCommentForms, toggleCommentForm }) {
  return (
    <li key={post.id} id="post-list">
      <div className="post-profiles">
        <img
          src={"/virieiei.jpg"}
          alt="รูปภาพตัวอย่าง"
        />
        <div className="user-details">
          <h1>Virieiei</h1>
          <h2>{post.createdAt.toDate().toLocaleString()}</h2>
        </div>
      </div>
      <p>{post.content}</p>
      <div className="interact-icons-section">
        <button>
          <IconHeartCircle width={"38.8px"} height={"36.8px"} />
          <label>LIKE</label>
        </button>
        <button onClick={() => toggleCommentForm(index)}>
          <IconComment width={"36.8px"} height={"36.8px"} />
          <label>COMMENT</label>
        </button>
      </div>
      {openCommentForms[index] && (
        <div className="comment-form active">
          <CommentForm postId={post.id} firestore={firestore} className="comment-form" />
        </div>
      )}
      <CommentList postId={post.id} />
    </li>
  );
}

function PostList() {
  const [posts, setPosts] = useState([]);
  const [openCommentForms, setOpenCommentForms] = useState([]);

  useEffect(() => {
    const postsRef = collection(firestore, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postList);
      setOpenCommentForms(Array(postList.length).fill(false));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleCommentForm = (index) => {
    const newOpenCommentForms = [...openCommentForms];
    newOpenCommentForms[index] = !newOpenCommentForms[index];
    setOpenCommentForms(newOpenCommentForms);
  };

  return (
    <ul style={{ paddingLeft: "0px" }} id="comment-ul">
      {posts.map((post, index) => (
        <PostListItem
          key={post.id}
          post={post}
          index={index}
          openCommentForms={openCommentForms}
          toggleCommentForm={toggleCommentForm}
        />
      ))}
    </ul>
  );
}

export default PostList;
