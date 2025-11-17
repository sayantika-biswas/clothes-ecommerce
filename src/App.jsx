import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import LoginForm from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import ContactUs from "./pages/ContactUs";
import AddressManagement from "./pages/AddressManagement";
import ReturnPolicy from "./pages/ReturnPolicy";
import TermsAndConditions from "./pages/TermandCondition";
import ProductListPage from "./pages/ProductListPage";
import NavigateProductList from "./pages/NavigateProductList";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import WishlistPage from "./pages/Wishlist";
import CartPage from "./pages/CartPage";
import ProductDetailsPage from './pages/ProductDetailsPage';
import OrdersPage from "./pages/OrdersPage";
import OrderSuccess from "./pages/OrderSuccess";
import SearchResult from "./pages/SearchResult";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css'


const App = () => {
  return (
    <Router>
      <div className="bg-cream-white m-0 p-0">
        <Navbar />
        <main className=" pt-16 sm:pt-12 md:pt-20 lg:pt-20 m-0 p-0 ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/address-management" element={<AddressManagement />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/termsandconditions" element={<TermsAndConditions />} />
            <Route path="/products/:sectionSlug/:categorySlug" element={<ProductListPage />} />
            <Route path="/:gender/:categorySlug/:subcategorySlug" element={<NavigateProductList />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:productId" element={<ProductDetailsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:orderId" element={<OrderSuccess />} />
             {/* Add this search route */}
           <Route path="/search" element={<SearchResult />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;