import { HLTV } from 'hltv';
import TelegramBot from 'node-telegram-bot-api';

export async function handleMatchesCommand(bot: TelegramBot, chatId: number) {
  try {
    const matches = await HLTV.getMatches();
    const upcoming = matches.slice(0, 5); 

    if (upcoming.length === 0) {
      return bot.sendMessage(chatId, 'Nenhuma partida encontrada.');
    }

    const message = upcoming.map(match => {
      const date = match.date ? new Date(match.date).toLocaleString() : "Data não disponível";
      const team1 = match.team1?.name ?? 'TBD';
      const team2 = match.team2?.name ?? 'TBD';
      const event = match.event?.name ?? 'Evento Desconhecido';

      return `🕒 ${date}\n🏆 ${event}\n🆚 ${team1} vs ${team2}`;
    }).join('\n\n');

    await bot.sendMessage(chatId, `🎮 Próximas partidas:\n\n${message}`);
  } catch (error) {
    console.error('Erro ao buscar partidas:', error);
    await bot.sendMessage(chatId, 'Erro ao buscar partidas.');
  }
}
