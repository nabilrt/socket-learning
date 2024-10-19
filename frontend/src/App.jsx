import { Route, Routes } from "react-router-dom";
import PrivateOutlet from "../components/PrivateOutlet";
import LoginPage from "../pages/LoginPage";
import Messenger from "../pages/Messenger";
import { AuthContextProvider } from "../libs/context/auth-context";
function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/*" element={<PrivateOutlet />}>
          <Route path="messenger" element={<Messenger />} />
        </Route>
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
