import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuthContext } from "./hooks/useAuthContext";
import Blogs from "./pages/Blogs";
import NotFound from "./components/NotFound/NotFound";
import CreateBlog from "./pages/CreateBlog";
import BlogDetail from "./pages/BlogDetail";
import BlogsByYou from "./pages/BlogsByYou";
import UpdateBlog from "./pages/UpdateBlog";

function App() {
  const { userData } = useAuthContext();

  return (
    <BrowserRouter>
      <div className="pages">
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/login"
            element={userData ? <Navigate to="/blogApp" /> : <Login />}
          />
          <Route
            path="/signup"
            element={userData ? <Navigate to="/blogApp" /> : <Signup />}
          />
          <Route
            path="/createBlog"
            element={userData ? <CreateBlog /> : <Navigate to="/login" />}
          />
          <Route
            path="/blogApp"
            element={<Blogs />}
          />

          <Route
            path="/blog/:id"
            element={<BlogDetail />}
          />

          <Route
            path="/blog/update/:id"
            element={userData ? <UpdateBlog /> : <Navigate to="/" />}
          />


          <Route
            path={`/yourBlogs`}
            element={userData ? <BlogsByYou /> : <Navigate to="/" />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
