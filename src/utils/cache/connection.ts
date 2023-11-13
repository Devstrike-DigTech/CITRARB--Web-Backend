// import redis from 'redis'

// let redisClient
// (async () => {
//     redisClient = redis.createClient();
  
//     redisClient.on("error", (error) => console.error(`Error : ${error}`));
  
//     await redisClient.connect();
//   })();

const redisClient = async (redis: any) => {
    //local
    // let redisClient = redis.createClient();

    //onrender
    let redisClient = redis.createClient({url: process.env.REDIS_URL_ONRENDER});
  
    redisClient.on("error", (error:any) => console.error(`Error : ${error}`));
  
    await redisClient.connect();
    
    return redisClient
}
export default redisClient

