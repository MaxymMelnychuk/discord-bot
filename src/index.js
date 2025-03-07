require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

let streak = 0; 
let lastStreakTime = 0;  
let twentyFourHourTime = 86400 * 1000;  
let countdownTime = 86400; 
let interval;
let countdownInterval;

client.on('messageCreate', function (message) {
    if (message.author.bot) return;

    console.log(`Message reçu : ${message.content}`);

    if (message.content === "gm") {
        const currentTime = Date.now();

        
        if (streak === 0) {
            streak = 1; 
            lastStreakTime = currentTime;  
            countdownTime = 86400;  

           
            countdownInterval = setInterval(() => {
                countdownTime--;
                if (countdownTime <= 0) {
                    
                    streak = 0;
                    clearInterval(countdownInterval);  
                    message.channel.send(`Votre streak a été réinitialisé à 0, car vous n'avez pas saisi \`$streak\` dans la fenêtre de 24 heures.`)
                        .catch(console.error);
                }
            }, 1000);  

            message.channel.send(`Streak ${streak} ! `)
                .catch(console.error);

            return;
        }

       
        if (currentTime - lastStreakTime < twentyFourHourTime) {
            const timeLeft = twentyFourHourTime - (currentTime - lastStreakTime);
            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

            
            message.channel.send(`Vous devez attendre encore ${hoursLeft} heure(s), ${minutesLeft} minute(s), et ${secondsLeft} seconde(s) avant de pouvoir augmenter votre streak.`)
                .catch(console.error);

            return;
        }

        
        if (currentTime - lastStreakTime >= twentyFourHourTime) {
            streak++;  
            lastStreakTime = currentTime;  
            countdownTime = 86400;  

           
            clearInterval(countdownInterval);
            countdownInterval = setInterval(() => {
                countdownTime--;
                if (countdownTime <= 0) {
                    
                    streak = 0;
                    clearInterval(countdownInterval);  
                    message.channel.send(`Votre streak a été réinitialisé à 0, car vous n'avez pas saisi \`$streak\` dans la fenêtre de 24 heures.`)
                        .catch(console.error);
                }
            }, 1000);

            message.channel.send(`Streak ${streak}! Vous avez bien augmenté votre streak. Vous avez maintenant une nouvelle période de 24 heures pour saisir \`$streak\` et augmenter encore votre streak.`)
                .catch(console.error);

            return;
        }

       
        clearInterval(interval);
        interval = setInterval(() => {
            streak = 0; 
        }, 86400 * 1000);
    }
});



client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }

    if (message.content === 'hi') {
        message.reply('Hello!');
    }
});

client.login(process.env.TOKEN);