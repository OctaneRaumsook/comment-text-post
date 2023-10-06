import './App.css'
import NewPostForm from './components/NewPostForm/NewPostForm'
import PostList from './components/PostList/PostList'
// eslint-disable-next-line no-unused-vars
import { app, firestore } from './firebase/firebase'

function App() {

  return (
    <>
      <div className='grid-container'>
        <section id='UserInterface' className='card'>
          <div className="profiles">
                <img src={"/moutain-and-sky-from-pov-2d.png"} alt="รูปภาพตัวอย่าง" />
                <div className="user-details"><h1>Name</h1></div>
            </div>
          <div id="text-field"><NewPostForm firestore={firestore}/></div>
        </section>
        <section id="PostListInterface"><PostList /></section>
      </div>
    </>
  )
}

export default App
