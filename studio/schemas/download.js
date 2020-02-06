export default {
  name: 'download',
  title: 'Download',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number'
    },
    {
      name: 'file',
      title: 'File',
      type: 'file',
      options: {
        hotspot: true
      }
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}]
    }
  ]
}
