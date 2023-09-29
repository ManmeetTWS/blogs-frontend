import Navbar from "../components/Navbar/Navbar";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateBlog() {
  const { userData } = useAuthContext();

  const [blogData, setBlogData] = useState("");

  const handleSubmit = async () => {
    const blog = {
      blogData: blogData,
      author: userData.user.username,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}api/createBlog`,
      blog,
      {
        headers: {
          authorization: `Bearer ${userData?.token}`,
        },
      }
    );

    if (response.status === 200) {
      console.log(response.data);
      setBlogData("");
      toast.success('Blog Created Successfully')
    }
    if (response.status !== 200) {
      toast.error(response.data.error);
    }
  };

  

  return (
    <div className="createBlog">
      <Navbar />

      <div
        className="cb-content"
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      >
        <h2 className="cb-h2" style={{ paddingTop: "120px" }}>
          Write your Blog:
        </h2>
        <CKEditor
          style={{ marginTop: "100px" }}
          editor={ClassicEditor}
          data={blogData}
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
              "bulletedList",
              // "|",
              // "imageUpload"
            ]
          }}

          onChange={(event, editor) => {
            const data = editor.getData();

            setBlogData(data);
          }}
        />



        <button
          onClick={handleSubmit}
          style={{ marginTop: "20px", padding: "7px 15px", cursor: "pointer" }}
        >
          Submit
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
  );
}

export default CreateBlog;
