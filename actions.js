const pmx = require('pmx')
const activeWin = require('active-win')
const { exec } = require('child_process')

const Action = pmx.action

exports.init = () => {
  Action('killCurrent', reply => {
    exports.killCurrent(reply)
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
      hideWindows: true
    }, (err, stdout, stderr) => {
      if (err) return cb({ err })
      cb({ stdout, stderr })
    })
  })
}
