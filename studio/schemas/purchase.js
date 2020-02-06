export default {
  name: 'purchase',
  title: 'Purchase',
  type: 'document',
  readOnly: true,
  fields: [
    {
      name: 'download',
      title: 'Download',
      type: 'reference',
      weak: true,
      to: [{type: 'download'}]
    },
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{type: 'user'}]
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm'
      }
    }

  ],
  preview: {
    select: {
      title: 'download.title',
      date: 'date',
      user: 'user.email'
    },
    prepare(selection) {
      const {title, date, user } = selection
      return {
        title: title,
        subtitle: date + ' - ' + user
      }
    }
  }
}
