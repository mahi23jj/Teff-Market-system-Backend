import {
  Server,
  Socket
} from "socket.io";


let io: Server;



export const initMarketSocket = (
  server: Server
) => {

  io = server;


  io.on(
    "connection",
    (socket: Socket) => {


      console.log(
        "Market socket connected:",
        socket.id
      );



      /*
        Farmer/Admin joins
        a specific product market room
      */

      socket.on(
        "join-market",
        (
          {
            productTypeId
          }
        ) => {


          if(!productTypeId){
            return;
          }


          socket.join(
            `market:${productTypeId}`
          );


          console.log(
            `Socket ${socket.id} joined market:${productTypeId}`
          );


        }
      );





      socket.on(
        "leave-market",
        (
          {
            productTypeId
          }
        )=>{


          socket.leave(
            `market:${productTypeId}`
          );


        }
      );



    }
  );

};






export const broadcastMarketUpdate = (
  productTypeId:string,
  data:any
)=>{


  if(!io){
    return;
  }



  io.to(
    `market:${productTypeId}`
  )
  .emit(
    "market:update",
    {
      productTypeId,
      ...data
    }
  );


};