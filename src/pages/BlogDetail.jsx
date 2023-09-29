import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useBlogContext } from "../hooks/useBlogContext";
import { FcLike } from 'react-icons/fc';
import Speaker from "../components/SmallComponents/Speaker";
import { Modal, Box, Button, CircularProgress } from '@mui/material';
import { calculateReadTime } from '../utils/findReadTime';
import NewComments from "../components/Comments/NewComments";


function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [likeLoading,setLikeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { dispatch } = useBlogContext();
  const [likeCount,setLikeCount] = useState(0);
  const [likeStatus, setLikeStatus] = useState('');
  const [comments,setComments] = useState([]);
  const [wordPerMinute, setWordPerMinute] = useState('');
  const [readTime, setReadTime] = useState(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    
    if(data?.blogData) {
      const wordCount = data?.blogData.split(' ').length;
      const result = calculateReadTime(wordCount, wordPerMinute);
      if(result !== 0 && result > 0){
        setReadTime(result)
      } 
      else{
        setReadTime(0);
      }
    }
  }, [wordPerMinute])



  const handleLikes = () => {
    setLikeLoading(true);
    const requestData = {
      user_id:userData?.user._id,
      blog_id:data?._id,
      like_status:true
    }

    if(userData) {
      axios.post(`${import.meta.env.VITE_BASE_URL}api/incomingLike`, requestData ,{
      headers: {
        authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((response) => {
        setLikeCount(likeCount + 1);
        setLikeStatus("Remove Like")
        toast.success("You Liked this blog!");
        setLikeLoading(false)
      })
      .catch((error) => {
        console.error(error);
        setLikeLoading(false);
      });
    }
    else{
      toast.error("Signup or Login to Like!");
      setLikeLoading(false);
    }

  }

  const handleRemoveLike = () => {
    setLikeLoading(true);
    const requestData = {
      user_id:userData?.user._id,
      blog_id:data?._id,
      like_status:false
    }

    if(userData){
      axios.post(`${import.meta.env.VITE_BASE_URL}api/incomingLike`, requestData ,{
      headers: {
        authorization: `Bearer ${userData?.token}`,
      },
      })
      .then((response) => {
        setLikeCount(likeCount-1);
        setLikeStatus("Like");
        toast.success("Like removed . . .");
        setLikeLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLikeLoading(false)
      })
    }
    else{
      toast.error("Signup or Login to Remove Like!")
      setLikeLoading(false);
    }
  }


  useEffect(() => {
    async function getBlogDetail() {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}api/blogs/${id}`
          // {
          //   headers: {
          //     authorization: `Bearer ${userData?.token}`,
          //   },
          // }
        );

        if (response.status === 200) {
          setLoading(false);
          setData(response.data);

          const likedByUser = response.data.blogLikes.some(
            (like) => like === userData?.user._id
          );
          setLikeCount(response.data.blogLikes.length);
          setComments(response.data.blogComments);
          setLikeStatus(likedByUser ? "Remove Like" : "Like");

        } else {
          setLoading(false);
          setError(response.data.error);
          if (error) {
            toast.error(response.data.error);
          }
        }
      } catch (error) {
        setLoading(false);
        setError("An error occurred while fetching the blog detail.");
      }
    }

    getBlogDetail();
  }, [id, userData]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}api/deleteBlog/${id}`,
        {
          headers: {
            authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Blog deleted successfully!");
        dispatch({ type: "DELETE_BLOG", payload: response.data });
        navigate("/blogApp"); 
      }
    } catch (error) {
      toast.error("Failed to delete blog.");
    }
  };

  return (
    <div className="blogDetail">
      <Navbar />
      
      {loading && <div>Loading . . .</div>}
      {data?.author === userData?.user.username ? (
        <div
          className="btns"
          style={{
            maxWidth: "1000px",
            paddingTop: "120px",
            margin: "0px auto",
          }}
        >
          <Link to={`/blog/update/${id}`}>
            <button style={{ padding: "4px 8px", marginRight: "20px" }}>
              Update
            </button>
          </Link>
          <button onClick={handleOpen} style={{ padding: "4px 8px" }}>Delete</button>
        </div>
      ) : (
        <div style={{ width: "100%", paddingTop: "120px" }}></div>
      )}

      <div
        className="details"
        style={{ maxWidth: "1000px", paddingTop: "20px", margin: "0px auto" }}
      >

        <div className="getReadTime">
          <label htmlFor="readTime" style={{fontSize:"16px"}}>Enter Average word count you can read in a minute to find Read Time: </label>
          <input type="number" value={wordPerMinute} min={1} style={{padding:"5px", fontSize:"16px"}} onChange={(e) => setWordPerMinute(e.target.value)} />
          {readTime !== null && readTime!==Infinity && <div className="result">Read Time : {readTime} minutes</div>}
          {readTime === Infinity && <div>Please enter values greater than 0</div>}
        </div>


        <Speaker text={data?.blogData}/>
        <div dangerouslySetInnerHTML={{ __html: data?.blogData }} />

        <div className="blog-author">
          <h3 style={{ margin: "30px 0" }}>Written by - {data?.author}</h3>
        </div>

        {data && <div className="likeBtn" style={{display:"flex", alignItems:"center"}}>
          {likeLoading ? <CircularProgress /> : <button onClick={likeStatus === "Like" ? handleLikes : handleRemoveLike} style={{ padding: "4px 8px", display:'flex', alignItems:"center", cursor:"pointer"}}><FcLike style={{marginRight:"10px"}}/>{likeStatus}</button>}
          <div className="t-likes">
            <p style={{marginLeft:"20px"}}>Likes : {likeCount}</p>
          </div>
        </div>}
      </div>


      {data?.author === userData?.user.username ? (
        <div
          className="btns"
          style={{ maxWidth: "1000px", margin: "20px auto 50px" }}
        >
          <Link to={`/blog/update/${id}`}>
          <button style={{ padding: "4px 8px", marginRight: "20px" }}>
            Update
          </button>
          </Link>
          <button onClick={handleOpen} style={{ padding: "4px 8px" }}>Delete</button>
        </div>
      ) : (
        <div style={{ width: "100%", margin: "20px 0 50px" }}></div>
      )}

      {/* <Comments blog_id={data?._id} comments={comments}/> */}
      <NewComments blog_id={data?._id} user_id = {userData?.user._id} username = {userData?.user.username}/>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
        <Box sx={{position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height:"200px",
          bgcolor: '#fff',
          borderRadius:"10px",
          boxShadow: 24,
          p: 4,}}> 
            <h2 style={{textAlign:"center"}}>Are You Sure to Delete This Blog?</h2>
            <div className="dc-modal-btns" style={{display:"flex", alignItems:"center",justifyContent:"center",margin:"25px 0"}}>
              <Button variant="outlined" onClick={handleClose}>Cancel</Button>
              <Button variant="contained" onClick={handleDelete} sx={{marginLeft:"20px"}}>Confirm Delete</Button>
            </div>
        </Box>
      </Modal>

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

export default BlogDetail;
