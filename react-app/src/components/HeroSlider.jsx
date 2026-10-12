import { useEffect, useState } from "react"

const slides = [
  {
    src: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "A shopping cart filled with fresh groceries",
  },
  {
    src: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "A spread of fresh fruit",
  },
  {
    src: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Ripe tomatoes",
  },
  {
    src: "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "A bunch of bananas",
  },
]

export default function HeroSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (motion.matches) return undefined

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="relative h-72 overflow-hidden lg:h-full lg:min-h-0">
      <div
        className="absolute inset-0 flex h-full transition-transform duration-700 ease-in-out"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${(index * 100) / slides.length}%)`,
        }}
      >
        {slides.map((slide) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className="h-full object-cover"
            style={{ width: `${100 / slides.length}%` }}
          />
        ))}
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show photo ${slideIndex + 1}`}
            aria-current={slideIndex === index ? "true" : undefined}
            onClick={() => setIndex(slideIndex)}
            className={`h-2.5 w-2.5 rounded-full ${slideIndex === index ? "bg-white" : "bg-white/45"}`}
          />
        ))}
      </div>
    </div>
  )
}
