const pmx = require('pmx')

const stats = require('./stats.js')

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

  setInterval(() => {
    return stats.update()
  }, 1000)
})
