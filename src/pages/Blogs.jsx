import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Blog from "../components/Blog/Blog";
import { useBlogs } from "../hooks/useBlogs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import { useBlogContext } from "../hooks/useBlogContext";
import axios from 'axios';

function Blogs() {
  const [start, setStart] = useState(0);
  const [nth, setNth] = useState(2);
  const { getBlogs, loading, error } = useBlogs(start);
  const {blogs,dispatch} = useBlogContext();
  const [data, setData] = useState([]);
  const [end, setEnd] = useState(false);

  if(error){
    toast.error(error)
  }

  useEffect(() => { setData(blogs)}, [blogs])

  useEffect(() => {
    getBlogs();
    setStart((nth-1) * 6)
    setNth(nth+1);
  }, []);

  const getMoreBlogs = async () => {
    console.log("Start : ", start)
    try {
      
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}api/blogs`, {start})
      if(response.status == 200){
        // console.log(response.data);
        dispatch({type:"ADD_BLOGS", payload:response.data.blogs})
        if(response.data.next === 0) {
          setEnd(true);
        }
      }

    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className="blogs">
      <Navbar />

      <div
        className="blogContent"
        style={{ maxWidth: "1000px", paddingTop: "100px", margin: "0px auto" }}
      >
        {loading && <div className="loading"><p style={{fontSize:'30px'}}>Loading . . . </p></div>} 
        {data?.map((blog) => (
          <Blog data={blog} key={blog._id} />
        ))}

        {!end && !loading &&  <div className="show-more" style={{marginLeft:"20px"}}>
          <Button onClick={getMoreBlogs} variant="contained" disabled={loading ? true : false}>{loading ? 'Loading . . .' : 'Show More'}</Button>
        </div>}
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
  );
}

export default Blogs;