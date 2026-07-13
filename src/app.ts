import express, { type Request, type Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
// import swaggerUi from 'swagger-ui-express';
import { config } from './config.js';
import authrouter from './routes/auth.routes.js';
import productlistrouter from './routes/farmer/productlist.routers.js';
import farmerorderrouter from './routes/farmer/order.router.js';
import customerorderrouter from './routes/customer/order.routers.js';
import customerproductrouter from './routes/customer/product.router.js';
import adminuserrouter from './routes/admin/users.routes.js';
import adminproductrouter from './routes/admin/product.routers.js';
import adminDashboardRouter from './routes/admin/dashborde.router.js';
import farmerDashboardRouter from './routes/farmer/dashborde.router.js';
import customerDashboardRouter from './routes/customer/dashbord.routers.js';
import { connectRedis } from './service/farmer/cache/redis.service.js';
import { Server } from 'socket.io';
import { initMarketSocket } from './service/farmer/socket/market.socket.js';













export const app = express();
export const server = createServer(app);





if (config.isdev) {
  app.use(cors({
    origin: (_origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) =>
      callback(null, true), // Allow all origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }));
} else {
  // production CORS settings
  //   app.use(cors({
  //   origin: ["https://teff-store.com"], // only your deployed frontend
  //   credentials: true,
  // }));Nn
  app.use(cors({
    origin: (_origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      callback(null, true); // allow all origins
    },
    credentials: true,
  }));
}


connectRedis();


const io =
  new Server(server, {
    cors: {
      origin: "*"
    }
  });


initMarketSocket(io);


app.use(helmet());
app.use(cookieParser());

// app.use(requestLogger);

app.use(express.json());

app.get('/health', (req: Request, res: Response) => res.json({ ok: true }));


app.use('/api/auth', authrouter);

app.use('/api/farmer/products', productlistrouter);

app.use('/api/farmer/orders', farmerorderrouter);

app.use('/api/customer/orders', customerorderrouter);

app.use('/api/customer/products', customerproductrouter);

app.use('/api/admin/users', adminuserrouter);

app.use('/api/admin/products', adminproductrouter);





app.use('/api/admin', adminDashboardRouter)

app.use('/api/farmer', farmerDashboardRouter)

app.use('/api/customer', customerDashboardRouter)
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// app.use('/auth', authRouter);
// app.use('/api/', userRouter);
// app.use('/api/', sellerRouter);
// app.use('/api/', categoryRouter);
// app.use('/api/', productRouter);
// app.use('/api/follow/', followRouter);
// app.use('/api/report/', reportRouter);
// app.use('/api/save_product/', saveProductRouter);
// app.use('/api/review/', reviewRouter);
// app.use('/api/shop/', shopRouter);
// app.use('/api/engagement/', enggagementRouter);
// app.use('/', botRouter);

// // app.use('/admin', adminRouter);


// app.use(errorHandler);



