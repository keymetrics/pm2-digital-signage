const pmx = require('pmx')
const activeWin = require('active-win')
const { exec } = require('child_process')
const si = require('systeminformation')

const Action = pmx.action

exports.init = () => {
  Action('killCurrent', reply => {
    exports.killCurrent(reply)
  })
  Action('listProcesses', reply => {
    exports.listProcesses(reply)
  })
  Action('getStaticData', reply => {
    si.getStaticData().then(data => {
      reply(data)
    })
  })
}

exports.killCurrent = cb => {
  activeWin().then(data => {
    console.log(data)
    if (!data.owner) return cb({ err: 'No active process' })
    let cmd
    if (process.platform === 'win32') {
      cmd = `taskkill /IM ${data.owner.name} /F`
    } else {
      cmd = `killall --ignore-case ${data.owner.name}`
    }
    exec(cmd, {
      windowsHide: true
    }, (err, stdout, stderr) => {
      if (err) return cb({ err })
      cb({ stdout, stderr })
    })
  })
}

exports.listProcesses = cb => {
  let cmd = 'ps -A'
  if (process.platform == 'win32') cmd = 'tasklist'
  exec(cmd, {
    windowsHide: true
  }, (err, stdout, stderr) => {
    if (err) return cb({ err })
    cb(stdout)
  })
}
