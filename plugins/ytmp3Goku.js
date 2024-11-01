import axios from "axios";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import os from "os";

let streamPipeline = promisify(pipeline);

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, `*_々 Ingresa un enlace de YouTube*\n\n*ejemplo:*\n${usedPrefix + command} https://youtu.be/w_ufjahQlyw?si=jMBHaX8SgkNdcG2v`, m);

  try {
    let videoUrl = text; 
    let apiUrl = `https://rembotapi.vercel.app/api/yt?url=${encodeURIComponent(videoUrl)}`;

    let response = await axios.get(apiUrl);
    let data = response.data;

    if (!data.status) throw new Error("Error al obtener datos del video");

    let { title, thumbnail, audioUrl } = data.data;
    await m.react("⏱");

    let tmpDir = os.tmpdir();
    let fileName = `${title}.mp3`;
    let filePath = `${tmpDir}/${fileName}`;

    let audioResponse = await axios({
      url: audioUrl,
      method: 'GET',
      responseType: 'stream'
    });

    let writableStream = fs.createWriteStream(filePath);
    await streamPipeline(audioResponse.data, writableStream);

    let doc = {
      audio: {
        url: filePath,
      },
      mimetype: "audio/mp4",
      fileName: `${title}`,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 2,
          mediaUrl: videoUrl,
          title: title,
          sourceUrl: videoUrl,
          thumbnail: await (await conn.getFile(thumbnail)).data,
        },
      },
    };

    await conn.sendMessage(m.chat, doc, { quoted: m });
    await m.react("✅");
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, `${global.error}`, m).then(_ => m.react('❌'));
  }
};
handler.help = ['ytmp3 <yt url>']
handler.tags = ['downloader']
handler.command = ['ytmp3', 'yta']
handler.register = true 
//handler.limit = 1
export default handler