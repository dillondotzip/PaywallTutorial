export default {
  name: 'user',
  title: 'User',
  type: 'document',
  readOnly: true,
  fields: [
    {
      name: 'email',
      title: 'Email',
      type: 'string'
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string'
    }
  ]
}
