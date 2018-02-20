const pmx = require('pmx')

const stats = require('./stats.js')
const actions = require('./actions.js')

pmx.initModule({
  widget: {
    type: 'generic',
    el: {
      probes: true
    },
    block: {
      issues: false,
      meta: true,
      main_probes: ['Active title', 'Active process']
    }
  }
}, () => {
  stats.init()
  stats.update()

  actions.init()

  setInterval(() => {
    return stats.update()
  }, 1000)
})
