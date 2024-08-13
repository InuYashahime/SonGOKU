import fs from 'fs'
import os from 'os'
import fetch from 'node-fetch'

let limit = 800
let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
  let chat = global.db.data.chats[m.chat]
  if (!args || !args[0]) throw `✳️ 𝙴𝙹𝙴𝙼𝙿𝙻𝙾:\n${usedPrefix + command} https://youtube.com/shorts/39LmFpcpoh8?si=N92z8fQydPioR31G`
  if (!args[0].match(/youtu/gi)) throw ` 𝚅𝙴𝚁𝙸𝙵𝙸𝙲𝙰 𝚀𝚄𝙴 𝚂𝚄 𝙴𝙽𝙻𝙰𝙲𝙴 𝚂𝙴𝙰 𝚅𝙰𝙻𝙸𝙳𝙾`

  var ggapi = `https://youtube-api-thepapusteam.koyeb.app/api/video?url=${encodeURIComponent(args[0])}`

  const response = await fetch(ggapi)
  if (!response.ok) {
    console.log('Error al obtener los detalles del video:', response.statusText)
    throw 'Error al obtener los detalles del video'
  }
  const data = await response.json()

  if (!data.status) throw 'Error al procesar el video'

  const caption = `\`🐉𝚈𝙾𝚄𝚃𝚄𝙱𝙴 𝚈𝚃𝙼𝙿𝟺𝙳𝙾𝙲🐉\`
  
  
  🐉 \`𝚃𝚒𝚝𝚞𝚕𝚘\`: ${data.data.title}
  🐉 \`𝙰𝚞𝚝𝚘𝚛\`: ${data.data.author.name}
  🐉 \`𝙲𝚊𝚗𝚊𝚕\`: ${data.data.author.url}
  🐉 \`𝙴𝚗𝚕𝚊𝚌𝚎\`: ${data.data.src_url}
  🐉 \`𝙼𝚒𝚗𝚒𝚊𝚝𝚞𝚛𝚊\` ${data.data.picture}
  ━━━━━━━━✦✗✦━━━━━━━━━
  `

  let vres = data.downloads.mp4.url

  let vid = await fetch(vres)
  const vidBuffer = await vid.buffer()

  conn.sendFile(m.chat, vidBuffer, 'video.mp4', caption, m, false, { asDocument: true })
}

handler.help = ['ytmp4doc <yt-link>']
handler.tags = ['descargador']
handler.command = ['ytmp4doc',]
handler.register = true

export default handler