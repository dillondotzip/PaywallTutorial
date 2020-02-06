require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET);
const axios = require('axios')
const {format} = require('date-fns')
const bcrypt = require('bcryptjs');
const client = require('../../client')
const groq = require('groq')


const validateHttpMethod = require('../utils/validateHttpMethod');
const sendEmail = require('../utils/sendEmail')


const makePassword = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.handler = async (event, context) => {
  try {
    await validateHttpMethod(event, ['POST', 'OPTIONS']);
    
    ///// HANDLES PREFLIGHT REQUEST FOR CORS ISSUE
    if(event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers:    {
          'Cache-Control': 'no-store', // prevent caching of response
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Credentials': 'true'
        },
        body: ''
      };
    }
    /////////////////

    const data = await JSON.parse(event.body)

    await stripe.customers.create({
      email: data.body.token.email
    }).then((customer) => {
      return stripe.customers.createSource(customer.id, {
        source: data.body.token.id
      })
    }).then((source) => {
      return stripe.charges.create({
        amount: data.body.package.price,
        currency: 'usd',
        customer: source.customer
      })
    }).then(async() => {
      const password = await makePassword(6)
  
      const hashedPassword = await bcrypt.hash(password, 10)
  
      await axios.post('https://o2xvgcb7.api.sanity.io/v1/data/mutate/production', {
        "mutations": [{
          "createIfNotExists": {
            "_id": data.body.token.email.replace(/[^\w\s]/gi, '') + 13371337,
            "_type": "user",
            "email": data.body.token.email,
            "password": hashedPassword
          }
        }]
      }, {
        headers: {
          "Authorization": `Bearer ${process.env.SANITY_TOKEN}`
        }
      })
  
      await axios.post('https://o2xvgcb7.api.sanity.io/v1/data/mutate/production', {
        "mutations": [{
          "create": {
            "_type": "purchase",
            "download": {
              "_ref": data.body.package._id,
              "_type": 'reference',
              "_weak": true
            },
            "user": {
              "_ref": data.body.token.email.replace(/[^\w\s]/gi, '') + 13371337,
              "_type": "reference"

            },
            "date": format(new Date(), "yyyy-MM-dd HH:mm")
          }
        }]
      }, {
        headers: {
          "Authorization": `Bearer ${process.env.SANITY_TOKEN}`
        }
      })

      const fileUrl = await client.fetch(groq`*[_type == "download" && _id == "${data.body.package._id}"]{
        features,
        price,
        title,
        "file": file.asset->url,
        _id
      }`)


      return sendEmail(data.body.token.email, fileUrl, password)

    }).catch((err) => {
      console.log(err)
    })

    return {
      statusCode: 201,
      body: '',
      headers:    {
        'Cache-Control': 'no-store', // prevent caching of response
        Pragma:          'no-cache', // prevent caching of response
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': '2592000',
        'Access-Control-Allow-Credentials': 'true'
      }
    };
  } catch (error) {

    return {
      statusCode: error.statusCode || 500,
      headers:    error.headers || {},
      body:       JSON.stringify(error.message),
    };
  }
};


