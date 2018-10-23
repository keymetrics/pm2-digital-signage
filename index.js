const pmx = require('@pm2/io')

const stats = require('./stats.js')
const actions = require('./actions.js')

pmx.init({
  isModule: true,
  widget: {
    type: 'generic',
    el: {
      probes: true
    },
    block: {
      cpu: false,
      mem: false,
      main_probes: ['Active title', 'Active process', 'mvs/min', 'CPU used', 'RAM used', 'Disk used', 'CPU temp', 'Network rx', 'Network tx']
    }
  }
})

stats.init()
stats.updateActiveWindow()
stats.updateSystemMetrics()

actions.init()

setInterval(stats.updateActiveWindow, (parseInt(process.env.WINDOW_UPDATE_RATE) || 2) * 1000)
setInterval(stats.updateSystemMetrics, (parseInt(process.env.SYSTEM_UPDATE_RATE) || 10) * 1000)