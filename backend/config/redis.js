const Redis = require("ioredis");

// Khởi tạo client Redis
const redisClient = new Redis({
  host: "127.0.0.1", // Địa chỉ Redis server
  port: 6379,        // Cổng mặc định của Redis
  // Tùy chọn thêm (nếu có bảo mật)
  // password: "your-redis-password",
});

// Kiểm tra kết nối Redis
redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redisClient;