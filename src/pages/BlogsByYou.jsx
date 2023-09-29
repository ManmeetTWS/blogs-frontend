import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Blog from "../components/Blog/Blog";
import { useBlogContext } from "../hooks/useBlogContext";
import { useAuthContext } from "../hooks/useAuthContext";

function BlogsByYou() {
  const { userData } = useAuthContext();
  const { blogs } = useBlogContext();

  const currentUserData = blogs?.filter(
    (blog) => blog.author === userData.user.username
  );

  return (
    <div className="blogsByYou">
      <Navbar />

      <div
        className="blogContent"
        style={{ maxWidth: "1000px", paddingTop: "120px", margin: "0px auto" }}
      >
        {currentUserData.map((blog) => (
          <Blog data={blog} key={blog._id} />
        ))}
      </div>
    </div>
  );
}

export default BlogsByYou;
