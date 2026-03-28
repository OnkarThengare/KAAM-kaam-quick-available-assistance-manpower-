export default function Profile() {
  const raw = localStorage.getItem("kaam_user");
  const user = raw ? JSON.parse(raw) : {};

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E3A8A]">Profile</h1>
      <div className="mt-8 max-w-lg rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p>
          <span className="text-slate-500">Name:</span>{" "}
          {user.firstName} {user.lastName}
        </p>
        <p className="mt-2">
          <span className="text-slate-500">Email:</span> {user.email}
        </p>
        <p className="mt-2">
          <span className="text-slate-500">Role:</span> {user.role}
        </p>
      </div>
    </div>
  );
}
