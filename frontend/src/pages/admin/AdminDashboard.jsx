import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import Spinner from "../../components/ui/LoadingSpinner";
import PostsCards from "../../components/PostsCards";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("published");

  useEffect(() => {
    if (user !== undefined && (!user || !user.admin)) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const posts = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`);
        const postsData = await posts.json();
        if (postsData.posts && postsData.posts.length !== 0) {
          setPosts(postsData.posts);
          setError("");
        } else {
          setPosts([]);
          setError(postsData.message || "No posts yet");
        }

        const token = localStorage.getItem("token");
        const drafts = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/posts/drafts`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const draftsData = await drafts.json();
        console.log(draftsData);
        if (draftsData.posts && draftsData.posts.length !== 0) {
          setDrafts(draftsData.posts);
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
        <main className="flex-1 flex justify-center items-center">
          <Spinner />
        </main>
      )}
      {error && (
        <main className="flex-1">
          <ErrorAlert message={error} />
        </main>
      )}
      {!loading && (
        <main className="flex-1 p-4">
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-neutral-700 mt-8">
            <div>
              <h1 className="text-4xl lg:text-5xl text-emerald-500 hover:text-emerald-300 transition-colors duration-500">
                Admin Dashboard
              </h1>
              <p className="text-neutral-400 text-lg">
                Manage your blog posts and drafts
              </p>
            </div>
            <Link
              to="/posts/new"
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Post
            </Link>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 shadow-md shadow-neutral-700">
              <div className="flex items-center justify-center">
                <div>
                  <p className="text-neutral-400 text-sm font-medium">
                    Total Posts{" "}
                  </p>
                  <p className="text-white font-bold text-3xl mt-2">
                    {posts.length + drafts.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 shadow-md shadow-neutral-700">
              <div className="flex items-center justify-center">
                <div>
                  <p className="text-neutral-400 text-sm font-medium">
                    Published
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {posts.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 shadow-md shadow-neutral-700">
              <div className="flex items-center justify-center">
                <div>
                  <p className="text-neutral-400 text-sm font-medium">Drafts</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {drafts.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-8">
            <div className="flex gap-2 border-b border-neutral-700 mb-6">
              <button
                onClick={() => setActiveTab("published")}
                className={`px-6 py-3 font-semibold transition-colors duration-200 border-b-2 cursor-pointer ${
                  activeTab === "published"
                    ? "border-emerald-500 text-emerald-500"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Published Posts ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab("drafts")}
                className={`px-6 py-3 font-semibold transition-colors cursor-pointer duration-200 border-b-2 ${
                  activeTab === "drafts"
                    ? "border-emerald-500 text-emerald-500"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Drafts ({drafts.length})
              </button>
            </div>
            <div className="min-h-[400px]">
              {activeTab === "published" && (
                <div>
                  {posts.length > 0 ? (
                    <PostsCards posts={posts} />
                  ) : (
                    <div className="text-center py-16 bg-neutral-800 rounded-lg border border-neutral-700">
                      <p className="text-neutral-400 text-lg">
                        No published posts yet
                      </p>
                      <p className="text-neutral-500 text-sm mt-2">
                        Create your first post to get started
                      </p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "drafts" && (
                <div>
                  {drafts.length > 0 ? (
                    <PostsCards posts={drafts} />
                  ) : (
                    <div className="text-center py-16 bg-neutral-800 rounded-lg border border-neutral-700">
                      <p className="text-neutral-400 text-lg">No drafts yet</p>
                      <p className="text-neutral-500 text-sm mt-2">
                        Save posts as drafts before publishing
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </main>
      )}
      <Footer />
    </div>
  );
}
