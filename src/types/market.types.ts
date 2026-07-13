export interface FarmerBusinessOverview {

 revenueToday:number;

 revenueMonth:number;

 completedOrders:number;

 pendingOrders:number;

 activeListings:number;

 quantitySold:number;

 averageSellingPrice:number;

}



export interface MarketOverview {


 averagePrice:number;

 highestPrice:number;

 lowestPrice:number;

 activeListings:number;

 ordersToday:number;

 farmersSelling:number;

 marketDirection:
 "RISING" |
 "FALLING" |
 "STABLE";

}


export interface MarketActivity {

  ordersToday:number;

  completedOrders:number;

  pendingOrders:number;

  cancelledOrders:number;

  productsSold:number;

  averageOrderSize:number;


  hourlyActivity:{
    hour:string;
    orders:number;
  }[];

}

export interface MarketTrendPoint {

timestamp:Date;

averagePrice:number;

}




export interface MarketTrendResponse {

  period:
  "today" |
  "week" |
  "month";


  points: MarketTrendPoint[];

}export interface MarketHealth {

 supply:
 "HIGH" |
 "MEDIUM" |
 "LOW";


 demand:
 "HIGH" |
 "MEDIUM" |
 "LOW";


 priceTrend:
 "RISING" |
 "STABLE" |
 "FALLING";


 marketActivity:
 "HIGH" |
 "MEDIUM" |
 "LOW";


 status:string;

 message:string;

}