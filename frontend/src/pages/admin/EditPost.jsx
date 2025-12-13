import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Spinner from "../../components/ui/LoadingSpinner";
import ErrorAlert from "../../components/ui/ErrorAlert";
import TextEditor from "../../components/Editor";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        title: "",
        text: "",
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user !== undefined && (!user || !user.admin)) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        async function fetchPostData() {
            setIsLoading(true);
            setError("");
            try {
                const token = localStorage.getItem("token");
                let response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/posts/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.status === 404) {
                    response = await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/posts/drafts/${id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                }
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error.message || "Failed to load post");
                }

                setFormData({
                    title: data.post.title,
                    text: data.post.text,
                });
            } catch (err) {
                console.error(err);
                setError("Failed to load post");
            } finally {
                setIsLoading(false);
            }
        }
        if (user && user?.admin) {
            fetchPostData();
        }
    }, [id, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditorChange = (content) => {
        setFormData({ ...formData, text: content });
    };

    const handleSubmit = async (published) => {
        setError("");
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/posts/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: formData.title,
                        text: formData.text,
                        published,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error.message || "Failed to update post");
            }

            navigate(`/post/${id}`);
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-900 overflow-x-hidden">
            <NavBar />

            {isLoading && loading && (
                <main className="flex-1 flex flex-col items-center justify-center">
                    <Spinner size="xl" />
                </main>
            )}

            {error && (
                <main className="flex-1 p-4">
                    <ErrorAlert message={error} />
                </main>
            )}

            {!isLoading && !loading && (
                <main className="flex-1 p-4">
                    <section className="flex flex-col pb-8 pt-12 items-center justify-center">
                        <h1 className="text-4xl lg:text-5xl text-emerald-500 hover:text-emerald-300 transition-colors duration-500 mb-2">
                            Edit Post
                        </h1>
                        <p className="text-neutral-400 text-lg">
                            Update your blog post content
                        </p>
                    </section>

                    <section className="max-w-5xl mx-auto space-y-6">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-neutral-300 mb-2"
                            >
                                Post Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter your post title..."
                                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Post Content
                            </label>
                            <div className="bg-white rounded-lg overflow-hidden">
                                <TextEditor
                                    value={formData.text}
                                    onChange={handleEditorChange}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isSubmitting ? <Spinner /> : "Save as Draft"}
                            </button>
                            <button
                                onClick={() => handleSubmit(true)}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isSubmitting ? <Spinner /> : "Publish"}
                            </button>
                            <button
                                onClick={() => navigate("/dashboard")}
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-lg transition-colors duration-200 border border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </section>
                </main>
            )}
            <Footer />
        </div>
    );
}
