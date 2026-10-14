import { Link } from "react-router-dom"
import HeroSlider from "../components/HeroSlider"
import ProductCard from "../components/ProductCard"
import { useShelf } from "../context/ShelfContext"

export default function Home() {
  const { products, added, categories, categoryCount } = useShelf()
  const highlights = [...added, ...products.filter((product) => !added.some((item) => item.id === product.id))].slice(0, 8)
  return (
    <div className="space-y-12">
      <section className="grid overflow-hidden rounded-[2rem] bg-[#0e4a45] text-white lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-5 p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d6f25c]">
            Selz · Kigali
          </p>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Everyday shopping, priced like the market.
          </h1>
          <p className="max-w-md text-white/80">
            Fruit, vegetables, dairy, and pantry staples with the prices you
            actually see in Kigali shops.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="rounded-full bg-[#d6f25c] px-6 py-3 text-sm font-bold text-[#0e4a45]"
            >
              Shop the market
            </Link>
            <Link
              to="/shop?category=Vegetables"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold"
            >
              Fresh vegetables
            </Link>
          </div>
        </div>
        <HeroSlider />
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-[#12312e]">Categories</h2>
          <Link to="/shop" className="text-sm font-semibold text-[#0e4a45]">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const sample = products.find((product) => product.category === category)
            return (
              <Link
                key={category}
                to={`/shop?category=${encodeURIComponent(category)}`}
                className="rounded-3xl bg-white p-3 text-center shadow-sm ring-1 ring-black/5"
              >
                <img
                  src={sample?.image}
                  alt=""
                  className="mx-auto h-20 w-20 rounded-full object-cover"
                />
                <p className="mt-3 font-semibold text-[#12312e]">{category}</p>
                <p className="text-xs text-[#5d6b68]">{categoryCount(category)} items</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          to="/shop?category=Fruit"
          className="relative overflow-hidden rounded-[2rem] bg-[#12312e] text-white"
        >
          <img
            src="https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Fresh fruit"
            className="h-56 w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <p className="text-sm font-semibold text-[#d6f25c]">In season</p>
            <p className="text-3xl font-extrabold">Fresh fruit</p>
          </div>
        </Link>
        <Link
          to="/shop?category=Dairy"
          className="relative overflow-hidden rounded-[2rem] bg-[#12312e] text-white"
        >
          <img
            src="https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="A glass bottle of milk"
            className="h-56 w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <p className="text-sm font-semibold text-[#d6f25c]">Daily staples</p>
            <p className="text-3xl font-extrabold">Milk and dairy</p>
          </div>
        </Link>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-[#12312e]">On the shelf</h2>
          <Link to="/shop" className="text-sm font-semibold text-[#0e4a45]">
            Browse the shop
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {highlights.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
