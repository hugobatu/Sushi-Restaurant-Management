import LoginForm from "../../components/LoginForm/LoginForm";
import { SiteHeader } from "@/components/HomePage/site-header";
const LoginPage = () => {
    return (
        <div>
            <SiteHeader/>
            <LoginForm />
        </div>
    );
};

export default LoginPage;
