import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Spinner from "../components/ui/LoadingSpinner";
import ErrorAlert from "../components/ui/ErrorAlert";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Form from "../components/Form";

export default function SignupPage() {
  const navigate = useNavigate();
  const { user, signup, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password fields aren't matching!");
      setIsSubmitting(false);
      return;
    }

    const result = await signup(formData.username, formData.password);

    if (result.success) {
      navigate("/");
    } else {
      if (Array.isArray(result.error)) {
        setError(result.error.map((error) => error.msg).join(", "));
        setIsSubmitting(false);
      } else {
        setError(result.error || "Failed to signup");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 overflow-x-hidden">
      <NavBar />
      {loading && (
        <main className="flex-1 flex flex-col justify-center items-center">
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
            title="Welcome"
            description="Fill in the information to create an account"
            onSubmit={handleSubmit}
            submitButtonText="Sign Up"
            isSubmitting={isSubmitting}
            fields={[
              {
                name: "username",
                label: "Username",
                type: "text",
                value: formData.username,
                onChange: handleChange,
                placeholder: "johndoe",
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                value: formData.password,
                onChange: handleChange,
                placeholder: "••••••••",
              },
              {
                name: "confirmPassword",
                label: "Confirm Password",
                type: "password",
                value: formData.confirmPassword,
                onChange: handleChange,
                placeholder: "••••••••",
              },
            ]}
            footer={
              <>
                Already have an account?
                <Link
                  to="/login"
                  className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors hover:underline duration-200 ml-2"
                >
                  Login
                </Link>
              </>
            }
          />
        </main>
      )}
      <Footer />
    </div>
  );
}
