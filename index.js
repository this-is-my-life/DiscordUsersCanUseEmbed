const chalk = require('chalk')
const discord = require('discord.js')
const fs = require('fs')
const prompts = require('prompts')

{}

(async () => {

  if (!fs.existsSync('./secure/')) {
    fs.mkdirSync('./secure/')
    fs.writeFileSync('./secure/recent.json', '{ "recent": "" }')
  } else if (!fs.existsSync('./secure/recent.json')) {
    fs.writeFileSync('./secure/recent.json', '{ "recent": "" }')
  }

  const recent = require('./secure/recent.json')

  let res = await prompts({
    type: 'password',
    name: 'token',
    message: 'Please Provide your Discord User Token',
    validate: value => value !== '' && value.length < 50 ? `User Tokens are longer than 50` : true
  })

  if (res.token == undefined) {
    console.log(chalk.red.bold('ducue Process Aborted'))
    process.exit(1)
  } else if (res.token === '') {
    console.log(chalk.green.bold('Connecting: Discord API'))
    let client = new discord.Client()
    client.login(recent.recent)
    check(client)
  } else {
    recent.recent = res.token
    fs.writeFileSync('./secure/recent.json', JSON.stringify(recent))
    console.log(chalk.green.bold('Connecting: Discord API'))
    let client = new discord.Client()
    client.login(res.token)
    check(client)
  }

  
})()


function check (client) {
  client.on('ready', () => {
    console.log(chalk.yellow.bold('Connected: ' + client.user.username + ' (' + client.user.id + ')'))
  })
  
  client.on('message', (msg) => {
    if (msg.author.id !== client.user.id) return
    if (!msg.content.startsWith('ducue;')) return
    
    console.log(chalk.magenta.bold('Command Detected ' + msg.content))
    let input = msg.content.replace('ducue;', '').split(';')
    msg.delete()

    if (!input[0]) {
      console.log(chalk.cyan('DUCUE Help Embed Executed'))
      let helpEmbed = new discord.RichEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL)
        .setColor(0x7289DA)
        .setTitle('DUCUE: RichEmbed for Discord User')
        .setFooter('Made by PMH Studio / PMH#7086')
      msg.channel.send(helpEmbed)
    } else {
      let embed = new discord.RichEmbed()
      let setAuthor = []

      if (input[0]) {
        embed.setTitle(input[0])
      }
      
      if (input[1]) {
        embed.setDescription(input[1])
      }

      if (input[2]) {
        embed.setColor(parseInt(input[2].replace('#', ''), 16))
      }

      if (input[3]) {
        setAuthor[0] = input[3]
      }

      if (input[4]) {
        setAuthor[1] = input[4]
      }

      if (setAuthor[0]) {
        embed.setAuthor(setAuthor[0], setAuthor[1])
      }
      msg.channel.send(embed)
    }
  })
}