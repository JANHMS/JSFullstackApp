const mongodb = require('mongodb')

const connectionString = 'mongodb+srv://Schultz:ZXCVBnm@cluster0-nvma5.mongodb.net/JSAPP?retryWrites=true&w=majority'

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  module.exports = client.db()
  const app = require('./app')
  app.listen(3002)
})
