import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingSpinner from "./Components/LoadingSpinner";
import { LOADING_MESSAGES } from "./constants";

const BaseLayout = lazy(() => import("./Layout/BaseLayout"));
const HomePage = lazy(() => import("./Pages/HomePage"));
const ProductListPage = lazy(() => import("./Pages/ProductListPage"));
const ProductDetailPage = lazy(() => import("./Pages/ProductDetailPage"));
const CartPage = lazy(() => import("./Pages/CartPage"));
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const RegisterPage = lazy(() => import("./Pages/RegisterPage"));
const WishlistPage = lazy(() => import("./Pages/WishlistPage"));
const CheckoutPage = lazy(() => import("./Pages/CheckoutPage"));
const OrdersPage = lazy(() => import("./Pages/OrdersPage"));
const OrderSuccessPage = lazy(() => import("./Pages/OrderSuccessPage"));
const ProfilePage = lazy(() => import("./Pages/ProfilePage"));
const ProtectedRoute = lazy(() => import("./Components/ProtectedRoute"));
const AdminPage = lazy(() => import("./Pages/AdminPage"));

const App = () => {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                pauseOnHover={false}
                closeOnClick={true}
            />
            <Suspense
                fallback={<LoadingSpinner message={LOADING_MESSAGES.PAGE} />}
            >
                <Routes>
                    <Route path="/" element={<BaseLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="products" element={<ProductListPage />} />
                        <Route
                            path="product/:id"
                            element={<ProductDetailPage />}
                        />
                        <Route path="cart" element={<CartPage />} />
                        <Route
                            path="checkout"
                            element={
                                <ProtectedRoute roles={["user", "admin"]}>
                                    <CheckoutPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="wishlist"
                            element={
                                <ProtectedRoute roles={["user", "admin"]}>
                                    <WishlistPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="profile"
                            element={
                                <ProtectedRoute roles={["user", "admin"]}>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />
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
                            element={
                                <ProtectedRoute roles={["user", "admin"]}>
                                    <OrderSuccessPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="admin-dashboard"
                            element={
                                <ProtectedRoute roles={["admin"]}>
                                    <AdminPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="messages"
                            element={
                                <ProtectedRoute roles={["user", "admin"]}>
                                    <div className="p-8 text-center text-gray-500">
                                        Messages Page Placeholder
                                    </div>
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default App;
