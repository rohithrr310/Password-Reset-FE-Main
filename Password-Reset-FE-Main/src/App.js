import ForgotPage from "./components/ForgotPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AccountCreated from "./components/AccountCreated";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "./api/api";
import CheckEmail from "./components/CheckEmail";
import PasswordReset from "./components/PasswordReset";
import Password from "./components/Password";

function App() {
  let [email, setEmail] = useState("");
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [cPassword, setcPassword] = useState("");
  let [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    // not created because task is for reseting password
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      username,
      password,
    };
    let DBdata = await api.get("/users");
    DBdata = DBdata.data;
    DBdata = DBdata.find((item) => item.email === userData.email);
    if (!DBdata) {
      if (password === cPassword) {
        try {
          await api.post("/users/signup", userData);
        } catch (error) {
          console.error(error);
        }
        setEmail("");
        setUsername("");
        setPassword("");
        setcPassword("");
        navigate("/created");
      } else {
        alert("password mismatch");
      }
    } else {
      alert("email already Exist");
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    const forgotEmail = email.trim();
    let DBdata = await api.get("/users");
    DBdata = DBdata.data;
    DBdata = DBdata.find((item) => item.email.toString() === forgotEmail);
    if (DBdata) {
      api.put("/users/forgot", { email: forgotEmail });
      setEmail("");
      navigate("/mail");
    } else {
      alert("Email Id not registered");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (password === cPassword) {
      api.patch(`/users/reset/${resetToken}`, { password: password });
      setPassword("");
      setcPassword("");
      navigate("/password");
    } else {
      alert("password not matching");
    }
    console.log(resetToken);
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<SignIn handleSignIn={handleSignIn} />} />
        <Route
          path="/signup"
          element={
            <SignUp
              handleSignUp={handleSignUp}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              username={username}
              setUsername={setUsername}
              cPassword={cPassword}
              setcPassword={setcPassword}
            />
          }
        />
        <Route
          path="/forgot"
          element={
            <ForgotPage
              handleForgot={handleForgot}
              email={email}
              setEmail={setEmail}
            />
          }
        />
        <Route path="/created" element={<AccountCreated />} />
        <Route path="/mail" element={<CheckEmail />} />
        <Route path="/password" element={<Password />} />
        <Route
          path="users/reset/:id"
          element={
            <PasswordReset
              password={password}
              setPassword={setPassword}
              cPassword={cPassword}
              setcPassword={setcPassword}
              handleReset={handleReset}
              setResetToken={setResetToken}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
