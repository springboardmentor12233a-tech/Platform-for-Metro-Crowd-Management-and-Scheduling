import api from "./api";


// ============================================================
// ADMIN LOGIN
// ============================================================

export const adminLogin = async (
    username,
    password
) => {

    const formData = new URLSearchParams();

    formData.append(
        "username",
        username
    );

    formData.append(
        "password",
        password
    );

    const response = await api.post(
        "/auth/admin/login",
        formData,
        {
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },
        }
    );

    return response.data;
};


// ============================================================
// GOOGLE USER LOGIN
// ============================================================

export const googleLogin = async (
    credential
) => {

    if (!credential) {
        throw new Error(
            "Google credential is missing."
        );
    }

    const response = await api.post(
        "/auth/google",
        {
            credential,
        }
    );

    return response.data;
};


// ============================================================
// CURRENT USER
// ============================================================

export const getCurrentUser = async () => {

    const response = await api.get(
        "/auth/me"
    );

    return response.data;
};


// ============================================================
// SAVE AUTHENTICATION
// ============================================================
//
// Everything is stored in sessionStorage.
//
// Therefore:
//
// Refresh page       → remains logged in
// Close browser      → session disappears
// Open again         → login page
//
// ============================================================

export const saveAuth = (data) => {

    // --------------------------------------------------------
    // ACCESS TOKEN
    // --------------------------------------------------------

    if (data.access_token) {

        sessionStorage.setItem(
            "metro_access_token",
            data.access_token
        );
    }


    // --------------------------------------------------------
    // REFRESH TOKEN
    // --------------------------------------------------------

    if (data.refresh_token) {

        sessionStorage.setItem(
            "metro_refresh_token",
            data.refresh_token
        );
    }


    // --------------------------------------------------------
    // ROLE
    // --------------------------------------------------------

    if (data.role) {

        sessionStorage.setItem(
            "metro_role",
            data.role
        );
    }


    // --------------------------------------------------------
    // USER ID
    // --------------------------------------------------------

    if (data.user_id) {

        sessionStorage.setItem(
            "metro_user_id",
            data.user_id
        );
    }


    // --------------------------------------------------------
    // USER OBJECT
    // --------------------------------------------------------

    if (data.user) {

        sessionStorage.setItem(
            "metro_user",
            JSON.stringify(data.user)
        );
    }


    // --------------------------------------------------------
    // USER EMAIL
    // --------------------------------------------------------

    if (data.email) {

        sessionStorage.setItem(
            "metro_user_email",
            data.email
        );
    }


    // --------------------------------------------------------
    // USER NAME
    // --------------------------------------------------------

    if (data.full_name) {

        sessionStorage.setItem(
            "metro_user_name",
            data.full_name
        );
    }


    // --------------------------------------------------------
    // AUTH PROVIDER
    // --------------------------------------------------------

    if (data.auth_provider) {

        sessionStorage.setItem(
            "metro_auth_provider",
            data.auth_provider
        );
    }
};


// ============================================================
// GET STORED ACCESS TOKEN
// ============================================================

export const getAccessToken = () => {

    return sessionStorage.getItem(
        "metro_access_token"
    );
};


// ============================================================
// GET STORED REFRESH TOKEN
// ============================================================

export const getRefreshToken = () => {

    return sessionStorage.getItem(
        "metro_refresh_token"
    );
};


// ============================================================
// GET STORED ROLE
// ============================================================

export const getRole = () => {

    return sessionStorage.getItem(
        "metro_role"
    );
};


// ============================================================
// GET STORED USER ID
// ============================================================

export const getUserId = () => {

    return sessionStorage.getItem(
        "metro_user_id"
    );
};


// ============================================================
// GET STORED USER
// ============================================================

export const getStoredUser = () => {

    const user =
        sessionStorage.getItem(
            "metro_user"
        );

    if (!user) {
        return null;
    }

    try {

        return JSON.parse(user);

    } catch {

        return null;
    }
};


// ============================================================
// CHECK AUTHENTICATION
// ============================================================

export const isAuthenticated = () => {

    return Boolean(
        sessionStorage.getItem(
            "metro_access_token"
        )
    );
};


// ============================================================
// CHECK ADMIN
// ============================================================

export const isAdmin = () => {

    return (
        sessionStorage.getItem(
            "metro_role"
        ) === "admin"
    );
};


// ============================================================
// CHECK NORMAL USER
// ============================================================

export const isUser = () => {

    return (
        sessionStorage.getItem(
            "metro_role"
        ) === "user"
    );
};


// ============================================================
// LOGOUT
// ============================================================

export const logout = () => {

    sessionStorage.removeItem(
        "metro_access_token"
    );

    sessionStorage.removeItem(
        "metro_refresh_token"
    );

    sessionStorage.removeItem(
        "metro_role"
    );

    sessionStorage.removeItem(
        "metro_user_id"
    );

    sessionStorage.removeItem(
        "metro_user"
    );

    sessionStorage.removeItem(
        "metro_user_email"
    );

    sessionStorage.removeItem(
        "metro_user_name"
    );

    sessionStorage.removeItem(
        "metro_auth_provider"
    );
};


// ============================================================
// EXPORT
// ============================================================

export default {

    // Login
    adminLogin,
    googleLogin,

    // Current user
    getCurrentUser,

    // Authentication storage
    saveAuth,
    getAccessToken,
    getRefreshToken,
    getStoredUser,

    // User information
    getRole,
    getUserId,

    // Authentication checks
    isAuthenticated,
    isAdmin,
    isUser,

    // Logout
    logout,
};