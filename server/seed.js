require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/product");

const data = [
  { nameTa: "தக்காளி", nameEn: "Tomato", image: "🍅" },
  { nameTa: "வெங்காயம்", nameEn: "Onion", image: "🧅" },
  { nameTa: "பால்", nameEn: "Milk", image: "🥛" },
  { nameTa: "அரிசி", nameEn: "Rice", image: "🍚" },
  { nameTa: "முட்டை", nameEn: "Eggs", image: "🥚" },
  { nameTa: "உருளைக்கிழங்கு", nameEn: "Potato", image: "🥔" },
  { nameTa: "கேரட்", nameEn: "Carrot", image: "🥕" },
  { nameTa: "வாழைப்பழம்", nameEn: "Banana", image: "🍌" },
  { nameTa: "மிளகாய்", nameEn: "Chilli", image: "🌶️" },
  { nameTa: "எலுமிச்சை", nameEn: "Lemon", image: "🍋" },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI); // use your own connection string
  await Product.insertMany(data);
  console.log("Seeded");
  process.exit();
})();