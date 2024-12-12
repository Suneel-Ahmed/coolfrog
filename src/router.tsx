import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/partials/Layout";
import Home from "./pages/Home";
// import Leaderboard from "./pages/Leaderboard";
import Earn from "./pages/Earn";
import Friends from "./pages/Friends";
import Missions from "./pages/Missions";
import Payout from "./pages/Payout";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,

    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "referrals",
        element: <Friends />,
      },
      {
        path: "earn",
        element: <Earn />,
      },
      {
        path: "Offical",
        element: <Missions />,
      },
      {
        path: "payout",
        element: <Payout />,
      },
    ],
  },
]);

export default router;
