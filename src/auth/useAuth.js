import { useAuthContext } from "./AuthContext";
import useApi from "../hooks/useApi";

const useAuth = () => {
    const { user, login, logout } = useAuthContext();
    const { request } = useApi();

    const signIn = async (email, password) => {
        const users = await request(`/users?email=${email}`);

        if (!users.length) {
            throw new Error("Invalid email or password");
        }

        const foundUser = users[0];

        if (foundUser.password !== password) {
            throw new Error("Invalid email or password");
        }

        const { password: _pw, ...safeUser } = foundUser;

        login(safeUser);
        return safeUser;
    };

    const signOut = () => logout();

    return {
        user,
        signIn,
        signOut,
        isAuthenticated: !!user,
    };
};

export default useAuth;
