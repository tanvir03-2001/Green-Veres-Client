import { createBrowserRouter } from "react-router";
import App from "../App";
import Feed from "../components/Layout/Feed";
import ShopPage from "../pages/Shop.tsx";
import GroupPage from "../pages/Group.tsx";
import LibraryPage from "../pages/Library.tsx";
import MyGardenPage from "../pages/MyGarden.tsx";
import ReelsPage from "../pages/Reels.tsx";
import LoginPage from "../pages/Login.tsx";
import SignupPage from "../pages/Signup.tsx";

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
        element: <Feed />,
      },
      {
        path: "reels",
        element: <ReelsPage />,
      },
      {
        path: "shop",
        element: <ShopPage />,
      },
      {
        path: "group",
        element: <GroupPage />,
      },
      {
        path: "library",
        element: <LibraryPage />,
      },
      {
        path: "my-garden",
        element: <MyGardenPage />,
      }
    ],
  },
]);