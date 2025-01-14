const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/_search', // The endpoint you want to proxy (e.g., search API)
    createProxyMiddleware({
      target: process.env.REACT_APP_ELASTICSEARCH_URL, // Elasticsearch server URL
      changeOrigin: true,
      secure: true, // Set this to `true` if you're using HTTPS for your Elasticsearch server
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.REACT_APP_ELASTICSEARCH_USERNAME}:${process.env.REACT_APP_ELASTICSEARCH_PASSWORD}`).toString('base64')}`, // If your server needs authentication
      }
    })
  );
};