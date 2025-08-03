const mongoose = require("mongoose");

async function handleDBConnection(url) {
  return await mongoose.connect(url);
}

module.exports = { handleDBConnection };
