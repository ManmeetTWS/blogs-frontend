import { Link } from 'react-router-dom';
import './Blog.css'
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

function Blog({data}) {

  const regex = /<h2>(.*?)<\/h2>/i;
  const matches = data.blogData.match(regex);
  const heading = matches ? matches[1] : "This blog has no heading.";

  const wordCount = data.blogData.split(' ').length;
  const averageWordsPerMinute = 225;
  const readTimeMinutes = Math.ceil(wordCount / averageWordsPerMinute);


  return (
   <Link to={`/blog/${data._id}`}>
     <div className="blog" style={{maxWidth:'450px', margin:'20px 20px', minWidth:'450px', boxShadow:"rgba(0, 0, 0, 0.2) 1px 1px 30px", color:'black' , padding:"20px", borderRadius:"10px"}}>
        <h2 dangerouslySetInnerHTML={{ __html: heading }}></h2>

        <div className="timeandauthor" style={{display:'flex', justifyContent:'space-between', marginTop:'20px'}}>
          <p style={{ fontSize:'14px'}}><strong>Uploaded {formatDistanceToNow(new Date(data?.createdAt),{addSuffix: true})}</strong></p>
          <p style={{ fontSize:'14px'}}><strong>Written by - {data.author}</strong></p>
          
        </div>
        <div className="likesandreadtime" style={{display:'flex', justifyContent:'space-between', marginTop:'10px'}}>
        <p style={{ fontSize:'14px'}}>Likes : {data.blogLikes.length}</p>
        <p style={{ fontSize:'14px', color:"rgba(0,0,0,0.5)"}}>{readTimeMinutes} minute read</p>
        </div>
    </div>
   </Link>
  )
}

export default Blog