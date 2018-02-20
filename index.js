const pmx = require('pmx')

const stats = require('./stats.js')
const actions = require('./actions.js')

pmx.initModule({
  widget: {
    type: 'generic',
    logo: 'http://adactive.com/wp-content/uploads/2014/10/AdactiveLogo_new-1.png',
    theme: ['#ffffff', '#1B2228', '#807C7C', '#807C7C'],
    el: {
      probes: true
    },
    block: {
      issues: false,
      meta: true,
      cpu: false,
      mem: false,
      main_probes: ['Active title', 'Active process', 'mvs/min', 'CPU used', 'RAM used', 'Disk used', 'CPU temp', 'Network rx', 'Network tx']
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
