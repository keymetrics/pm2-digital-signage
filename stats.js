const pmx = require('@pm2/io')
const activeWin = require('active-win')
const si = require('systeminformation')

let mouse
try {
  mouse = require('win-mouse')()
} catch (e) {
  console.log(e)
}

let metrics

exports.init = () => {
  metrics = {
    activeTitle: pmx.metric({
      name: 'Active title',
      value: 'N/A'
    }),
    activeProc: pmx.metric({
      name: 'Active process',
      value: 'N/A'
    }),
    uptime: pmx.metric({
      name: 'Uptime',
      value: 0
    }),
    motherboard: pmx.metric({
      name: 'Motherboard',
      value: 'N/A'
    }),
    cpu: pmx.metric({
      name: 'CPU',
      value: 'N/A'
    }),
    cpuUsed: pmx.metric({
      name: 'CPU used',
      value: 'N/A',
      unit: '%',
      alert: {
        mode: 'threshold-avg',
        value: 90,
        cmp: '>'
      }
    }),
    cpuTemp: pmx.metric({
      name: 'CPU temp',
      value: 'N/A',
      unit: 'degC',
      alert: {
        mode: 'threshold-avg',
        value: 70,
        cmp: '>'
      }
    }),
    ramUsed: pmx.metric({
      name: 'RAM used',
      value: 'N/A',
      unit: '%',
      alert: {
        mode: 'threshold-avg',
        value: 10,
        cmp: '<'
      }
    }),
    diskUsed: pmx.metric({
      name: 'Disk used',
      value: 'N/A',
      unit: '%',
      alert: {
        mode: 'threshold-avg',
        value: 10,
        cmp: '<'
      }
    }),
    networkRx: pmx.metric({
      name: 'Network rx'
    }),
    networkTx: pmx.metric({
      name: 'Network tx'
    }),
    os: pmx.metric({
      name: 'Operating system',
      value: 'N/A'
    })
  }

  if (mouse) {
    metrics.mouseMove = pmx.meter({
      name: 'mvs/min'
    })
    mouse.on('move', (x, y) => {
      metrics.mouseMove.mark()
    })
  }
}

exports.updateActiveWindow = () => {
  activeWin().then(data => {
    metrics.activeTitle.set(data.title)
    if (data.owner) {
      metrics.activeProc.set(data.owner.name)
    } else {
      metrics.activeProc.set('❌')
    }
  })
}

exports.updateSystemMetrics = () => {
  metrics.uptime.set(si.time().uptime.toFixed(0))
  si.system().then(data => {
    metrics.motherboard.set(`${data.manufacturer} ${data.model} ${data.version}`)
  })
  si.cpu().then(data => {
    metrics.cpu.set(`${data.manufacturer} ${data.brand} ${data.speed}`)
  })
  si.currentLoad().then(data => {
    metrics.cpuUsed.set(data.currentload.toFixed(2) + '%')
  })
  si.cpuTemperature().then(data => {
    metrics.cpuTemp.set(data.main + ' C')
  })
  si.mem().then(data => {
    metrics.ramUsed.set(((data.used / data.total) * 100).toFixed(2) + '%')
  })
  si.fsSize().then(data => {
    let d = data[0]
    metrics.diskUsed.set((d.use).toFixed(2) + '%')
  })
  si.networkInterfaceDefault().then(iface => {
    si.networkStats(iface).then(data => {
      metrics.networkRx.set(`${(data.rx_sec / 1024).toFixed(2)} kb/s`)
      metrics.networkTx.set(`${(data.tx_sec / 1024).toFixed(2)} kb/s`)
    })
  })
  si.osInfo().then(data => [
    metrics.os.set(`${data.distro} ${data.release}`)
  ])
}
