import { useState } from "react";
import { loginFields } from "../constants/formFields";
import FormAction from "./FormAction";
import FormExtra from "./FormExtra";
import Input from "./Input";
import axios from "axios"; // Import Axios library
import { useNavigate } from "react-router-dom";

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  };

  // Handle Login API Integration here
  const authenticateUser = () => {
    const { email, password } = loginState;

    axios
      .post("http://127.0.0.1:8000/api/login/", {
        email: email,
        password: password,
      })
      .then((response) => {
        // Save the token to local storage
        localStorage.setItem("username",response.data.username);
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        console.log("Login successful:", response.data);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        {" "}
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={loginState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}{" "}
      </div>

      <FormExtra />
      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  );
}
