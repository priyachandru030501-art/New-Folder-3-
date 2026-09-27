import { useState } from "react";
import "./App.css";

// ---------------- Sample Data ----------------
const bloodMenu = [
  { id: 1, group: "A+", units: 25, price: 500 },
  { id: 2, group: "A-", units: 10, price: 700 },
  { id: 3, group: "B+", units: 30, price: 500 },
  { id: 4, group: "B-", units: 8, price: 700 },
  { id: 5, group: "O+", units: 40, price: 450 },
  { id: 6, group: "O-", units: 12, price: 800 },
  { id: 7, group: "AB+", units: 15, price: 600 },
  { id: 8, group: "AB-", units: 5, price: 900 },
];

const services = [
  { id: 1, title: "Blood Donation Camp", desc: "Organize a donation camp at your location with our mobile unit." },
  { id: 2, title: "Emergency Blood Request", desc: "24/7 emergency blood supply for hospitals and patients." },
  { id: 3, title: "Blood Group Testing", desc: "Quick and accurate blood group identification service." },
  { id: 4, title: "Home Collection", desc: "Sample collection for tests directly from your home." },
];

// ---------------- Navbar ----------------
function Navbar({ page, setPage, cartCount, isLoggedIn, user, onLogout }) {
  const links = ["home", "menu", "service", "cart", "login"];

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setPage("home")}>
        🩸 LifeDrop Blood Bank
      </div>
      <ul className="nav-links">
        {links.map((link) => {
          if (link === "login" && isLoggedIn) return null;
          return (
            <li
              key={link}
              className={page === link ? "active" : ""}
              onClick={() => setPage(link)}
            >
              {link === "cart" ? `Cart (${cartCount})` : link.charAt(0).toUpperCase() + link.slice(1)}
            </li>
          );
        })}
        {isLoggedIn && (
          <li className="nav-user">
            👤 {user} <button className="logout-btn" onClick={onLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

// ---------------- Home Page ----------------
function Home({ setPage }) {
  return (
    <section className="page home">
      <div className="hero">
        <h1>Donate Blood, Save Lives</h1>
        <p>Your one unit of blood can save up to three lives. Join us today.</p>
        <div className="hero-buttons">
          <button onClick={() => setPage("menu")}>View Blood Stock</button>
          <button className="outline" onClick={() => setPage("service")}>Our Services</button>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h2>1200+</h2>
          <p>Donors Registered</p>
        </div>
        <div className="stat-card">
          <h2>145</h2>
          <p>Blood Units Available</p>
        </div>
        <div className="stat-card">
          <h2>60+</h2>
          <p>Camps Organized</p>
        </div>
        <div className="stat-card">
          <h2>24/7</h2>
          <p>Emergency Support</p>
        </div>
      </div>
    </section>
  );
}

// ---------------- Menu Page ----------------
function Menu({ addToCart }) {
  return (
    <section className="page menu">
      <h1>Available Blood Groups</h1>
      <div className="menu-grid">
        {bloodMenu.map((item) => (
          <div className="menu-card" key={item.id}>
            <h2>{item.group}</h2>
            <p>Units available: {item.units}</p>
            <p className="price">₹{item.price} / unit</p>
            <button
              disabled={item.units === 0}
              onClick={() => addToCart(item)}
            >
              {item.units === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------- Service Page ----------------
function Service() {
  return (
    <section className="page service">
      <h1>Our Services</h1>
      <div className="service-grid">
        {services.map((s) => (
          <div className="service-card" key={s.id}>
            <h2>{s.title}</h2>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------- Cart Page ----------------
function Cart({ cart, removeFromCart, updateQty, isLoggedIn, setPage }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      alert("Please login before checkout.");
      setPage("login");
      return;
    }
    alert("Request submitted! Our team will contact you shortly.");
  };

  return (
    <section className="page cart">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p className="empty">Your cart is empty. Add blood units from the Menu page.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Group</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.group}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max={item.units}
                      value={item.qty}
                      onChange={(e) => updateQty(item.id, Number(e.target.value))}
                    />
                  </td>
                  <td>₹{item.price * item.qty}</td>
                  <td>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-total">
            <h2>Total: ₹{total}</h2>
            <button onClick={handleCheckout}>Checkout</button>
          </div>
        </>
      )}
    </section>
  );
}

// ---------------- Login Page ----------------
function Login({ onLogin, setPage }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password || (isRegister && !form.name)) {
      alert("Please fill all fields.");
      return;
    }
    onLogin(form.name || form.email.split("@")[0]);
    setPage("home");
  };

  return (
    <section className="page login">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>{isRegister ? "Create Account" : "Login"}</h1>

        {isRegister && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">{isRegister ? "Register" : "Login"}</button>

        <p className="switch-text">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </form>
    </section>
  );
}

// ---------------- Footer ----------------
function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} LifeDrop Blood Bank. All rights reserved.</p>
    </footer>
  );
}

// ---------------- Main App ----------------
export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setPage("cart");
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty } : c)));
  };

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUser(name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser("");
    setPage("home");
  };

  return (
    <div className="app">
      <Navbar
        page={page}
        setPage={setPage}
        cartCount={cart.length}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
      />

      {page === "home" && <Home setPage={setPage} />}
      {page === "menu" && <Menu addToCart={addToCart} />}
      {page === "service" && <Service />}
      {page === "cart" && (
        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
          updateQty={updateQty}
          isLoggedIn={isLoggedIn}
          setPage={setPage}
        />
      )}
      {page === "login" && !isLoggedIn && <Login onLogin={handleLogin} setPage={setPage} />}

      <Footer />
    </div>
  );
}