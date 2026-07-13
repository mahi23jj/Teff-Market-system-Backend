import {
  prisma
} from "../../lib/prisma";


import {
  OrderStatus,
  ListingStatus
} from "@prisma/client";


import {
  cacheGet,
  cacheSet
} from "./cache/redis.service";


import {
  FarmerBusinessOverview,
  MarketActivity,
  MarketHealth,
  MarketOverview,
  MarketTrendResponse
} from "../../types/market.types";
import { broadcastMarketUpdate } from "./socket/market.socket";





export class MarketIntelligenceService {



  static async getFarmerOverview(
    farmerId: string
  ): Promise<FarmerBusinessOverview> {


    // const cacheKey =
    //   `farmer:${farmerId}:overview`;



    // const cached =
    //   await cacheGet<FarmerBusinessOverview>(
    //     cacheKey
    //   );


    // if (cached) {

    //   return cached;

    // }



    const today =
      new Date();


    today.setHours(
      0,
      0,
      0,
      0
    );



    const month =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );



    const [
      revenueToday,
      revenueMonth,
      completedOrders,
      pendingOrders,
      activeListings,
      quantitySold
    ] = await Promise.all([



      prisma.order.aggregate({

        where: {
          farmerId,

          status:
            OrderStatus.completed,

          createdAt: {
            gte: today
          }

        },

        _sum: {
          totalPrice: true
        }

      }),




      prisma.order.aggregate({

        where: {
          farmerId,

          status:
            OrderStatus.completed,

          createdAt: {
            gte: month
          }

        },

        _sum: {
          totalPrice: true
        }

      }),




      prisma.order.count({

        where: {
          farmerId,

          status:
            OrderStatus.completed

        }

      }),



      prisma.order.count({

        where: {
          farmerId,

          status:
            OrderStatus.pending

        }

      }),



      prisma.listing.count({

        where: {
          farmerId,

          status:
            ListingStatus.active

        }

      }),




      prisma.order.aggregate({

        where: {
          farmerId,

          status:
            OrderStatus.completed

        },

        _sum: {
          quantity: true
        }

      })

    ]);




    const averagePrice =
      quantitySold._sum.quantity
        ?
        Number(
          revenueMonth._sum.totalPrice
          ??
          0
        )
        /
        Number(
          quantitySold._sum.quantity
        )
        :
        0;




    const result = {

      revenueToday:
        Number(
          revenueToday._sum.totalPrice ?? 0
        ),


      revenueMonth:
        Number(
          revenueMonth._sum.totalPrice ?? 0
        ),


      completedOrders,


      pendingOrders,


      activeListings,


      quantitySold:
        Number(
          quantitySold._sum.quantity ?? 0
        ),


      averageSellingPrice:
        Number(
          averagePrice.toFixed(2)
        )

    };



    // await cacheSet(
    //     cacheKey,
    //     result,
    //     300
    //   );



