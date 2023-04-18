import "./style/App.css";
import "./style/statusStyle/status.css";
import Footer from "./components/Footer";
import Home from "./components/pages/Home";
import News from "./components/pages/News";
import Profile from "./components/pages/user/Profile";
import Markets from "./components/pages/Markets";
import CryptoCard from "./components/pages/CryptoDetail";
import Header from "./components/Header";
import React, {useEffect, useState} from "react";
import {Route, Routes, Navigate} from "react-router-dom";
import Exchanges from "./components/pages/Exchanges";
import Academia from "./components/pages/Academia";
import Quiz from "./components/pages/Quiz";
import AllCoinsWidget from "./components/utils/widgets/AllCoinsWidget";
import Portfolyo from "./components/pages/user/Portfolyo";
import Settings from "./components/pages/Settings";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import {useSelector} from "react-redux";
import InternetConnection from "./components/utils/InternetConnection";
import Page404 from "./components/utils/Page404";
import IpLogger from "./components/utils/IpLogger";
import AddBlogAcademy from "./components/pages/Academy/AddBlogAcademy";
import Blog from "./components/pages/Academy/Blog";
import Auth2FASetup from "./components/utils/Auth2FA/Auth2FASetup";
import Auth2FAChecker from "./components/utils/Auth2FA/Auth2FAChecker";
import CreateQuestion from "./components/pages/Quiz/CreateQuestion";
import QuizQuestions from "./components/pages/Quiz/QuizQuestions";
import Admin from "./components/pages/Admin/Admin";
import AddAdmin from "./components/pages/Admin/AddAdmin";
import EditBlogAcademy from "./components/pages/Academy/EditBlogAcademy";
import EditQuestion from "./components/pages/Quiz/EditQuestion";
function App() {
  const {admins} = useSelector((state) => state.admins);
  const {user} = useSelector((state) => state.auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const admin = admins.find((admin) => admin.id === user.uid);
      setIsAdmin(admin);
    }
  }, [user, admins]);

  const PrivateRoute = ({children}) => {
    return !user ? <Navigate to="/" /> : children;
  };

  const AdminRoute = ({children}) => {
    return isAdmin ? children : <Navigate to="/" />;
  };

  return (
    <div className="App ">
      <ToastContainer
        className="mt-10"
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
      />
      <InternetConnection />
      <IpLogger />
      <AllCoinsWidget />
      <Header />
      <Routes>
        <Route end path="/" element={<Home />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/markets/:id" element={<CryptoCard />} />
        <Route path="/news" element={<News />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/academia" element={<Academia />} />
        <Route path="/academia/:id" element={<Blog />} />
        <Route path="/exchanges" element={<Exchanges />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route
          path="/portfolyo"
          element={
            <PrivateRoute>
              <Portfolyo />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/auth-checker"
          element={
            <PrivateRoute>
              <Auth2FAChecker />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/auth2fa"
          element={
            <PrivateRoute>
              <Auth2FASetup />
            </PrivateRoute>
          }
        />{" "}
        <Route
          path="/quiz/question"
          element={
            <PrivateRoute>
              <QuizQuestions />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-admin"
          element={
            <AdminRoute>
              <AddAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-question"
          element={
            <AdminRoute>
              <CreateQuestion />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-question/:id"
          element={
            <AdminRoute>
              <EditQuestion />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-blog"
          element={
            <AdminRoute>
              <AddBlogAcademy />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-blog/:id"
          element={
            <AdminRoute>
              <EditBlogAcademy />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Page404 to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
