import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { useEffect, useContext, useState } from "react";
import Spinner from "../../components/ui/LoadingSpinner";
import ErrorAlert from "../../components/ui/ErrorAlert";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

export default function DeletePost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user !== undefined && (!user || !user.admin)) {
      navigate(`/post/${id}`);
      return;
    }
    async function deletePost() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
      } catch (err) {
        console.error(err);
        setError(err.error.message);
      } finally {
        setLoading(false);
        navigate("/dashboard");
      }
    }
    deletePost();
  }, [user, navigate, id]);
  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 overflow-x-hidden">
      <NavBar />
      {loading && (
        <main className="flex flex-col flex-1 justify-center items-center">
          <Spinner size="xl" />
        </main>
      )}
      {error && (
        <main className="flex-1">
          <ErrorAlert message={error} />
        </main>
      )}
      <Footer />
    </div>
  );
}
