import { lazy, Suspense } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingSpinner from "./Components/LoadingSpinner";
import AboutPage from "./Pages/AboutUsPage";
import AdminLayout from "./Layout/AdminLayout.jsx";

import BaseLayout from "./Layout/BaseLayout";
import CollectionsPage from "./Pages/CollectionsPage.jsx";
const HomePage = lazy(() => import("./Pages/HomePage"));
const ProductListPage = lazy(() => import("./Pages/ProductListPage"));
const ProductDetailPage = lazy(() => import("./Pages/ProductDetailPage"));
// const CartPage = lazy(() => import("./Pages/CartPage"));
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const RegisterPage = lazy(() => import("./Pages/RegisterPage"));
// const WishlistPage = lazy(() => import("./Pages/WishlistPage"));
const CheckoutPage = lazy(() => import("./Pages/CheckoutPage"));
const OrdersPage = lazy(() => import("./Pages/OrdersPage"));
const OrderSuccessPage = lazy(() => import("./Pages/OrderSuccessPage"));
const TrackOrderPage = lazy(() => import("./Pages/TrackOrderPage"));
const ProtectedRoute = lazy(() => import("./Components/Auth/ProtectedRoute"));
// Promotions public page removed per request

// Admin Pages
const DashboardPage = lazy(() => import("./Pages/Admin/DashboardPage"));
const ProductsListPage = lazy(() => import("./Pages/Admin/ProductsListPage"));
const AddProductPage = lazy(() => import("./Pages/Admin/AddProductPage"));
const TaxShippingPage = lazy(() => import("./Pages/Admin/TaxShippingPage"));
// const ProfilePage = lazy(() => import("./Pages/Admin/ProfilePage.jsx"));
const CollectionsListPage = lazy(
    () => import("./Pages/Admin/CollectionsListPage"),
);
const OrdersListPage = lazy(() => import("./Pages/Admin/OrdersListPage"));
const OrderDetailsPage = lazy(() => import("./Pages/Admin/OrderDetailsPage"));
const AddOrderPage = lazy(() => import("./Pages/Admin/AddOrderPage"));
const AdminPromotionsPage = lazy(() => import("./Pages/Admin/PromotionsPage"));
const PromotionBuilderPage = lazy(
    () => import("./Pages/Admin/PromotionBuilderPage"),
);
const HeroManagerPage = lazy(() => import("./Pages/Admin/HeroManagerPage"));

const App = () => {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                pauseOnHover={false}
                closeOnClick={true}
            />
            <Suspense fallback={<LoadingSpinner message={"Loading..."} />}>
                <Routes>
                    <Route path="/" element={<BaseLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="products" element={<ProductListPage />} />
                        <Route
                            path="contact-us"
                            element={<Navigate to="/about-us" replace />}
                        />
                        <Route path="about-us" element={<AboutPage />} />
                        <Route
                            path="collections"
                            element={<CollectionsPage />}
                        />
                        {/* Public promotions page removed */}
                        <Route
                            path="product/:id"
                            element={<ProductDetailPage />}
                        />
                        {/* <Route path="cart" element={<CartPage />} /> */}
                        <Route path="checkout" element={<CheckoutPage />} />
                        <Route
                            path="track-order"
                            element={<TrackOrderPage />}
                        />
                        {/* <Route
                            path="wishlist"
                            element={
                                <ProtectedRoute roles={["user", "admin"]}>
                                    <WishlistPage />
                                </ProtectedRoute>
                            }
                        /> */}
                        <Route
                            path="orders"
                            element={
                                <ProtectedRoute roles={["user", "admin"]}>
                                    <OrdersPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="orders/success"
                            element={<OrderSuccessPage />}
                        />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="/auth/admin/login" element={<LoginPage />} />
                    <Route
                        path="/auth/admin/register"
                        element={<RegisterPage />}
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin-dashboard"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<DashboardPage />} />
                        <Route path="products" element={<ProductsListPage />} />
                        <Route
                            path="products/add"
                            element={<AddProductPage />}
                        />
                        <Route
                            path="settings/tax-shipping"
                            element={<TaxShippingPage />}
                        />
                        <Route
                            path="collections"
                            element={<CollectionsListPage />}
                        />
                        <Route path="orders" element={<OrdersListPage />} />
                        <Route
                            path="orders/:id"
                            element={<OrderDetailsPage />}
                        />
                        <Route path="orders/add" element={<AddOrderPage />} />
                        <Route
                            path="promotions"
                            element={<AdminPromotionsPage />}
                        />
                        <Route
                            path="promotions/create"
                            element={<PromotionBuilderPage />}
                        />
                        <Route path="hero" element={<HeroManagerPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </>
    );
};

export default App;
