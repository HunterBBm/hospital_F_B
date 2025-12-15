export default {
  routes: [
    {
      method: 'GET',
      path: '/articles',
      handler: 'article.find',
    },
  ],
};
