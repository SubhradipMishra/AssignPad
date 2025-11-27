import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Context from "./utils/Context";
import Login from "./components/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminDepartments from "./components/admin/AdminDepartments";
import AdminAddUser from "./components/admin/AdminAddUser";
import StudentDashboard from "./components/student/StudentdDashboard";
import StudentAssignment from "./components/student/StudentAssignment";
import StudentAssignmentDetails from "./components/student/StudentAssignmentDetails";
import StudentSettings from "./components/student/StudentSettings";


function App() {
  const [sessionLoading, setSessionLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    getSession();
  }, []);

  const getSession = async () => {
    try {
      setSessionLoading(true);
      const { data } = await axios.get("http://localhost:4040/auth/session", {
        withCredentials: true,
      });
      setSession(data);
    } catch (err) {
      setSession(null);
    } finally {
      setSessionLoading(false);
    }
  };

  return (
    <Context.Provider value={{ session, setSession, sessionLoading, setSessionLoading }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />
           <Route path="/admin/users" element={<AdminAddUser />} />



           <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/assignments" element={<StudentAssignment />} />
            <Route path="/student/assignments/:id" element ={<StudentAssignmentDetails />} />
            <Route path="/student/settings" element={<StudentSettings />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
