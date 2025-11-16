const mongoose = require('mongoose');
const { loadEnvFile } = require('node:process');
loadEnvFile();

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB database');
  })
  .catch(error => {
    console.log(`Error to connecting: ${error.message}`);
  });

const personSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    minLength: 2,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'Person\'s phone number required']
  },
  "react-key": Number,
}, {collection: 'persons'});
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject._id
  }
});

module.exports = mongoose.model('Person', personSchema);