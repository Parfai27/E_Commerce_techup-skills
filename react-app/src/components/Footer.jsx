import { Link } from "react-router-dom"
import { categories } from "../data/products"

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#0e4a45] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="text-2xl font-extrabold">Selz</p>
          <p className="mt-3 max-w-xs text-sm text-white/80">
            Fresh fruit, vegetables, dairy, and pantry staples for everyday meals in Kigali.
          </p>
        </div>
        <div>
          <p className="font-semibold">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {categories.map((category) => (
              <li key={category}>
                <Link to={`/shop?category=${encodeURIComponent(category)}`} className="hover:text-white">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <Link to="/login" className="hover:text-white">
                Sign in
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white">
                Create an account
              </Link>
            </li>
            <li>
              <Link to="/forgot-password" className="hover:text-white">
                Forgot password
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white">
                Cart
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/70">
        Selz · Kigali
      </div>
    </footer>
  )
}
