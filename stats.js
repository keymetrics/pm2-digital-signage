const pmx = require('pmx')
const activeWin = require('active-win')
const si = require('systeminformation')

const Probe = pmx.probe()

let metrics

exports.init = () => {
  metrics = {
    activeTitle: Probe.metric({
      name: 'Active title',
      value: 'N/A'
    }),
    activeProc: Probe.metric({
      name: 'Active process',
      value: 'N/A'
    }),
    uptime: Probe.metric({
      name: 'Uptime',
      value: 0
    }),
    motherboard: Probe.metric({
      name: 'Motherboard',
      value: 'N/A'
    }),
    cpu: Probe.metric({
      name: 'CPU',
      value: 'N/A'
    }),
    cpuTemp: Probe.metric({
      name: 'CPU Temp',
      value: 'N/A'
    }),
    ramUsed: Probe.metric({
      name: 'RAM used',
      value: 'N/A'
    }),
    diskUsed: Probe.metric({
      name: 'Disk used',
      value: 'N/A'
    })
  }
}

exports.update = () => {
  activeWin().then(data => {
    metrics.activeTitle.set(data.title);
    if (data.owner) {
      metrics.activeProc.set(data.owner.name);
    } else {
      metrics.activeProc.set('❌');
    }
  })

  metrics.uptime.set(si.time().uptime)
  si.system().then(data => {
    metrics.motherboard.set(`${data.manufacturer} ${data.model} ${data.version}`)
  })
  si.cpu().then(data => {
    metrics.cpu.set(`${data.manufacturer} ${data.brand} ${data.speed}`)
  })
  si.cpuTemperature().then(data => {
    metrics.cpuTemp.set(data.main + ' degC')
  })
  si.mem().then(data => {
    metrics.ramUsed.set(((data.used / data.total) * 100).toFixed(2) + '%')
  })
  si.fsSize().then(data => {
    let d = data[0]
    metrics.diskUsed.set((d.use).toFixed(2) + '%')
  })
}
