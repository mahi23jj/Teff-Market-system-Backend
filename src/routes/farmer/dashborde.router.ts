import { Router } from "express";
import { MarketController } from "../../controllers/farmer/dashbord.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

const farmerDashboardRouter = Router();
const controller = new MarketController();

// 👨‍🌾 Farmer Dashboard Overview
farmerDashboardRouter.get(
  "/farmer-overview",
  authenticate,
  authorize("farmer"),
  controller.farmerOverview.bind(controller)
);

// 📈 Market Intelligence Overview
farmerDashboardRouter.get(
  "/overview",
  authenticate,
  authorize("farmer"),
  controller.marketOverview.bind(controller)
);

// 📊 Market Activity
farmerDashboardRouter.get(
  "/activity",
  authenticate,
  authorize("farmer"),
  controller.activity.bind(controller)
);

// 📉 Market Trend
farmerDashboardRouter.get(
  "/trend",
  authenticate,
  authorize("farmer"),
  controller.trend.bind(controller)
);

// 🏥 Market Health
farmerDashboardRouter.get(
  "/health",
  authenticate,
  authorize("farmer"),
  controller.health.bind(controller)
);

export default farmerDashboardRouter;