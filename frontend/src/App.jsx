import { Route, Routes } from "react-router-dom";
import PrivateOutlet from "../components/PrivateOutlet";
import LoginPage from "../pages/LoginPage";
import Messenger from "../pages/Messenger";
import { AuthContextProvider } from "../libs/context/auth-context";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgetPassword";
function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/messenger/*" element={<PrivateOutlet />}>
          <Route path="chat" element={<Messenger />} />
        </Route>
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
