import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Account() {
  const { user, logout } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="mx-auto max-w-lg rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-extrabold text-[#12312e]">Account</h1>
      <p className="mt-4 text-lg font-semibold text-[#12312e]">{user.name}</p>
      <p className="text-sm text-[#5d6b68]">{user.email}</p>
      {user.role === "user" || !user.role ? (
        <p className="mt-4 text-sm text-[#5d6b68]">You can shop and keep a cart. Sellers add products.</p>
      ) : null}
      <div className="mt-6 flex flex-col gap-3">
        {user.role === "seller" && (
          <Link
            to="/catalog"
            className="rounded-2xl bg-[#0e4a45] px-4 py-3 text-center font-semibold text-white"
          >
            My products
          </Link>
        )}
        {user.role === "admin" && (
          <Link
            to="/sellers"
            className="rounded-2xl bg-[#0e4a45] px-4 py-3 text-center font-semibold text-white"
          >
            Manage sellers
          </Link>
        )}
        <button
          type="button"
          onClick={logout}
          className="rounded-2xl border border-[#d7e0dc] px-4 py-3 font-semibold text-[#0e4a45]"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
