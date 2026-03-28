export default function RouteLabel({ path }) {
  return (
    <div className="fixed bottom-4 right-4 z-[5000] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#1E3A8A] shadow-lg">
      Route: <span className="font-mono text-slate-600">{path}</span>
    </div>
  );
}
