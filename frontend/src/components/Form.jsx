export default function Form({
  title,
  description,
  onSubmit,
  submitButtonText = "Submit",
  isSubmitting = false,
  footer = null,
  fields = [],
}) {
  return (
    <div className="w-full max-w-md bg-neutral-800 border border-neutral-800/50 rounded-xl shadow-xl p-8 backdrop-blur-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-emerald-500 mb-2">{title}</h2>
        <p className="text-neutral-400 text-sm">{description}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.name || index}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              {field.label}
            </label>
            {field.multiline ? (
              <div className="flex flex-col gap-2">
                <textarea
                  name={field.name}
                  id={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  required={field.required !== false}
                  placeholder={field.placeholder}
                  rows={field.rows || 4}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-neutral-600 resize-none"
                />
                {field.limit && (
                  <p
                    className={
                      field.limit < field.value.length
                        ? "text-xs text-red-400 self-end"
                        : "text-xs text-neutral-500 self-end"
                    }
                  >
                    {field.value.length}/{field.limit}
                  </p>
                )}
              </div>
            ) : (
              <input
                type={field.type || "text"}
                name={field.name}
                id={field.name}
                value={field.value}
                onChange={field.onChange}
                required={field.required !== false}
                placeholder={field.placeholder}
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-neutral-600"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-100 disabled:hover:scale-100 flex justify-center items-center cursor-pointer"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            submitButtonText
          )}
        </button>

        {footer && (
          <div className="mt-6 text-center text-sm text-neutral-400">
            {footer}
          </div>
        )}
      </form>
    </div>
  );
}
