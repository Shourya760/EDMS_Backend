import authRoutes from "./auth.routes.js";
import employeeRoutes from "./employee.routes.js"
import departmentRoutes from "./department.routes.js"
import managerRoutes from "./manager.routes.js"
import documentsRoutes from "./documents.routes.js"

const registerRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api", employeeRoutes);
  app.use("/api", departmentRoutes);
  app.use("/api", managerRoutes);
  app.use("/api", documentsRoutes);
};

export default registerRoutes;