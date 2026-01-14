import { createBrowserRouter } from "react-router";
import App from "../App";
import Feed from "../components/Layout/Feed";
import ShopPage from "../pages/Shop.tsx";
import MyShopPage from "../pages/MyShop.tsx";


import ReelsPage from "../pages/Reels.tsx";
import LoginPage from "../pages/Login.tsx";
import SignupPage from "../pages/Signup.tsx";
import NotificationsPage from "../pages/Notifications.tsx";
import SettingsPage from "../pages/Settings.tsx";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        ),
      },
      {
        path: "reels",
        element: (
          <ProtectedRoute>
            <ReelsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "shop",
        element: <ShopPage />,
      },
      {
        path: "my-shop",
        element: (
          <ProtectedRoute>
            <MyShopPage />
          </ProtectedRoute>
        ),
      },
      
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      }
    ],
  },
]);