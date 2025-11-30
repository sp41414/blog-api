export default function Comments({ comments }) {
  return (
    <div className="space-y-6">
      {comments.length > 0 ? (
        comments.map((comment) => {
          return (
            <div
              key={comment.id}
              className="bg-neutral-800 p-6 rounded-lg border border-neutral-800/50"
            >
              <div className="flex items-start mb-2">
                <span className="text-emerald-400 font-medium">
                  {/* this should never happen, as the comment author is REQUIRED */}
                  {comment.author ? comment.author : "Anonymous"}
                </span>
              </div>
              <p className="text-neutral-300 text-sm sm:text-base">
                {comment.text}
              </p>
            </div>
          );
        })
      ) : (
        <p className="text-neutral-500 italic text-center">No comments yet!</p>
      )}
    </div>
  );
}
