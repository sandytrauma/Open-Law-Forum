"use client"
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { IoMdTrash } from "react-icons/io";


interface Comment {
  id: number;
  content: string;
  commenter: string;
  timestamp: string;
}

interface ForumPost {
  id: number;
  post_title: string;
  content: string;
  post_author: string;
  timestamp: string;
  comments: Comment[];
}

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  

  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");

  // Persisted user name for comments
  const [commenter, setCommenter] = useState<string>("");
 const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const storedCommenter = localStorage.getItem("commenterName") || "";
    setCommenter(storedCommenter);
  }, []);

  const saveCommenterName = (name: string) => {
    localStorage.setItem("commenterName", name);
    setCommenter(name);
  };

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      const apiurlPosts = process.env.NEXT_PUBLIC_FORUM_URL || "https://Open-law-forum.netlify.app/api"
      try {
        const res = await fetch(`${apiurlPosts}/posts`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

  // Fetch comments for the selected post
  useEffect(() => {
    if (selectedPost) {
      const fetchComments = async () => {
         const apiurlComments = process.env.NEXT_PUBLIC_FORUM_URL || "https://Open-law-forum.netlify.app"
        try {
          const res = await fetch(`${apiurlComments}/comments?postId=${selectedPost?.id}`);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          setComments(data);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      };
      fetchComments();
    }
  }, [selectedPost]);

  // Add a new post
  const addPost = async () => {
   
    if (title.trim() && content.trim() && author.trim()) {
      setLoading(true);
      try {
        const apiurlAddPosts = process.env.NEXT_PUBLIC_FORUM_URL || `https://Open-law-forum.netlify.app`;
        const res = await fetch(`${apiurlAddPosts}/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            post_title: title,
            content,
            post_author: author,
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to add post: ${res.status}`);
        }

        const newPost = await res.json();
        setPosts((prev) => [...prev, newPost]);
        setSelectedPost(newPost);
        setTitle("");
        setContent("");
        setAuthor("");
      } catch (error) {
        console.error("Failed to add post:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("All fields are required");
    }
  };

  // Add a comment to a post
  const addComment = async () => {
    if (commentContent.trim()) {
      setLoadingComment(true);
      try {
         const apiurlAddComments = process.env.NEXT_PUBLIC_FORUM_URL || `https://Open-law-forum.netlify.app`;
        const res = await fetch(`${apiurlAddComments}/comments?postId=${selectedPost?.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: commentContent,
            commenter: commenter || "Anonymous", // Default to "Anonymous" if no commenter
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to add comment: ${res.status}`);
        }

        const newComment = await res.json();
        setComments((prev) => [...prev, newComment]);
        setCommentContent("");
      } catch (error) {
        console.error("Failed to add comment:", error);
      } finally {
        setLoadingComment(false);
      }
    } else {
      alert("Comment content is required.");
    }
  };

  // Remove a post
  const removePost = async (postId: number) => {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setSelectedPost(null);
    } else {
      console.error("Failed to delete post.");
    }
  };

  // Select a post and join the discussion
  const joinDiscussion = (post: ForumPost) => {
    setSelectedPost(post);
  };

  return (
    <div className="min-h-screen bg-gray-100">
       <Overlay/>
    <div className="forum-container p-4 w-full h-screen overflow-scroll md:w-3/4 mx-auto rounded-lg shadow-lg bg-teal-300 mt-8">
     
      <h1 className="text-center mt-5 text-teal-800 text-2xl md:text-3xl font-mono font-extrabold">
        Forum
      </h1>

      {/* Post creation section */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Enter your name..."
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border p-2 rounded text-black focus:bg-teal-200"
        />
        <input
          type="text"
          placeholder="Enter post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded text-black focus:bg-teal-200"
        />
        <textarea
          placeholder="Write your post..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded text-black focus:bg-teal-200"
          rows={4}
        />
        <button
          onClick={addPost}
          className="flex items-center justify-center gap-2 p-2 bg-teal-600 text-white rounded transition-all hover:bg-teal-700"
          disabled={loading}
        >
          {loading ? (
            "Adding..."
          ) : (
            <>
              <IoMdAddCircle /> Add Post
            </>
          )}
        </button>
      </div>

      {/* Selected discussion */}
      {selectedPost && (
        <div className="mt-6 p-4 bg-teal-200 border rounded shadow">
          <h2 className="text-teal-800 font-bold text-lg">
            Discussion: {selectedPost.post_title}
          </h2>
          <p className="text-gray-700 mt-2">{selectedPost.content}</p>
          <p className="text-gray-500 text-sm mt-1">
            By {selectedPost.post_author} | {selectedPost.timestamp}
          </p>

          
          {/* Delete Post */}
          {selectedPost && selectedPost.post_author === commenter && (
            <div className="mt-6">
              <button
                onClick={() => removePost(selectedPost.id)}
                className="text-red-600"
              >
                <IoMdTrash /> Delete Post
              </button>
            </div>
          )}

          {/* Comment Section */}
          <div className="mt-4">
            {!commenter && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter your name to comment..."
                  onChange={(e) => saveCommenterName(e.target.value)}
                  className="border p-2 rounded text-black focus:bg-teal-200 mb-2"
                />
              </div>
            )}
            <textarea
              placeholder="Write your comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="border p-2 rounded text-black focus:bg-teal-200"
            />
            <button
              onClick={addComment}
              className="flex items-center justify-center gap-2 p-2 bg-teal-600 text-white rounded transition-all hover:bg-teal-700 mt-2"
              disabled={loadingComment || !commenter}
            >
              {loadingComment ? "Adding comment..." : "Add Comment"}
            </button>

            {/* List of comments */}
            <div className="mt-4 space-y-2">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white p-3 rounded shadow-lg"
                  >
                    <p>{comment.content}</p>
                    <p className="text-sm text-gray-500">
                      By {comment.commenter} | {comment.timestamp}
                    </p>
                  </div>
                ))
              ) : (
                <p>No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List of posts */}
      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-teal-100 p-4 rounded shadow-lg cursor-pointer hover:bg-teal-200"
            onClick={() => joinDiscussion(post)}
          >
            <h3 className="text-teal-800 font-semibold text-lg">
              {post.post_title}
            </h3>
            <p className="text-gray-700">{post.content}</p>
            <p className="text-sm text-gray-500">{post.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Forum;
