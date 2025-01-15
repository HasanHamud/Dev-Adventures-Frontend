import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/");
  };

  return <button onClick={handleLoginClick}>Login</button>;
};

export default LoginButton;
