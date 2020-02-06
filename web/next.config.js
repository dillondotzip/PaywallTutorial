require('dotenv').config()
module.exports = {
  env: {
    STRIPE_TEST_PUBLIC: process.env.STRIPE_TEST_PUBLIC,
  },
}