const express = require("express");
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== DISCORD CLIENT =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

let guild = null;

// ===== BOT READY =====
client.once("ready", async () => {
  console.log(`Bot is online as ${client.user.tag}`);
  console.log("API ready");

  // Set status
  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: "Streak Official Dashboard",
        type: ActivityType.Watching
      }
    ]
  });

  // Fetch guild safely
  try {
    guild = await client.guilds.fetch("1514193041802661919");
    console.log("Guild loaded successfully");
  } catch (err) {
    console.log("Failed to load guild:", err);
  }
});

// ===== API ROUTE =====
app.get("/stats", async (req, res) => {
  try {
    if (!guild) {
      return res.status(500).json({ error: "Guild not ready yet" });
    }

    const members = guild.memberCount;

    const online = guild.members.cache.filter(
      (m) => m.presence?.status === "online"
    ).size;

    res.json({
      members,
      online
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

// ===== LOGIN BOT =====
client.login(process.env.TOKEN);
