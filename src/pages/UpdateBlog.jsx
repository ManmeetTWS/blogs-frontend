import React, { useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar'
import { useAuthContext } from '../hooks/useAuthContext';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useState } from 'react';
import { useBlogContext } from '../hooks/useBlogContext';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { Link } from 'react-router-dom';

function UpdateBlog() {
    const { userData} = useAuthContext();
    const [prevBlogData, setPrevBlogData] = useState("");
    const [newBlogData, setNewBlogData] = useState('');
    const {blogs, dispatch} = useBlogContext();
    const [updating, setUpdating] = useState('Update')
    const { id } = useParams();

    useEffect(() => {
        const prevBlog = blogs.find((blog) => blog._id === id);
    if(prevBlog){
        setPrevBlogData(prevBlog.blogData)
    }
    else{
        toast.error("Blog does not exist!")
    }
    }, [])


    const handleUpdate = async () => {
        setUpdating('Updating')
        if(prevBlogData=== newBlogData) {
            setUpdating('Update')
            toast.error("No updates detected.")
        }else{
            const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}api/updateBlog/${id}`, {newBlogData:newBlogData} ,{
                headers:{
                    authorization: `Bearer ${userData?.token}`,
                    'Content-Type': 'application/json'
                }
            })

            if(response.status === 200) {
                
                toast.success("Blog updated successfully!")
                dispatch({type:'UPDATE_BLOGS', payload:response.data})
                setUpdating('Update')
                setPrevBlogData(newBlogData);
            }
            if(response.status !== 200) {
                toast.error(response.data.error)
                setUpdating('Update')
            }
        }
    }

  return (
    <div className="updateBlog">
        <Navbar />

        <div
        className="cb-content"
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      >
        <h2 className="cb-h2" style={{ paddingTop: "120px" }}>
          Update your Blog:
        </h2>
        <CKEditor
          style={{ marginTop: "100px" }}
          editor={ClassicEditor}
          data={prevBlogData}
        
          config={{
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "|",
              "undo",
              "redo",
              "|",
              "numberedList",
              "bulletedList"
            ]
          }}
          onChange={(event, editor) => {
            const data = editor.getData();

            setNewBlogData(data);
          }}
        />

        <Link to='/blogApp'><button style={{ marginTop: "20px",marginRight:'20px', padding: "7px 15px", cursor: "pointer" }}>Cancel</button></Link>
        <button onClick={handleUpdate}
          style={{ marginTop: "20px", padding: "7px 15px", cursor: "pointer" }} disabled={updating !== "Update"}
        >
          {updating}
        </button>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </div>
  )
}

export default UpdateBlog