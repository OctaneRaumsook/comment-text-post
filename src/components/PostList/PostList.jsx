/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import CommentForm from "../CommentForm/CommentForm";
// eslint-disable-next-line no-unused-vars
import { firestore } from "../../firebase/firebase";
import "./PostList.css";
import IconHeartCircle from "../Icons/IconHeartCircle"
import IconComment from "../Icons/IconComment";
import CommentList from "../CommentList/CommentList";


function PostList() {
  const [posts, setPosts] = useState([]);
  const [openCommentForms, setOpenCommentForms] = useState([]); // State เก็บข้อมูลเกี่ยวกับการเปิด Comment Form

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
      // สร้างอาเรย์ใหม่ที่มีขนาดเท่ากับจำนวนโพสต์ และกำหนดให้ค่าเริ่มต้นเป็น false สำหรับแต่ละโพสต์
      setOpenCommentForms(Array(postList.length).fill(false));
    });

    return () => {
      // ยกเลิกการสมัครสมาชิกเมื่อคอมโพเนนต์ถูกยกเลิก
      unsubscribe();
    };
  }, []);

  const toggleCommentForm = (index) => {
    // สลับค่าในอาเรย์ openCommentForms ตาม index ที่รับเข้ามา
    const newOpenCommentForms = [...openCommentForms];
    newOpenCommentForms[index] = !newOpenCommentForms[index];
    setOpenCommentForms(newOpenCommentForms);
  };

  return (
      <ul style={{ paddingLeft: '0px' }} id="comment-ul">
        {posts.map((post, index) => (
          <li key={post.id} id="post-list">
            <div className="post-profiles">
                <img src={"/moutain-and-sky-from-pov-2d.png"} alt="รูปภาพตัวอย่าง" />
                <div className="user-details"><h1>Name</h1>
                <h2>{post.createdAt.toDate().toLocaleString()}</h2></div>
            </div>
            <p>{post.content}</p>
            <div className="interact-icons-section">
              <button>
                <IconHeartCircle width={'38.8px'} height={'36.8px'}/>
                <label>LIKE</label>
              </button>
              {/* เรียกใช้งานฟังก์ชัน toggleCommentForm เมื่อคลิกปุ่ม Comment */}
              <button onClick={() => toggleCommentForm(index)}>
                <IconComment width={'36.8px'} height={'36.8px'}/>
                <label>COMMENT</label>
              </button>
            </div>
            {/* แสดง CommentForm และ CommentList ถ้า openCommentForms[index] เป็น true */}
            {openCommentForms[index] && (
              <div>
                <CommentForm postId={post.id} firestore={firestore} />
              </div>
            )}
            <CommentList postId={post.id} />
          </li>
        ))}
      </ul>
  );
}

export default PostList;