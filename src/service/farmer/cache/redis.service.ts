import { createClient } from "redis";


const redisClient = createClient({
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
});


redisClient.on(
  "error",
  (error)=>{
    console.error(
      "Redis Error:",
      error
    );
  }
);



export const connectRedis = async()=>{

  if(!redisClient.isOpen){
    await redisClient.connect();
  }

};



export const redis = redisClient;



export const cacheGet = async <T>(
  key:string
):Promise<T|null>=>{

  const data =
    await redis.get(key);


  if(!data){
    return null;
  }


  return JSON.parse(data);

};



export const cacheSet = async(
  key:string,
  value:any,
  ttl:number=300
)=>{

 await redis.set(
  key,
  JSON.stringify(value),
  {
    EX:ttl
  }
 );

};



export const cacheDelete = async(
 key:string
)=>{

 await redis.del(key);

};