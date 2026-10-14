import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import { CartProvider } from "./context/CartContext.jsx"
import { ShelfProvider } from "./context/ShelfContext.jsx"
import "./index.css"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ShelfProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ShelfProvider>
    </AuthProvider>
  </StrictMode>,
)
