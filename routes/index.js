const routes = require('./routes')
const apis = require('./apis')

module.exports = (router) => {
  router.use('/api', apis)
  router.use('/', routes)
}


