const express = require("express");
const app = express();
const PORT = 5001;
require("dotenv").config();
const { handleDBConnection } = require("./connection");
const authRoute = require("./routes/auth");
const cors = require("cors");
const addRoute = require("./routes/addItem");
const { protect, restrictTo } = require("./middlewares/auth");
const { getAllProducts } = require("./controllers/searchProduct.js");
const cartRoute = require("./routes/cartRoute");
const becomeSellerRoute = require("./routes/becomeSeller");
const adminRoute = require("./routes/adminRoute.js");
const userRoute = require("./routes/userRoute");
const checkOutRoute = require("./routes/checkout.js");
const analyticsRoute = require("./routes/analytics");

handleDBConnection("mongodb://127.0.0.1:27017/E_Commerce")
  .then(() => console.log("Mongo Connected !!"))
  .catch((err) => {
    console.log(`Error encountered : ${err}`);
  });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/", authRoute);
app.use("/becomeSeller", becomeSellerRoute);
app.get("/search_item", getAllProducts);
app.use("/cart", cartRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/api", addRoute);
app.use("/analyze", analyticsRoute);

app.use("/checkout", checkOutRoute);
app.listen(PORT, () => {
  console.log(`Server Started at Port : ${PORT}`);
});
