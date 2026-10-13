import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { categories } from "../data/products"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

export default function Header() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { count } = useCart()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  function onSearch(event) {
    event.preventDefault()
    const next = query.trim()
    navigate(next ? `/shop?q=${encodeURIComponent(next)}` : "/shop")
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur">
      <div className="border-b border-black/5">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="text-3xl font-extrabold tracking-tight text-[#0e4a45]">
            Selz
          </Link>
          <form onSubmit={onSearch} className="hidden min-w-0 flex-1 md:block">
            <label className="sr-only" htmlFor="search">
              Search products
            </label>
            <div className="flex overflow-hidden rounded-full border border-[#d7e0dc] bg-[#f7f8f6] focus-within:border-[#0e4a45]">
              <input
                id="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tomatoes, rice, milk..."
                className="min-w-0 flex-1 bg-transparent px-5 py-3 outline-none"
              />
              <button type="submit" className="px-5 text-sm font-semibold text-[#0e4a45]">
                Search
              </button>
            </div>
          </form>
          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <Link
                to="/account"
                className="hidden rounded-full px-3 py-2 text-sm font-semibold text-[#0e4a45] sm:block"
              >
                {user.name}
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-full px-3 py-2 text-sm font-semibold text-[#0e4a45] sm:block"
              >
                Account
              </Link>
            )}
            <Link
              to="/cart"
              className="rounded-full bg-[#0e4a45] px-4 py-2 text-sm font-semibold text-white"
            >
              Cart {count}
            </Link>
            <button
              type="button"
              className="rounded-full border border-[#d7e0dc] px-3 py-2 text-sm font-semibold md:hidden"
              onClick={() => setOpen((value) => !value)}
            >
              Menu
            </button>
          </div>
        </div>
        <form onSubmit={onSearch} className="px-4 pb-3 md:hidden">
          <div className="flex overflow-hidden rounded-full border border-[#d7e0dc] bg-[#f7f8f6] focus-within:border-[#0e4a45]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tomatoes, rice, milk..."
              className="min-w-0 flex-1 bg-transparent px-5 py-3 outline-none"
            />
            <button type="submit" className="px-5 text-sm font-semibold text-[#0e4a45]">
              Search
            </button>
          </div>
        </form>
      </div>
      <nav className={`${open ? "block" : "hidden"} border-b border-black/5 md:block`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-sm font-semibold text-[#12312e] md:flex-row md:items-center md:gap-6">
          <NavLink to="/" className="hover:text-[#0e4a45]" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" className="hover:text-[#0e4a45]" onClick={() => setOpen(false)}>
            Shop
          </NavLink>
          {(user?.role === "seller" || user?.role === "admin") && (
            <NavLink to="/catalog" className="hover:text-[#0e4a45]" onClick={() => setOpen(false)}>
              Catalog
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/sellers" className="hover:text-[#0e4a45]" onClick={() => setOpen(false)}>
              Sellers
            </NavLink>
          )}
          {categories.map((category) => (
            <Link
              key={category}
              to={`/shop?category=${encodeURIComponent(category)}`}
              className="text-[#3e524e] hover:text-[#0e4a45]"
              onClick={() => setOpen(false)}
            >
              {category}
            </Link>
          ))}
          {user ? (
            <Link to="/account" className="sm:hidden" onClick={() => setOpen(false)}>
              {user.name}
            </Link>
          ) : (
            <Link to="/login" className="sm:hidden" onClick={() => setOpen(false)}>
              Account
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
