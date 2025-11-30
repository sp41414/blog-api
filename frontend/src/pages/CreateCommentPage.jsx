import Spinner from "../components/ui/LoadingSpinner";
import ErrorAlert from "../components/ui/ErrorAlert";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Form from "../components/Form";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export default function CreateCommentPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({ text: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate(`/post/${id}`);
    }
  }, [user, navigate, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const token = localStorage.getItem("token");
    const result = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/posts/${id}/comments`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: formData.text }),
      }
    );
    if (result.status === 429) {
      setIsSubmitting(false);
      setError("Too many comments, please wait and try again later");
      return;
    }
    const data = await result.json();
    if (result.ok) {
      setIsSubmitting(false);
      navigate(`/post/${id}`);
    } else {
      setIsSubmitting(false);
      if (Array.isArray(data.error.message)) {
        setError(data.error.message.map((error) => error.msg).join(" "));
      } else {
        setError(data.error.message);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 overflow-x-hidden">
      <NavBar />
      {loading && (
        <main className="flex-1 flex flex-col items-center justify-center">
          <Spinner size="xl" />
        </main>
      )}
      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}
      {!loading && (
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <Form
            title="Add a Comment"
            description="Share your thoughts on this post"
            onSubmit={handleSubmit}
            submitButtonText="Post Comment"
            isSubmitting={isSubmitting}
            fields={[
              {
                name: "text",
                label: "Comment",
                multiline: true,
                rows: 6,
                value: formData.text,
                onChange: handleChange,
                placeholder: "Write your comment here...",
                limit: 200,
              },
            ]}
          />
        </main>
      )}
      <Footer />
    </div>
  );
}
