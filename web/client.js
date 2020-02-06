const sanityClient = require('@sanity/client')

module.exports = sanityClient({
  projectId: 'o2xvgcb7', // you can find this in sanity.json
  dataset: 'production', // or the name you chose in step 1
  useCdn: true // `false` if you want to ensure fresh data
})