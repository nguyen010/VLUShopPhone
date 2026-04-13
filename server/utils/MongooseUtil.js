const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

const uri = 
    `mongodb://${MyConstants.DB_USER}:${MyConstants.DB_PASS}` + 
    `@${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}` + 
    `?ssl=true&replicaSet=atlas-10ob5x-shard-0&authSource=admin&appName=th1`;
console.log(uri);
mongoose.connect(uri)
  .then(() => {
    console.log('✅ CONNECTED DB:', MyConstants.DB_DATABASE);
  })
  .catch(err => {
    console.error('❌ DB ERROR', err.message);
  });

module.exports = mongoose;