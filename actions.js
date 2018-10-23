const pmx = require('@pm2/io')
const activeWin = require('active-win')
const { exec } = require('child_process')

exports.init = () => {
  pmx.action('killCurrent', reply => {
    exports.killCurrent(reply)
  })
  pmx.action('listProcesses', reply => {
    exports.listProcesses(reply)
  })
}

exports.killCurrent = cb => {
  activeWin().then(data => {
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
      if (err) return cb({ err, stdout, stderr })
      cb({ stdout, stderr })
    })
  })
}

exports.listProcesses = cb => {
  let cmd = 'ps -A'
  if (process.platform === 'win32') cmd = 'tasklist'
  exec(cmd, {
    windowsHide: true
  }, (err, stdout, stderr) => {
    if (err) return cb({ err })
    cb(stdout)
  })
}