    return result;



  }









  static async getMarketOverview(
    productTypeId: string,
  )
    : Promise<MarketOverview> {


    // const cacheKey =
    //   "market:overview";



    // const cached =
    //   await cacheGet<MarketOverview>(
    //     cacheKey
    //   );


    // if (cached) {

    //   return cached;

    // }




    const today =
      new Date();


    today.setHours(
      0,
      0,
      0,
      0
    );




    const [
      priceStats,
      activeListings,
      ordersToday,
      farmers
    ] = await Promise.all([




      prisma.listing.aggregate({

        where: {
          productTypeId,
          status:
            ListingStatus.active
        },

        _avg: {
          pricePerKg: true
        },

        _min: {
          pricePerKg: true
        },

        _max: {
          pricePerKg: true
        }

      }),




      prisma.listing.count({

        where: {
          productTypeId,
          status:
            ListingStatus.active
        }

      }),





      prisma.order.count({

        where: {
          listing: {
            productTypeId,
          },
          createdAt: {
            gte: today
          }

        }

      }),





      prisma.listing.findMany({

        where: {
          productTypeId,
          status:
            ListingStatus.active
        },

        distinct: [
          "farmerId"
        ],

        select: {
          farmerId: true
        }

      })

    ]);





    const result = {


      averagePrice:
        Number(
          priceStats._avg.pricePerKg ?? 0
        ),


      highestPrice:
        Number(
          priceStats._max.pricePerKg ?? 0
        ),


      lowestPrice:
        Number(
          priceStats._min.pricePerKg ?? 0
        ),


      activeListings,


      ordersToday,


      farmersSelling:
        farmers.length,


      marketDirection:
        "STABLE" as const


    };



    // await cacheSet(
    //   cacheKey,
    //   result,
    //   300
    // );



    return result;



  }


  static async getMarketActivity(
    productTypeId: string,
  )
    : Promise<MarketActivity> {


    // const cacheKey =
    //   "market:activity";


    // const cached =
    //   await cacheGet<MarketActivity>(
    //     cacheKey
    //   );


    // if (cached) {

    //   return cached;

    // }



    const today =
      new Date();


    today.setHours(
      0,
      0,
      0,
      0
    );



    const orders =
      await prisma.order.findMany({

        where: {
          listing: {
            productTypeId
          },

          createdAt: {
            gte: today
          }

        },

        select: {

          status: true,

          quantity: true,

          createdAt: true

        }

      });





    let completedOrders = 0;
    let pendingOrders = 0;
    let cancelledOrders = 0;

    let productsSold = 0;



    const hourlyMap:
      Record<string, number>
      = {};



    orders.forEach(order => {


      if (
        order.status === OrderStatus.completed
      ) {

        completedOrders++;

        productsSold +=
          Number(order.quantity);

      }



      if (
        order.status === OrderStatus.pending
      ) {

        pendingOrders++;

      }



      if (
        order.status === OrderStatus.cancelled
      ) {

        cancelledOrders++;

      }




      const hour =
        order.createdAt
          .getHours()
          .toString()
          .padStart(2, "0")
        +
        ":00";



      hourlyMap[hour] =
        (hourlyMap[hour] || 0) + 1;



    });





    const averageOrderSize =
      completedOrders > 0
        ?
        productsSold / completedOrders
        :
        0;



    const result = {


      ordersToday:
        orders.length,


      completedOrders,


      pendingOrders,


      cancelledOrders,


      productsSold,


      averageOrderSize:
        Number(
          averageOrderSize.toFixed(2)
        ),



      hourlyActivity:
        Object.entries(hourlyMap)
          .map(
            ([hour, orders]) => ({
              hour,
              orders
            })
          )

    };



    // await cacheSet(
    //   cacheKey,
    //   result,
    //   120
    // );



    return result;


  }

  static async getMarketHealth(
    productTypeId: string,
  )
    : Promise<MarketHealth> {


    // const cacheKey =
    //   "market:health";


    // const cached =
    //   await cacheGet<MarketHealth>(
    //     cacheKey
    //   );


    // if (cached) {

    //   return cached;

    // }



    const today =
      new Date();


    today.setHours(
      0,
      0,
      0,
      0
    );



    const [
      activeListings,
      todayOrders,
      completedOrders,
      quantitySold,
      price
    ] = await Promise.all([



      prisma.listing.count({

        where: {
          productTypeId,
          status:
            ListingStatus.active
        }

      }),



      prisma.order.count({

        where: {
          listing: {
            productTypeId,
          },
          createdAt: {
            gte: today
          }

        }

      }),



      prisma.order.count({

        where: {
          listing: {
            productTypeId
          },

          status:
            OrderStatus.completed,

          createdAt: {
            gte: today
          }

        }

      }),




      prisma.order.aggregate({

        where: {
          listing: {
            productTypeId
          },
          status:
            OrderStatus.completed
        },

        _sum: {
          quantity: true
        }

      }),




      prisma.listing.aggregate({

        where: {
          productTypeId,
          status:
            ListingStatus.active
        },

        _avg: {
          pricePerKg: true
        }

      })

    ]);





    let supply:
      "HIGH" | "MEDIUM" | "LOW";


    if (activeListings > 100)
      supply = "HIGH";

    else if (activeListings > 30)
      supply = "MEDIUM";

    else
      supply = "LOW";





    let demand:
      "HIGH" | "MEDIUM" | "LOW";


    if (todayOrders > 50)
      demand = "HIGH";

    else if (todayOrders > 15)
      demand = "MEDIUM";

    else
      demand = "LOW";





    let activity:
      "HIGH" | "MEDIUM" | "LOW";


    if (todayOrders > 50)
      activity = "HIGH";

    else if (todayOrders > 15)
      activity = "MEDIUM";

    else
      activity = "LOW";





    // temporary until historical snapshots exist

    const priceTrend =
      "STABLE";




    let status =
      "Balanced Market";


    let message =
      "Supply and demand are currently balanced.";



    if (
      demand === "HIGH"
      &&
      supply === "MEDIUM"
    ) {

      status =
        "Healthy Market";


      message =
        "Demand is strong compared with available supply.";

    }



    if (
      supply === "HIGH"
      &&
      demand === "LOW"
    ) {

      status =
        "Slow Market";


      message =
        "Supply is higher than demand. Consider adjusting prices.";

    }





    const result = {

      supply,

      demand,

      priceTrend,

      marketActivity: activity,

      status,

      message

    };



    // await cacheSet(
    //   cacheKey,
    //   result,
    //   300
    // );



    return {
      supply,
      demand,
      priceTrend,
      marketActivity: activity,
      status,
      message
    };


  }

  static async getMarketTrend(
    productTypeId: string
  ) {

    const stats = await prisma.listing.aggregate({
      where: {
        productTypeId,
        status: ListingStatus.active,
      },

      _avg: {
        pricePerKg: true,
      },
    });

    return {
      points: [
        {
          timestamp: new Date(),
          averagePrice: Number(stats._avg.pricePerKg ?? 0),
        },
      ],
    };
  }


  static async broadcastLatestMarketPrice(
    productTypeId: string
  ) {


    const stats =
      await prisma.listing.aggregate({

        where: {
          productTypeId,

          status:
            ListingStatus.active
        },

        _avg: {
          pricePerKg: true
        }

      });



    broadcastMarketUpdate(

      productTypeId,

      {
        timestamp: new Date(),

        averagePrice:
          Number(
            stats._avg.pricePerKg ?? 0
          )

      }

    );


  }

}