import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "../components/NavBar";
import Spinner from "../components/ui/LoadingSpinner";
import ErrorAlert from "../components/ui/ErrorAlert";
import Footer from "../components/Footer";
import { Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import Comments from "../components/Comments";

export default function PostPage() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const post = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/posts/${id}`
        );
        if (post.status === 404) {
          throw new Error("Post not Found");
        }
        const postData = await post.json();
        setPost(postData.post);

        const postComments = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/posts/${id}/comments`
        );
        const postCommentsData = await postComments.json();
        setComments(postCommentsData.comments);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setError("Failed to load post");
        setPost([]);
        setComments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 overflow-x-hidden">
      <NavBar />
      {loading && (
        <main className="flex-1 flex flex-col items-center justify-center">
          <Spinner size="xl" />
        </main>
      )}
      {error && (
        <main className="flex-1">
          <ErrorAlert message={error} />
        </main>
      )}
      {!loading && !error && (
        <>
          <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
            <article className="max-w-3xl mx-auto space-y-10">
              <header className="space-y-4 border-b border-neutral-800 pb-10">
                <h1 className="text-5xl text-center font-bold text-emerald-500 hover:text-emerald-400 transition-colors duration-500 wrap-break-word">
                  {post.title}
                </h1>
                {post.author && (
                  <div className="text-neutral-400 text-sm flex items-center justify-center gap-2">
                    <span className="wrap-break-word">By {post.author}</span>
                  </div>
                )}
              </header>
              <section className="prose prose-lg max-w-none text-neutral-300 leading-relaxed border-neutral-800 pb-10 wrap-break-word">
                {post.text}
              </section>
              <section>
                <h3 className="text-2xl font-semibold text-white mb-8">
                  <div className="flex justify-between">
                    <div>
                      Comments{" "}
                      <span className="text-emerald-500">
                        ({comments.length})
                      </span>
                    </div>
                    {user && (
                      <Link
                        to={`/post/${post.id}/comments/new`}
                        className="bg-emerald-500 hover:bg-emerald-400 rounded-full p-2 transition-all duration-200 text-xs active:scale-100 hover:scale-105"
                      >
                        Create Comment
                      </Link>
                    )}
                  </div>
                </h3>
                <Comments comments={comments} />
              </section>
            </article>
          </main>
        </>
      )}
      <Footer />
    </div>
  );
}
