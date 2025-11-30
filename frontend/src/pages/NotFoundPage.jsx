import NavBar from "../components/NavBar";
import { Link } from "react-router";
import NotFound from "../components/ui/NotFound";
import Footer from "../components/Footer";

export default function ErrorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 overflow-x-hidden">
      <NavBar />
      <main className="flex-1 flex flex-col items-center justify-center">
        <NotFound />
        <section className="flex flex-col items-center justify-center">
          <h1 className="text-2xl text-white">
            Oh no, this page doesn't exist!
          </h1>
          <Link
            to="/"
            className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
          >
            You can go back here
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
