module.exports = {
    showRole: function (isAdmin) {
        if (isAdmin) return 'admin'
        return 'user'
    },
    setRole: function (isAdmin) {
        if (isAdmin) return 'set as user'
        return 'set as admin'
    },
    ifCond: function (a, b, options) {
        if (a === b) {
          return options.fn(this)
          }
        return options.inverse(this)
    }
}