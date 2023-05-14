import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router, Route,
  Routes
} from "react-router-dom";
import {
  Login,
  Register
} from "./Components/Pages/Auth";
import Navbar from "./Components/Pages/Header/Navbar";
import Home from "./Components/Pages/Home";
import {
  Bookings, Users
} from "./Components/Pages/ListData";
import AuthProvider from "./ContextApi";
import RequireAuth from "./ContextApi/requireAuth.js";




const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Toaster />
        <Routes>
          <Route exact path="/signin" element={<Login />} />
          <Route exact path="/signup" element={<Register />} />
          <Route exact path="/" element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          } />
          <Route exact path="/all-users" element={
            <RequireAuth>
              <Users />
            </RequireAuth>
          } />
          <Route exact path="/my-bookings" element={
            <RequireAuth>
              <Bookings />
            </RequireAuth>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
