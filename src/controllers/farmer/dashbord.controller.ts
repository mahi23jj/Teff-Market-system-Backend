import { Request, Response } from "express";
import { MarketIntelligenceService } from "../../service/farmer/dashboard.service.js";
import { marketTrendSchema, marketQuerySchema } from "../../validation/farmer/dashboard.validation.js";

export class MarketController {
  async farmerOverview(req: Request, res: Response) {
    const farmerId = req.user!.userId;
    const data = await MarketIntelligenceService.getFarmerOverview(farmerId);
    return res.json(data);
  }

  async marketOverview(req: Request, res: Response) {
    const { productTypeId } = marketQuerySchema.parse(req.query);
    const data = await MarketIntelligenceService.getMarketOverview(productTypeId);
    return res.json(data);
  }

  async activity(req: Request, res: Response) {
    const { productTypeId } = marketQuerySchema.parse(req.query);
    const data = await MarketIntelligenceService.getMarketActivity(productTypeId);
    return res.json(data);
  }

  async trend(req: Request, res: Response) {
    const { productTypeId } = marketTrendSchema.parse(req.query);
    const data = await MarketIntelligenceService.getMarketTrend(productTypeId );
    return res.json(data);
  }

  async health(req: Request, res: Response) {
    const { productTypeId } = marketQuerySchema.parse(req.query);
    const data = await MarketIntelligenceService.getMarketHealth(productTypeId);
    return res.json(data);
  }
}