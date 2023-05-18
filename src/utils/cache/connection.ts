// import redis from 'redis'

// let redisClient
// (async () => {
//     redisClient = redis.createClient();
  
//     redisClient.on("error", (error) => console.error(`Error : ${error}`));
  
//     await redisClient.connect();
//   })();

const redisClient = async (redis: any) => {
    let redisClient = redis.createClient();
  
    redisClient.on("error", (error:any) => console.error(`Error : ${error}`));
  
    await redisClient.connect();
    
    return redisClient
}
export default redisClient

