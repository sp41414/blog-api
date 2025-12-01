import { Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import DOMPurify from "dompurify";

export default function PostsCards({ posts }) {
  const { user, loading } = useContext(AuthContext);
  return (
    <>
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-neutral-800 p-6 rounded-lg hover:bg-neutral-750 transition-colors duration-200 flex flex-col max-h-96"
        >
          <h2 className="text-emerald-400 text-xl font-semibold mb-3 wrap-break-word">
            {post.title}
          </h2>

          <div
            className="text-neutral-400 mb-4 grow line-clamp-3 wrap-break-word prose prose-invert prose-sm"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.text) }}
          />

          <p className="text-neutral-500 mb-4 text-sm wrap-break-word">
            By: {post.author}
          </p>
          <div className="flex flex-col md:flex-row gap-2">
            <Link
              to={`/post/${post.id}`}
              className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-400 hover:scale-105 transition-all duration-200 active:scale-95 self-start mt-auto"
            >
              Read More
            </Link>
            {!loading && user.admin && (
              <>
                <Link
                  to={`/post/${post.id}/edit`}
                  className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-400 hover:scale-105 transition-all duration-200 active:scale-95 self-start mt-auto"
                >
                  Edit
                </Link>
                <Link
                  to={`/post/${post.id}/delete`}
                  className="inline-block px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-400 hover:scale-105 transition-all duration-200 active:scale-95 self-start mt-auto"
                >
                  Delete
                </Link>
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
