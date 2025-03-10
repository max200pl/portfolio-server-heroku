function checkRole(requiredRole) {
    return (req, res, next) => {
        const user = req.user;

        console.log("=== Checking User Role ===");
        console.log("Required Role:", requiredRole);
        console.log("User Roles:", user ? user.roles : "No user roles found");

        if (!user || !user.roles) {
            console.error("User role not found");
            return res.status(403).json({ message: "User role not found" });
        }

        if (!user.roles.includes(requiredRole)) {
            console.error("User does not have the required role");
            return res.status(403).json({
                message:
                    "User does not have the required role to access this resource",
            });
        }

        console.log("User role is valid");
        next(); // Role is valid, proceed
    };
}

module.exports = checkRole;
