const {
    WAConnection,
    MessageType,
} = require('@adiwajshing/baileys');
const fs = require('fs-extra');
const moment = require('moment');
const figlet = require('figlet');
const adk = require('./lib/adk.js');
const photo = require('./lib/photo.js');
const txtt = require('./lib/txtt.js');
const videox = require('./lib/video.js');
const quran = require('./lib/quran.js');

async function start() {

    const client = new WAConnection()
    //========================= كود qr ====================//
    fs.existsSync('./BotAdhkar.json') && client.loadAuthInfo('./BotAdhkar.json') 
    await client.connect({timeoutMs: 30*1000}) 
    fs.writeFileSync('./BotAdhkar.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
  
    console.log('-----------------------------------------------------------');
    console.log(figlet.textSync('BOT ADHKAR'));
    console.log('-----------------------------------------------------------');
    console.log("start bot adhkar", moment().format("HH:mm:ss"));   
    
    //==========================   لاتلعب هنا فقط غير رقم صاحب البوت   ==============//    

    client.on('chat-update', async (msg) => {
        try {
            if (!msg.hasNewMessage) return
            msg = JSON.parse(JSON.stringify(msg)).messages[0]
            if (!msg.message) return
            msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message
            if (msg.key && msg.key.remoteJid == 'status@broadcast') return
            if (msg.key.fromMe) return
            const from = msg.key.remoteJid
            const type = Object.keys(msg.message)[0]
            const { text, image, video, audio } = MessageType
            const content = JSON.stringify(msg.message)
            const isGroup = from.endsWith('@g.us')
	    const sender = isGroup ? msg.participant : msg.key.remoteJid
            const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
	    const groupMembers = isGroup ? groupMetadata.descId : ''  
            const owner = ["966xxxxxxxxx@s.whatsapp.net"] // ضع رقم صاحب البوت مع المفتاح الدولي بدون علامة زائد +
            const isOwner = owner.includes(sender);
            body = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : ''
            const comn = body.toLowerCase().split(' ')[0] || ''
            const comnquran = body
            const txt = body.toLowerCase()
            const gs = body.split(' ')
            pushname = client.contacts[sender] != undefined ? client.contacts[sender].vname || client.contacts[sender].notify : undefined



// ========================= مرحبا  ==============//
            if ((txt === "hi") || (txt === "مرحبا") || (txt === "بوت")){
              await client.sendMessage (from, `${pushname}`+txtt.t3, text);
            }

// ========================= رد السلام  ==============//
            else if ((txt === "السلام عليكم") || (txt === "السلام عليكم ورحمة الله") || (txt === "السلام عليكم ورحمة الله وبركاته") || (txt === "سلام عليكم")) {

                await client.sendMessage(from, "وعليكم السلام ورحمة الله وبركاته", text);

            
             }
// ========================= لإرسال أذكار المساء  ==============//
             else if ((txt === "أذكار المساء") || (txt === "اذكار المساء") || (txt === "6")) {
                await client.sendMessage(from, txtt.t1, text);               
             }
// ========================= لإرسال أذكار الصباح  ==============//
             else if ((txt === "أذكار الصباح") || (txt === "اذكار الصباح") || (txt === "5")) {
               await client.sendMessage(from, txtt.t2, text);
             }
// =========================  صوره عشوائية  ==============//
             else if ((txt === "صور") || (txt === "2")){
              let listphoto = photo[Math.floor(Math.random() * photo.length)]          
              await client.sendMessage(from, { url: listphoto }, image);
             }
// =========================  فيديو عشوائي  ==============//
             else if ((txt === "فيديو") || (txt === "3")){
              let listvideo = videox[Math.floor(Math.random() * videox.length)]          
              await client.sendMessage(from, { url: listvideo }, video);
             }
// =========================  أذكار عشوئي ==============//
             else if ((txt === "ذكر") || (txt === "4")){ 
              let listadk = adk[Math.floor(Math.random() * adk.length)]       
              await client.sendMessage(from, listadk, text); 
             }          
// =========================  إرسال صوره لكل المحادثات المفتوحة فقط  ==============//
                else if (comn === "bc"){    
                  let isQuoted = type === 'extendedTextMessage' && content.includes('imageMessage')
                  if (!isOwner) return await client.sendMessage(from, "فقط صاحب البوت يمكنه أستخدام هذه الميزة", text)
                  if (gs.length >= 1)
                  if (isQuoted) {
                    let encmedia = isQuoted ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
                    file = await client.downloadMediaMessage(encmedia)
                    let chats = await client.chats.array
                      for (let lop of chats){
                        await client.sendMessage(lop.jid, file, image).then((result) => { console.log('Result: ', result); })
                        .catch((error) => { console.error('Error when sending: ', error); });
                      };
                      await client.sendMessage(from, "تم نشر الصوره", text)
                  }
                }
// =========================  إرسال فيديو لكل المحادثات المفتوحة فقط  ==============//
                else if (comn === "bcv"){    
                  let isQuoted = type === 'extendedTextMessage' && content.includes('videoMessage')
                  if (!isOwner) return await client.sendMessage(from, "فقط صاحب البوت يمكنه أستخدام هذه الميزة", text)
                  if (gs.length >= 1)
                  if (isQuoted) {
                    let encmedia = isQuoted ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
                    file = await client.downloadMediaMessage(encmedia)
                    let chats = await client.chats.array
                      for (let lop of chats){
                        await client.sendMessage(lop.jid, file, video).then((result) => { console.log('Result: ', result); })
                        .catch((error) => { console.error('Error when sending: ', error); });
                      };
                      await client.sendMessage(from, "تم نشر الفيديو", text)
                  }
                } 
// =========================  القرآن الريم صوت + كتابة  ==============//
                switch (comnquran) {

                  case 'القرآن الكريم':
                   
                   await client.sendMessage(from, quran.q115, text)
                   break;
               
                   case 'قرآن':
                   
                   await client.sendMessage(from, quran.q115, text)
                   break;
               
                   case 'قرآن كريم':
                   
                   await client.sendMessage(from, quran.q115, text)
                   break;
      
                   case '1':
                   
                   await client.sendMessage(from, quran.q115, text)
                   break;
      
                   case 'القران الكريم':
                   
                   await client.sendMessage(from, quran.q115, text)
                   break;
                  
                   case 'الفاتحة':
                   
                   await client.sendMessage(from, quran.q1, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/001.mp3" }, audio)
                   break;
                   case 'البقرة':
                   
                   await client.sendMessage(from, quran.q2, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/002.mp3" }, audio)    
                   break;
                   case 'آل عمران':
                   
                   await client.sendMessage(from, quran.q3, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/003.mp3" }, audio)    
                   break;
                   case 'النساء':
                   
                   await client.sendMessage(from, quran.q4, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/004.mp3" }, audio)    
                   break;
                   case 'المائدة':
                   
                   await client.sendMessage(from, quran.q5, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/005.mp3" }, audio)    
                   break;
                   case 'الأنعام':
                   
                   await client.sendMessage(from, quran.q6, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/006.mp3" }, audio)    
                   break;
                   case 'الأعراف':
                   
                   await client.sendMessage(from, quran.q7, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/007.mp3" }, audio)    
                   break;
                   case 'الأنفال':
                   
                   await client.sendMessage(from, quran.q8, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/008.mp3" }, audio)     
                   break;
                   case 'التوبة':
                   
                   await client.sendMessage(from, quran.q9, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/009.mp3" }, audio)    
                   break;
                   case 'يونس':
                   
                   await client.sendMessage(from, quran.q10, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/010.mp3" }, audio)   
                   break;
                   case 'هود':
                   
                   await client.sendMessage(from, quran.q11, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/011.mp3" }, audio)    
                   break;
                   case 'يوسف':
                   
                   await client.sendMessage(from, quran.q12, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/012.mp3" }, audio)          
                   break;
                   case 'الرعد':
                   
                   await client.sendMessage(from, quran.q13, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/013.mp3" }, audio)     
                   break;
                   case 'إبراهيم':
                   
                   await client.sendMessage(from, quran.q14, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/014.mp3" }, audio)     
                   break;
                   case 'الحجر':
                   
                   await client.sendMessage(from, quran.q15, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/015.mp3" }, audio)     
                   break;
                   case 'النحل':
                   
                   await client.sendMessage(from, quran.q16, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/016.mp3" }, audio)     
                   break;
                   case 'الإسراء':
                   
                   await client.sendMessage(from, quran.q17, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/017.mp3" }, audio)    
                   break;
                   case 'الكهف':
                   
                   await client.sendMessage(from, quran.q18, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/018.mp3" }, audio)     
                   break;
                   case 'مريم':
                   
                   await client.sendMessage(from, quran.q19, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/019.mp3" }, audio)     
                   break;
                   case 'طه':
                   
                   await client.sendMessage(from, quran.q20, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/020.mp3" }, audio)     
                   break;
                   case 'الأنبياء':
                   
                   await client.sendMessage(from, quran.q21, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/021.mp3" }, audio)    
                   break;
                   case 'الحج':
                   
                   await client.sendMessage(from, quran.q22, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/022.mp3" }, audio)     
                   break;
                   case 'المؤمنون':
                   
                   await client.sendMessage(from, quran.q23, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/023.mp3" }, audio)     
                   break;
                   case 'النور':
                   
                   await client.sendMessage(from, quran.q24, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/024.mp3" }, audio)    
                   break;
                   case 'الفرقان':
                   
                   await client.sendMessage(from, quran.q25, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/025.mp3" }, audio)    
                   break;
                   case 'الشعراء':
                   
                   await client.sendMessage(from, quran.q26, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/026.mp3" }, audio)     
                   break;
                   case 'النمل':
                   
                   await client.sendMessage(from, quran.q27, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/027.mp3" }, audio)    
                   break;
                   case 'القصص':
                   
                   await client.sendMessage(from, quran.q28, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/028.mp3" }, audio)    
                   break;
                   case 'العنكبوت':
                   
                   await client.sendMessage(from, quran.q29, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/029.mp3" }, audio)    
                   break;
                   case 'الروم':
                   
                   await client.sendMessage(from, quran.q30, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/030.mp3" }, audio)    
                   break;
                   case 'لقمان':
                   
                   await client.sendMessage(from, quran.q31, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/031.mp3" }, audio)     
                   break;
                   case 'السجدة':
                   
                   await client.sendMessage(from, quran.q32, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/032.mp3" }, audio)     
                   break;
                   case 'الأحزاب':
                   
                   await client.sendMessage(from, quran.q33, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/033.mp3" }, audio)     
                   break;
                   case 'سبأ':
                   
                   await client.sendMessage(from, quran.q34, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/034.mp3" }, audio)      
                   break;
                   case 'فاطر':
                   
                   await client.sendMessage(from, quran.q35, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/035.mp3" }, audio)      
                   break;
                   case 'يس':
                   
                   await client.sendMessage(from, quran.q36, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/036.mp3" }, audio)      
                   break;
                   case 'الصافات':
                   
                   await client.sendMessage(from, quran.q37, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/037.mp3" }, audio)      
                   break;
                   case 'ص':
                   
                   await client.sendMessage(from, quran.q38, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/038.mp3" }, audio)      
                   break;
                   case 'الزمر':
                   
                   await client.sendMessage(from, quran.q39, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/039.mp3" }, audio)     
                   break;
                   case 'غافر':
                   
                   await client.sendMessage(from, quran.q40, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/040.mp3" }, audio)     
                   break;
                   case 'فصلت':
                   
                   await client.sendMessage(from, quran.q41, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/041.mp3" }, audio)    
                   break;
                   case 'الشورى':
                   
                   await client.sendMessage(from, quran.q42, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/042.mp3" }, audio)     
                   break;
                   case 'الزخرف':
                   
                   await client.sendMessage(from, quran.q43, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/043.mp3" }, audio)    
                   break;
                   case 'الدخان':
                   
                   await client.sendMessage(from, quran.q44, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/044.mp3" }, audio)     
                   break;
                   case 'الجاثية':
                   
                   await client.sendMessage(from, quran.q45, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/045.mp3" }, audio)    
                   break;
                   case 'الأحقاف':
                   
                   await client.sendMessage(from, quran.q46, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/046.mp3" }, audio)     
                   break;
                   case 'محمد':
                   
                   await client.sendMessage(from, quran.q47, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/047.mp3" }, audio)     
                   break;
                   case 'الفتح':
                   
                   await client.sendMessage(from, quran.q48, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/048.mp3" }, audio)    
                   break;
                   case 'الحجرات':
                   
                   await client.sendMessage(from, quran.q49, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/049.mp3" }, audio)    
                   break;
                   case 'ق':
                   
                   await client.sendMessage(from, quran.q50, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/050.mp3" }, audio)     
                   break;
                   case 'الذاريات':
                   
                   await client.sendMessage(from, quran.q51, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/051.mp3" }, audio)      
                   break;
                   case 'الطور':
                   
                   await client.sendMessage(from, quran.q52, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/052.mp3" }, audio)      
                   break;
                   case 'النجم':
                   
                   await client.sendMessage(from, quran.q53, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/053.mp3" }, audio)      
                   break;
                   case 'القمر':
                   
                   await client.sendMessage(from, quran.q54, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/054.mp3" }, audio)      
                   break;
                   case 'الرحمن':
                   
                   await client.sendMessage(from, quran.q55, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/055.mp3" }, audio)     
                   break;
                   case 'الواقعة':
                   
                   await client.sendMessage(from, quran.q56, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/056.mp3" }, audio)     
                   break;
                   case 'الحديد':
                   
                   await client.sendMessage(from, quran.q57, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/057.mp3" }, audio)     
                   break;
                   case 'المجادلة':
                   
                   await client.sendMessage(from, quran.q58, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/058.mp3" }, audio)      
                   break;
                   case 'الحشر':
                   
                   await client.sendMessage(from, quran.q59, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/059.mp3" }, audio)      
                   break;
                   case 'الممتحنة':
                   
                   await client.sendMessage(from, quran.q60, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/060.mp3" }, audio)      
                   break;
                   case 'الصف':
                   
                   await client.sendMessage(from, quran.q61, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/061.mp3" }, audio)     
                   break;
                   case 'الجمعة':
                   
                   await client.sendMessage(from, quran.q62, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/062.mp3" }, audio)    
                   break;
                   case 'المنافقون':
                   
                   await client.sendMessage(from, quran.q63, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/063.mp3" }, audio)      
                   break;
                   case 'التغابن':
                   
                   await client.sendMessage(from, quran.q64, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/064.mp3" }, audio)     
                   break;
                   case 'الطلاق':
                   
                   await client.sendMessage(from, quran.q65, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/065.mp3" }, audio)    
                   break;
                   case 'التحريم':
                   
                   await client.sendMessage(from, quran.q66, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/066.mp3" }, audio)    
                   break;
                   case 'الملك':
                   
                   await client.sendMessage(from, quran.q67, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/067.mp3" }, audio)     
                   break;
                   case 'القلم':
                   
                   await client.sendMessage(from, quran.q68, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/068.mp3" }, audio)     
                   break;
                   case 'الحاقة':
                   
                   await client.sendMessage(from, quran.q69, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/069.mp3" }, audio)     
                   break;
                   case 'المعارج':
                   
                   await client.sendMessage(from, quran.q70, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/070.mp3" }, audio)    
                   break;
                   case 'نوح':
                   
                   await client.sendMessage(from, quran.q71, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/071.mp3" }, audio) ;    
                   break;
                   case 'الجن':
                   
                   await client.sendMessage(from, quran.q72, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/072.mp3" }, audio) ;     
                   break;
                   case 'المزمل':
                   
                   await client.sendMessage(from, quran.q73, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/073.mp3" }, audio) ;    
                   break;
                   case 'المدثر':
                   
                   await client.sendMessage(from, quran.q74, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/074.mp3" }, audio) ;    
                   break;
                   case 'القيامة':
                   
                   await client.sendMessage(from, quran.q75, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/075.mp3" }, audio) ;    
                   break;
                   case 'الإنسان':
                   
                   await client.sendMessage(from, quran.q76, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/076.mp3" }, audio) ;    
                   break;
                   case 'المرسلات':
                
                   await client.sendMessage(from, quran.q77, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/077.mp3" }, audio) ;     
                   break;
                   case 'النبأ':
                   
                   await client.sendMessage(from, quran.q78, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/078.mp3" }, audio) ;     
                   break;
                   case 'النازعات':
                   
                   await client.sendMessage(from, quran.q79, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/079.mp3" }, audio) ;     
                   break;
                   case 'عبس':
                   
                   await client.sendMessage(from, quran.q80, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/080.mp3" }, audio) ;    
                   break;
                   case 'التكوير':
                   
                   await client.sendMessage(from, quran.q81, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/081.mp3" }, audio) ;   
                   break;
                   case 'الانفطار':
                   
                   await client.sendMessage(from, quran.q82, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/082.mp3" }, audio) ;    
                   break;
                   case 'المطففين':
                   
                   await client.sendMessage(from, quran.q83, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/083.mp3" }, audio) ;    
                   break;
                   case 'الانشقاق':
                   
                   await client.sendMessage(from, quran.q84, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/084.mp3" }, audio) ;   
                   break;
                   case 'البروج':
                   
                   await client.sendMessage(from, quran.q85, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/085.mp3" }, audio) ;    
                   break;
                   case 'الطارق':
                   
                   await client.sendMessage(from, quran.q86, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/086.mp3" }, audio) ;    
                   break;
                   case 'الأعلى':
                   
                   await client.sendMessage(from, quran.q87, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/087.mp3" }, audio) ;    
                   break;
                   case 'الغاشية':
                   
                   await client.sendMessage(from, quran.q88, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/088.mp3" }, audio) ;    
                   break;
                   case 'الفجر':
                   
                   await client.sendMessage(from, quran.q89, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/089.mp3" }, audio) ;    
                   break;
                   case 'البلد':
                   
                   await client.sendMessage(from, quran.q90, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/090.mp3" }, audio) ;    
                   break;
                   case 'الشمس':
                   
                   await client.sendMessage(from, quran.q91, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/091.mp3" }, audio) ;    
                   break;
                   case 'الليل':
                   
                   await client.sendMessage(from, quran.q92, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/092.mp3" }, audio) ;   
                   break;
                   case 'الضحى':
                   
                   await client.sendMessage(from, quran.q93, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/093.mp3" }, audio) ;    
                   break;
                   case 'الشرح':
                   
                   await client.sendMessage(from, quran.q94, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/094.mp3" }, audio) ;   
                   break;
                   case 'التين':
                   
                   await client.sendMessage(from, quran.q95, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/095.mp3" }, audio) ;    
                   break;
                   case 'العلق':
                   
                   await client.sendMessage(from, quran.q96, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/096.mp3" }, audio) ;   
                   break;
                   case 'القدر':
                   
                   await client.sendMessage(from, quran.q97, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/097.mp3" }, audio) ;    
                   break;
                   case 'البينة':
                   
                   await client.sendMessage(from, quran.q98, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/098.mp3" }, audio) ;   
                   break;
                   case 'الزلزلة':
                   
                   await client.sendMessage(from, quran.q99, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/099.mp3" }, audio) ;   
                   break;
                   case 'العاديات':
                   
                   await client.sendMessage(from, quran.q100, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/100.mp3" }, audio) ;   
                   break;
                   case 'القارعة':
                   
                   await client.sendMessage(from, quran.q101, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/101.mp3" }, audio) ;   
                   break;
                   case 'التكاثر':
                   
                   await client.sendMessage(from, quran.q102, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/102.mp3" }, audio) ;   
                   break;
                   case 'العصر':
                   
                   await client.sendMessage(from, quran.q103, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/103.mp3" }, audio) ;    
                   break;
                   case 'الهمزة':
                   
                   await client.sendMessage(from, quran.q104, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/104.mp3" }, audio) ;    
                   break;
                   case 'الفيل':
                   
                   await client.sendMessage(from, quran.q105, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/105.mp3" }, audio) ;   
                   break;
                   case 'قريش':
                   
                   await client.sendMessage(from, quran.q106, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/106.mp3" }, audio) ;   
                   break;
                   case 'الماعون':
                   
                   await client.sendMessage(from, quran.q107, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/107.mp3" }, audio) ;   
                   break;
                   case 'الكوثر':
                   
                   await client.sendMessage(from, quran.q108, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/108.mp3" }, audio) ;    
                   break;
                   case 'الكافرون':
                   
                   await client.sendMessage(from, quran.q109, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/109.mp3" }, audio) ;    
                   break;
                   case 'النصر':
                   
                   await client.sendMessage(from, quran.q110, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/110.mp3" }, audio) ;   
                   break;
                   case 'المسد':
                   
                   await client.sendMessage(from, quran.q111, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/111.mp3" }, audio) ;   
                   break;
                   case 'الإخلاص':
                   
                   await client.sendMessage(from, quran.q112, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/112.mp3" }, audio) ;   
                   break;
                   case 'الفلق':
                   
                   await client.sendMessage(from, quran.q113, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/113.mp3" }, audio) ;   
                   break;
                   case 'الناس':
                   
                   await client.sendMessage(from, quran.q114, text)
                   await client.sendMessage(from, { url: "http://bot.rn0x.com/bot/lib/quran/quranmp3/114.mp3" }, audio) ;   
                   break;
                  
                   
               }




        } 
            catch(error){
             console.log(error)
            }
    
    
    })

// =========================  البروكاست (الإرسال التلقائي للاذكار والفيديو والصور) ==============//


    setInterval(async function(){ 
      const date = new Date(); 


      if ((date.getHours() === 01 && date.getMinutes() === 14) || (date.getHours() === 04 && date.getMinutes() === 00) || (date.getHours() === 07 && date.getMinutes() === 00) || (date.getHours() === 10 && date.getMinutes() === 00)){   
        let chats = await client.chats.array
        for (let lop of chats) {
          let listvideo = videox[Math.floor(Math.random() * videox.length)]          
          await client.sendMessage(lop.jid, { url: listvideo }, MessageType.video)
          .then((result) => { console.log('Result: ', result); })
          .catch((error) => { console.error('Error when sending: ', error); });
        };
      }
      

      else if ((date.getHours() === 02 && date.getMinutes() === 00) || (date.getHours() === 05 && date.getMinutes() === 00) || (date.getHours() === 08 && date.getMinutes() === 00) || (date.getHours() === 11 && date.getMinutes() === 00)){   
        let chats = await client.chats.array
        for (let lop of chats){
          let listadk = adk[Math.floor(Math.random() * adk.length)]       
          await client.sendMessage(lop.jid, listadk, MessageType.text)
          .then((result) => { console.log('Result: ', result); })
          .catch((error) => { console.error('Error when sending: ', error); });
        };
      }

      else if ((date.getHours() === 14 && date.getMinutes() === 00) || (date.getHours() === 17 && date.getMinutes() === 00) || (date.getHours() === 20 && date.getMinutes() === 00) || (date.getHours() === 23 && date.getMinutes() === 00)){   
        let chats = await client.chats.array
        for (let lop of chats){
          let listphoto = photo[Math.floor(Math.random() * photo.length)]          
          await client.sendMessage(lop.jid, { url: listphoto }, MessageType.image)
          .then((result) => { console.log('Result: ', result); })
          .catch((error) => { console.error('Error when sending: ', error); });
        };
      }
           
    } , 60000);
    
   
    
}



// =========================  بدء تشيل البوت  ==============//
start()
.catch (error => console.log("unexpected error: " + error) ) 


/* 
اللهم اجعل هذا العمل صدقة جارية عني وعن أبي و أمي وأهلي وعن المؤنين والمؤمنات اجمعين

*/
