import { BrowserRouter, Routes, Route } from "react-router-dom";

import RolSelector from "./components/FirtSteps/IndexRegister";
import RegisterUser from "./components/FirtSteps/RegisterUser";
import Login from "./components/FirtSteps/Login";
import IntroText from "./components/IntroText/IntroText";
import PrivateRoute from "./components/FirtSteps/PrivateRoute";
import IndexButton from "./components/Index/IndexButton";
import VerifyEmail from "./components/FirtSteps/verifyEmail";
import CheckEmail from "./components/FirtSteps/CheckEmail"; 
import ForgotPassword from "./components/FirtSteps/ForgotPassword";
import ResetPassword from "./components/FirtSteps/ResetPassword";
import Store from "./pages/Store/Store"
import Orders from "./pages/Orders/Orders"
import AdminDashboard from "./pages/Dashboard/AdminDashboard"

function Placeholder({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
      {title}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Públicas */}
        <Route path="/" element={<RolSelector />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/login" element={<Login />} />

        {/* Privadas */}
        <Route
          path="/introtext"
          element={
            <PrivateRoute>
              <IntroText />
            </PrivateRoute>
          }
        />

        <Route
          path="/indexbutton"
          element={
            <PrivateRoute>
              <IndexButton />
            </PrivateRoute>
          }
        />

        {/* Nuevas rutas */}
        <Route
          path="/elloc/new"
          element={
            <PrivateRoute>
              <Placeholder title="Create New Transaction" />
            </PrivateRoute>
          }
        />

        <Route
          path="/elloc/list"
          element={
            <PrivateRoute>
              <Placeholder title="My Transactions" />
            </PrivateRoute>
          }
        />

        <Route
          path="/claims"
          element={
            <PrivateRoute>
              <Placeholder title="Claims / Contacts" />
            </PrivateRoute>
          }
        />
        <Route path = "/verify-email/:token" element = {<VerifyEmail />}/>

        <Route path="/check-email" element={<CheckEmail/>} />

        <Route path="/forgot-password" element={<ForgotPassword />}/>

        <Route path="/Reset-password/:token" element={<ResetPassword/>} />

        <Route
          path="/store"
          element = {
            <PrivateRoute>
              <Store/>
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element = {
            <PrivateRoute>
              <Orders/>
            </PrivateRoute>
          }
        />

        <Route
        path="/store"
        element = {
          <PrivateRoute>
            <AdminDashboard/>
          </PrivateRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;