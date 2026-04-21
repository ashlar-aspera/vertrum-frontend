type SearchBarProps = {
  placeholder?: string;
};

export default function SearchBar({
  placeholder = "What are you researching today?"
}: SearchBarProps) {
  return (
    <div className="w-full max-w-3xl">
      <div className="flex items-center rounded-full border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent text-lg outline-none"
        />
        <button className="ml-4 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
          Search
        </button>
      </div>
    </div>
  );
}