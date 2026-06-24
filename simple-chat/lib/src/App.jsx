import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Conversation from "./pages/Conversation";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import { getStoredUser } from "./api";

function ProtectedRoute({ children }) {
  return getStoredUser() ? children : <Navigate replace to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/conversation/:conversationId"
        element={
          <ProtectedRoute>
            <Conversation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
