import AuthLayout from "../../components/auth/AuthLayout";
import Branding from "../../components/auth/Branding";
import LoginCard from "../../components/auth/LoginCard";

export default function Login() {
  return (
    <AuthLayout
      left={<Branding />}
      right={<LoginCard />}
    />
  );
}