/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import CommentForm from "../CommentForm";
// eslint-disable-next-line no-unused-vars
import { firestore } from "../../firebase/firebase";
import "./PostList.css";
import HeartIcon from '../../assets/heart-regular.svg';
import CommentIcon from '../../assets/comment-regular.svg'

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // สร้างคิวรี่เพื่อเรียกข้อมูลโพสต์แบบเรียงตาม createdAt
    const postsRef = collection(firestore, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postList);
    });

    return () => {
      // ยกเลิกการสมัครสมาชิกเมื่อคอมโพเนนต์ถูกยกเลิก
      unsubscribe();
    };
  }, []);

  return (
      <ul style={{ paddingLeft: '0px' }}>
        {posts.map((post) => (
          <li key={post.id}>
            <div className="post-profiles">
                <img src={"/moutain-and-sky-from-pov-2d.png"} alt="รูปภาพตัวอย่าง" />
                <div className="user-details"><h1>Name</h1>
                <h2>{post.createdAt.toDate().toLocaleString()}</h2></div>
            </div>
            <p>{post.content}</p>
            <div className="interact-icons-section">
            <button>
              <img src={HeartIcon} alt="Heart Icon" width={'36.8px'}/>
              <label>LIKE</label></button>
              <button>
              <img src={CommentIcon} alt="Comment Icon" width={'36.8px'}/>
              <label>COMMENT</label></button>
            </div>
            <CommentForm postId={post.id} firestore={firestore} />
          </li>
        ))}
      </ul>
  );
}

export default PostList;
