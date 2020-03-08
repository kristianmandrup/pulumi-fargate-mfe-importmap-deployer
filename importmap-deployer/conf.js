module.exports = {
  username: process.env.HTTP_USERNAME,
  password: process.env.HTTP_PASSWORD,
  manifestFormat: 'importmap',
  locations: {
    reactMf: 's3://react.microfrontends.app/importmap.json',
    vueMf: 's3://vue.microfrontends.app/importmap.json',
    polyglotMf: 's3://polyglot.microfrontends.app/importmap.json',
    angularMf: 's3://angular.microfrontends.app/importmap.json'
  }
};