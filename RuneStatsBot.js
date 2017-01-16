'use strict'

const superagent = require('superagent')
const Discord = require('discord.js')
const bot = new Discord.Client()

const _TOKEN = INSERTYOURTOKEN
const _PREFIX = "+RS"

bot.on('ready', () => {
  console.log('RuneStats Bot ready!')
})

bot.on('message', msg => {
  //The bot ignores messages that don't start with the prefix or are from a bot
	if (!msg.content.startsWith(_PREFIX) || msg.author.bot) {return}
  
  let msgCommand = msg.content.split(" ")[1].toUpperCase()
	let msgContent = msg.content.toUpperCase().replace('+RS '+msgCommand + " ", "")
	
	if (msgCommand === 'HELP') {
	  console.log("Displaying help...")
	  let size = 23
	  let msgHelp = "```HELP" 
	    + '\n' + strStretch('StatsIron USERNAME', size) + '| ' + strStretch('Display IronMan Stats for USERNAME', size) 
	    + '\n' + strStretch('Stats USERNAME', size) + '| ' + strStretch('Display Stats for USERNAME', size)
	    + '\n' + strStretch('StatsIronHard USERNAME', size) + '| ' + strStretch('Display IronMan Hardcore Stats for USERNAME', size)
	    + "```"
	  msg.reply(msgHelp)
	} else if (msgCommand ==='Hosts') {
	  
	} else if (msgCommand === 'OS') {
	  //TODO implement Old School
	  msg.reply("Old School functionality not implemented yet.")
  } else {
	  if (msgCommand.startsWith('STATS')) {
	    if (!msgContent)  {
	      msg.reply("Incorrect usage!")
	      return
	    } else {
	      msgContent.replace(" ", '_')
	    }
  	  if (msgCommand === 'STATS') {
        console.log("Ironman Stats Called...")
  	    let statsLink = "http://services.runescape.com/m=hiscore/index_lite.ws?player=" + msgContent
  	    displayStats(msg, statsLink, msgContent)
      } else if (msgCommand === 'STATSIRON') {
  	    console.log("Ironman Stats Called...")
  	    let statsLink = "http://services.runescape.com/m=hiscore_ironman/index_lite.ws?player=" + msgContent
  	    displayStats(msg, statsLink, msgContent)
  	  } else if (msgCommand === 'STATSIRONHARD') {
  	    console.log("Hardcore Ironman Stats Called...")
	      let statsLink = "http://services.runescape.com/m=hiscore_hardcore_ironman/index_lite.ws?player=" + msgContent
	      displayStats(msg, statsLink, msgContent)
      }
	  }
  }
	
  
})

function strMatch(str1, str2) {
  if (str1.toUpperCase() === str2.toUpperCase()) {
    return true
  } else {
    return false
  }
}

function strStretch(str, size) {
  while (str.length < size) {
    str += " "
  }
  return str
}

function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  }

function getSkillName(id) {
  let skillNames = ['Overall','Attack','Defence','Strength','Constitution','Ranged','Prayer',
		'Magic','Cooking','Woodcutting','Fletching','Fishing','Firemaking','Crafting','Smithing',
		'Mining','Herblore','Agility','Thieving','Slayer','Farming','Runecrafting','Hunter',
		'Construction','Summoning','Dungeoneering','Divination','Invention']
	return skillNames[id];
}

function getSkillLvl(xp) {
  let xpForLvl = [[100,14391160],[101,15889109],[102,17542976],[103,19368992],[104,21385073],
    [105,23611006],[106,26068632],[107,28782069],[108,31777943],[109,35085654],[110,38737661],
    [111,42769801],[112,47221641],[113,52136869],[114,57563718],[115,63555443],[116,70170840],
    [117,77474828],[118,85539082],[119,94442737],[120,104273167]]
  //  Lvl is 120 or above
  if (xp > 104273167) {
    return "120"
  }
  for (let j=0; j<xpForLvl.length; j++) {
    if (xp < xpForLvl[j][1]) {
      return xpForLvl[j-1][0].toString()
    }
  }
}

function displayStats(msg, link, user) {
  superagent.get(link)
		.end((error, response) => {
		  if (error) {
				msg.reply('There was an error while grabbing the stats for \'' + user + '\'. Please try again later.')
			} else {
				let statData = response.text.split('\n')
				let row = []
				let size = 15
				let lvlSize = 6
				let xpSize = 12
				let rankSize = 6
				
				let msgStats = "```" + '\n' + 'Displaying stats for: \'' + user + '\''
				  + '\n' + strStretch('Skill', size) + '| ' + strStretch('Level', lvlSize) + '| ' + strStretch('Experience', xpSize) + '| ' + strStretch('Rank', rankSize)
				
				for (let i = 0; i < 28; i++) {
					row = statData[i].split(',')
					if (row[2] >= 14391160 && i>0 && i<27) {
					  // Lvl is 100+
					  row[1] = getSkillLvl(row[2])
					}
					row[2] = commaSeparateNumber(row[2])
					
					msgStats += '\n' + strStretch(getSkillName(i), size) + '| ' + strStretch(row[1], lvlSize) + '| ' + strStretch(row[2], xpSize) + '| ' + strStretch(row[0], rankSize)
				}
				
				msgStats += '\n```'
				
				msg.channel.sendMessage(msgStats)
			}
		});
}

bot.login(_TOKEN)