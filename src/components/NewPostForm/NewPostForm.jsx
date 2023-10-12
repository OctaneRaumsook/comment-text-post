import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import './NewPostForm.css'

// eslint-disable-next-line react/prop-types
function NewPostForm({ firestore }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const postsRef = collection(firestore, "posts");
      await addDoc(postsRef, {
        content,
        createdAt: new Date(),
      });

      // clear data that use to post
      setContent("");
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  return (
    <div className="NewPostForm">
        <form onSubmit={handleSubmit}>
          <div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit">Post!</button>
        </form>
    </div>
  );
}

export default NewPostForm;
