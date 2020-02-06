import React from 'react'
import client from '../client'
import groq from 'groq'
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios'

const Index = (props) => {

  const onToken = async (token, file) => {
    await axios.post('/.netlify/functions/checkout', {
      body: {
        token: token, 
        package: file
      }
    })
  };

  return (
    <div>
      <h2>Paywall Tutorial</h2>
      {props.downloads.map((file, i) => {
        return <div key={i}>
          <h4>{file.title}</h4>
          <ul>
            {file.features.map((point, _i) => <li key={_i}>{point}</li>)}
          </ul>
          <h2>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'symbol'  }).format(file.price / 100)}</h2>
          <div>
            <StripeCheckout
              stripeKey={process.env.STRIPE_TEST_PUBLIC}
              token={(e) => onToken(e, file)}
              amount={file.price}
              label={`Buy Now`}
            />
          </div>
        </div>
      })}
    </div>
  )
}

Index.getInitialProps = async ({req}) => {
  const downloads = await client.fetch(groq`*[_type == "download"]{
    features,
    price,
    title,
    _id
  }`)

  return { downloads }
}

export default Index