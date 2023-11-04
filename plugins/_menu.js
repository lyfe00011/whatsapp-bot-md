const bot = require('../lib/events')
const { addSpace, textToStylist, PREFIX, getUptime, PLUGINS, getRam } = require('../lib/')
const { VERSION } = require('../config')
bot.addCommand(
  {
    pattern: 'help ?(.*)',
    fromMe: true,
    dontAddCommandList: true,
  },
  async (message, match) => {
    const sorted = bot.commands.sort((a, b) => (a, b) => a.name.localeCompare(b.name))
    const date = new Date()
    let CMD_HELP = `╭────────────────╮
						ᴀᴊxᴀʟ-ᴍᴅ
╰────────────────╯

╭────────────────
│ Prefix : ${PREFIX}
│ User : ${message.pushName}
│ Time : ${date.toLocaleTimeString()}
│ Day : ${date.toLocaleString('en', { weekday: 'long' })}
│ Date : ${date.toLocaleDateString('hi')}
│ Version : ${VERSION}
│ Plugins : ${PLUGINS.count}
│ Ram : ${getRam()}
│ Uptime : ${getUptime('t')}
╰────────────────
╭────────────────
`
    const commands = []
    sorted.map(async (command, index) => {
      if (command.dontAddCommandList === false && command.pattern !== undefined) {
        commands.push(command.name)
      }
    })
    commands.forEach((command, i) => {
      CMD_HELP += `│ ${i + 1} ${addSpace(i + 1, commands.length)}${textToStylist(
        command.toUpperCase(),
        'mono'
      )}\n`
    })
    CMD_HELP += `╰────────────────`
    return await message.send('```' + CMD_HELP + '```')
  }
)

bot.addCommand(
  {
    pattern: 'list ?(.*)',
    fromMe: true,
    dontAddCommandList: true,
  },
  async (message, match) => {
    let msg = ''
    const sorted = bot.commands.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name)
      }
      return 0
    })
    sorted.map(async (command, index) => {
      if (command.dontAddCommandList === false && command.pattern !== undefined) {
        msg += `${index + 1} ${command.name}\n${command.desc}\n\n`
      }
    })
    await message.send('```' + msg.trim() + '```')
  }
)
bot.addCommand(
  {
    pattern: 'menu ?(.*)',
    fromMe: true,
    dontAddCommandList: true,
  },
  async (message, match) => {
    const commands = {}
    bot.commands.map(async (command, index) => {
      if (command.dontAddCommandList === false && command.pattern !== undefined) {
        if (!commands[command.type]) commands[command.type] = []
        const isDiabled = command.active === false
        const cmd = command.name.trim()
        commands[command.type].push(isDiabled ? cmd + ' [disabled]' : cmd)
      }
    })
    const date = new Date()
    let msg = `\`\`\`╭═══ LEVANTER ═══⊷
┃❃╭──────────────
┃❃│ Prefix : ${PREFIX}
┃❃│ User : ${message.pushName}
┃❃│ Time : ${date.toLocaleTimeString()}
┃❃│ Day : ${date.toLocaleString('en', { weekday: 'long' })}
┃❃│ Date : ${date.toLocaleDateString('hi')}
┃❃│ Version : ${VERSION}
┃❃│ Plugins : ${PLUGINS.count}
┃❃│ Ram : ${getRam()}
┃❃│ Uptime : ${getUptime('t')}
┃❃╰───────────────
╰═════════════════⊷\`\`\`\n`

    if (match && commands[match]) {
      msg += ` ╭─❏ ${textToStylist(match.toLowerCase(), 'smallcaps')} ❏\n`
      for (const plugin of commands[match])
        msg += ` │ ${textToStylist(plugin.toUpperCase(), 'mono')}\n`
      msg += ` ╰─────────────────`

      return await message.send(msg)
    }
    for (const command in commands) {
      msg += ` ╭─❏ ${textToStylist(command.toLowerCase(), 'smallcaps')} ❏\n`
      for (const plugin of commands[command])
        msg += ` │ ${textToStylist(plugin.toUpperCase(), 'mono')}\n`
      msg += ` ╰─────────────────\n`
    }
    await message.send(msg.trim())
  }
)
