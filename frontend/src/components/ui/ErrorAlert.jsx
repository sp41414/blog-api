export default function ErrorAlert({ message }) {
  return (
    <div className="bg-red-950/50 border-l-4 border-red-500 p-4 rounded-r">
      <p className="text-red-300">{message}</p>
    </div>
  );
}
