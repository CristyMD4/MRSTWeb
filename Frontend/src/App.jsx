import Book from './pages/Book'
import { Navigate, Route, Routes } from 'react-router-dom'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Services from './pages/Services'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import ServiceDetail from './pages/ServiceDetail'
import Shop from './pages/Shop'
import ShopProduct from './pages/ShopProduct'
import Cart from './pages/Cart'
import { CartProvider } from './context/CartContext'

import AdminLayout from "./layouts/AdminLayout";
import SiteLayout from "./layouts/SiteLayout";
import AdminBookings from "./admin/Bookings";
import AdminDashboard from "./admin/Dashboard";
import AdminEmployees from "./admin/Employees";
import AdminLocations from "./admin/Locations";
import AdminMessages from "./admin/Messages";
import AdminSchedulePlanner from "./admin/SchedulePlanner";
import AdminTestimonials from "./admin/Testimonials";
import AdminShopProducts from "./admin/ShopProducts";
import EmployeeLayout from "./employee/EmployeeLayout";
import EmployeeDashboard from "./employee/Dashboard";
import ClientRoute from './components/ClientRoute'
import MyBookings from './pages/MyBookings'

function App() {
  return (
   <CartProvider>
   <Routes>
      <Route element={<SiteLayout/>}>
        <Route path="/book" element={<Book />}/>
        <Route path="/contact" element={<Contact />}/>
        <Route path="/gallery" element={<Gallery />}/>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<ShopProduct />} />
        <Route path="/cart" element={<Cart />} />
      </Route>
      <Route path="/admin/login" element={<Navigate to="/login?role=admin" replace />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="schedules" element={<AdminSchedulePlanner />} />
        <Route path="locations" element={<AdminLocations />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="shop" element={<AdminShopProducts />} />
      </Route>
      <Route path="/employee" element={<EmployeeLayout />}>
        <Route path="dashboard" element={<EmployeeDashboard />} />
      </Route>
      <Route element={<ClientRoute />}>
       <Route path="/my-bookings" element={<MyBookings />} />
      </Route>
   </Routes>
   </CartProvider>
  )
}
export default App