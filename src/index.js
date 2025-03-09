require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

let streak = 0;
let lastStreakTime = 0;
let twentyFourHourTime = 86400 * 1000;
let graceTime = 86400 * 1000;
let countdownTime = 0;
let interval;
let countdownInterval;

async function sendEphemeralMessage(channel, content, deleteAfterMs = 5000) {
  try {
    const sentMessage = await channel.send(content);
    setTimeout(() => {
      sentMessage
        .delete()
        .catch((err) =>
          console.error("Erreur lors de la suppression du message:", err)
        );
    }, deleteAfterMs);
    return sentMessage;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message éphémère:", error);
  }
}

client.on("messageCreate", function (message) {
  if (message.author.bot) return;

  console.log(`Message reçu : ${message.content}`);

  if (message.content === "gm") {
    const currentTime = Date.now();

    if (streak === 0) {
      streak = 1;
      lastStreakTime = currentTime;

      countdownTime = (twentyFourHourTime + graceTime) / 1000; // Convertir en secondes

      if (countdownInterval) clearInterval(countdownInterval);

      countdownInterval = setInterval(() => {
        countdownTime--;
        if (countdownTime <= 0) {
          streak = 0;
          clearInterval(countdownInterval);
          sendEphemeralMessage(
            message.channel,
            `Votre streak a été réinitialisé à 0, car vous n'avez pas saisi \`gm\` dans la fenêtre de temps autorisée.`,
            20000
          ).catch(console.error);
        }
      }, 1000);

      sendEphemeralMessage(
        message.channel,
        `Streak ${streak} ! Vous avez 24h pour écrire votre prochain "gm" après la période d'attente initiale de 24h.`,
        10000
      ).catch(console.error);

      return;
    }

    if (currentTime - lastStreakTime < twentyFourHourTime) {
      const timeLeft = twentyFourHourTime - (currentTime - lastStreakTime);
      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutesLeft = Math.floor(
        (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
      );
      const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

      sendEphemeralMessage(
        message.channel,
        `Vous devez attendre encore ${hoursLeft} heure(s), ${minutesLeft} minute(s), et ${secondsLeft} seconde(s) avant de pouvoir augmenter votre streak.`,
        15000
      ).catch(console.error);

      return;
    }

    if (
      currentTime - lastStreakTime >= twentyFourHourTime &&
      currentTime - lastStreakTime < twentyFourHourTime + graceTime
    ) {
      streak++;
      lastStreakTime = currentTime;

      countdownTime = (twentyFourHourTime + graceTime) / 1000;

      if (countdownInterval) clearInterval(countdownInterval);

      countdownInterval = setInterval(() => {
        countdownTime--;
        if (countdownTime <= 0) {
          streak = 0;
          clearInterval(countdownInterval);
          sendEphemeralMessage(
            message.channel,
            `Votre streak a été réinitialisé à 0, car vous n'avez pas saisi \`gm\` dans la fenêtre de temps autorisée.`,
            20000
          ).catch(console.error);
        }
      }, 1000);

      sendEphemeralMessage(
        message.channel,
        `Streak ${streak}! Vous avez bien augmenté votre streak. Vous avez maintenant 24h pour écrire votre prochain "gm" après la période d'attente initiale de 24h.`,
        15000
      ).catch(console.error);

      return;
    }

    if (currentTime - lastStreakTime >= twentyFourHourTime + graceTime) {
      streak = 1;
      lastStreakTime = currentTime;

      countdownTime = (twentyFourHourTime + graceTime) / 1000;

      if (countdownInterval) clearInterval(countdownInterval);

      countdownInterval = setInterval(() => {
        countdownTime--;
        if (countdownTime <= 0) {
          streak = 0;
          clearInterval(countdownInterval);
          sendEphemeralMessage(
            message.channel,
            `Votre streak a été réinitialisé à 0, car vous n'avez pas saisi \`gm\` dans la fenêtre de temps autorisée.`,
            20000
          ).catch(console.error);
        }
      }, 1000);

      sendEphemeralMessage(
        message.channel,
        `Votre streak a été réinitialisé à 1 car vous avez dépassé la fenêtre de temps autorisée. Vous avez maintenant 24h pour écrire votre prochain "gm" après la période d'attente initiale de 24h.`,
        15000
      ).catch(console.error);

      return;
    }
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content === "hi") {
    sendEphemeralMessage(message.channel, "Hello!", 5000);
  }
});

client.login(process.env.TOKEN);
