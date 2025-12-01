import { useState, useEffect, useContext } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PostsCards from "../components/PostsCards";
import Spinner from "../components/ui/LoadingSpinner";
import ErrorAlert from "../components/ui/ErrorAlert";
import { AuthContext } from "../contexts/AuthContext";

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`);
        const posts = await res.json();
        if (posts.posts && posts.posts.length !== 0) {
          setPosts(posts.posts);
          setError("");
        } else {
          setPosts([]);
          setError(posts.message || "No posts yet");
        }
      } catch (err) {
        console.error(err.message);
        setError("Failed to load posts");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

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
      {!loading && (
        <>
          <main className="flex-1 p-4">
            <section className="flex pb-12 pt-12 items-center justify-center">
              {user ? (
                user.admin ? (
                  <p className="text-4xl lg:text-5xl text-white">
                    Welcome to your Blog,{" "}
                    <span className="text-4xl lg:text-5xl text-emerald-500 hover:text-emerald-300 transition-colors duration-500">
                      {user.username}
                    </span>
                  </p>
                ) : (
                  <p className="text-4xl lg:text-5xl text-white">
                    Welcome to my Blog,{" "}
                    <span className="text-4xl lg:text-5xl text-emerald-500 hover:text-emerald-300 transition-colors duration-500">
                      {user.username}
                    </span>
                  </p>
                )
              ) : (
                <p className="text-4xl lg:text-5xl text-white">
                  Welcome to my
                  <span className="text-4xl lg:text-5xl text-emerald-500 hover:text-emerald-300 transition-colors duration-500">
                    Blog
                  </span>
                </p>
              )}
            </section>
            <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-[95%] ">
              <PostsCards posts={posts} />
            </section>
          </main>
        </>
      )}
      <Footer />
    </div>
  );
}
