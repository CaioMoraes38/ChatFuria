import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config/config';
import { getFuriaTeams, getPlayerStats } from './commands/furia';

let mainMenuMessageId: number | null = null; // Variável para armazenar o ID da mensagem principal

export function startBot() {
  const bot = new TelegramBot(config.telegramToken, { polling: true });

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const message = `🔥 Bem-vindo! Escolha uma opção abaixo:`;

      const options = {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Jogadores do Time', callback_data: 'list_players' }],
            [{ text: 'Estatísticas do Time', callback_data: 'team_stats' }],
            [{ text: 'Acompanhe Jogos ao Vivo', callback_data: 'live_games' }],
            [{ text: 'Calendário de Jogos', callback_data: 'game_calendar' }],
            [{ text: 'Lojinha da Pantera', callback_data: 'furia_store' }],
            [{ text: 'Esports News / Trend Topics', callback_data: 'esports_news' }],
            [{ text: 'Criadores de Conteúdo e Streamers', callback_data: 'content_creators' }],
            [{ text: 'FURIA Cash', callback_data: 'furia_cash' }],
            [{ text: 'Sobre o Bot', callback_data: 'about_bot' }],
            [{ text: 'Ajuda', callback_data: 'help' }]
          ]
        }
      };

      const sentMessage = await bot.sendMessage(chatId, message, options);
      mainMenuMessageId = sentMessage.message_id; // Armazena o ID da mensagem principal
    } catch (error) {
      console.error(error);
      await bot.sendMessage(chatId, 'Erro ao processar sua solicitação.');
    }
  });

  // Callback dos botões
  bot.on('callback_query', async (query) => {
    const chatId = query.message?.chat.id;

    if (!query.data || !chatId || mainMenuMessageId === null) return;

    try {
      const currentMessageText = query.message?.text || '';

      if (query.data === 'start') {
        // Voltar ao menu principal
        const message = `🔥 Bem-vindo! Escolha uma opção abaixo:`;

        await bot.editMessageText(message, {
          chat_id: chatId,
          message_id: mainMenuMessageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Jogadores do Time', callback_data: 'list_players' }],
              [{ text: 'Estatísticas do Time', callback_data: 'team_stats' }],
              [{ text: 'Acompanhe Jogos ao Vivo', callback_data: 'live_games' }],
              [{ text: 'Calendário de Jogos', callback_data: 'game_calendar' }],
              [{ text: 'Lojinha da Pantera', callback_data: 'furia_store' }],
              [{ text: 'Esports News / Trend Topics', callback_data: 'esports_news' }],
              [{ text: 'Criadores de Conteúdo e Streamers', callback_data: 'content_creators' }],
              [{ text: 'FURIA Cash', callback_data: 'furia_cash' }],
              [{ text: 'Sobre o Bot', callback_data: 'about_bot' }],
              [{ text: 'Ajuda', callback_data: 'help' }]
            ]
          }
        });
      } else if (query.data === 'list_players') {
        const { malePlayers, femalePlayers } = await getFuriaTeams();

        const addFlag = (player: string) => {
          // Verifica se o nome do jogador já contém uma bandeira
          if (player.includes('🇰🇿') || player.includes('🇱🇻') || player.includes('🇧🇷')) {
            return player; // Retorna o nome sem modificar
          }

          if (player.toLowerCase() === 'molodoy') return `🇰🇿 ${player}`; // Cazaquistão
          if (player.toLowerCase() === 'yekindar') return `🇱🇻 ${player}`; // Letônia
          return `🇧🇷 ${player}`; // Brasil
        };

        const playerButtons = {
          reply_markup: {
            inline_keyboard: [
              ...malePlayers.split('\n').map(player => [{
                text: addFlag(player),
                callback_data: `player_${player}`
              }]),
              ...femalePlayers.split('\n').map(player => [{
                text: addFlag(player),
                callback_data: `player_${player}`
              }]),
              [{ text: 'Voltar ao Menu', callback_data: 'start' }]
            ]
          }
        };

        const newMessageText = 'Selecione um jogador para ver as estatísticas:';
        await bot.editMessageText(newMessageText, {
          chat_id: chatId,
          message_id: mainMenuMessageId,
          ...playerButtons
        });

      } else if (query.data === 'team_stats') {
        const newMessageText = '🚀 Estatísticas do time FURIA ainda estão em desenvolvimento.';
        await bot.editMessageText(newMessageText, {
          chat_id: chatId,
          message_id: mainMenuMessageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Jogadores do Time', callback_data: 'list_players' }],
              [{ text: 'Voltar ao Menu', callback_data: 'start' }]
            ]
          }
        });

      } else if (query.data === 'live_games') {
        const liveGamesMessage = `
🎯 Jogos ao Vivo:
- FURIA vs NAVI (CS:GO) - 18:00
- FURIA vs LOUD (Valorant) - 20:00
        `;
        await bot.editMessageText(liveGamesMessage, {
          chat_id: chatId,
          message_id: mainMenuMessageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Voltar ao Menu', callback_data: 'start' }]
            ]
          }
        });

      } else if (query.data === 'game_calendar') {
        const calendarMessage = `
📅 Calendário de Jogos:
- 05/05/2025: FURIA vs NAVI (CS:GO)
- 06/05/2025: FURIA vs LOUD (Valorant)
- 07/05/2025: FURIA vs MIBR (CS:GO)
        `;
        await bot.editMessageText(calendarMessage, {
          chat_id: chatId,
          message_id: mainMenuMessageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Voltar ao Menu', callback_data: 'start' }]
            ]
          }
        });

      } else if (query.data === 'furia_store') {
        const storeMessage = `
🛒 Lojinha da Pantera:
- Camiseta Oficial FURIA: R$ 99,90
- Boné FURIA: R$ 49,90
- Mousepad FURIA: R$ 79,90
        `;
        await bot.editMessageText(storeMessage, {
          chat_id: chatId,
          message_id: mainMenuMessageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Voltar ao Menu', callback_data: 'start' }]
            ]
          }
        });

      } else if (query.data === 'esports_news') {
        const newsMessage = `
📰 Esports News / Trend Topics:
- FURIA sobe para o Top 5 no ranking mundial de CS:GO.
- FURIA Valorant avança para os playoffs do VCT.
        `;
        await bot.editMessageText(newsMessage, {
          chat_id: chatId,
          message_id: mainMenuMessageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Voltar ao Menu', callback_data: 'start' }]
            ]
          }
        });

      } else if (query.data === 'content_creators') {
        const creatorsMessage = `
🎥 Criadores de Conteúdo e Streamers:
- Gaules (CS:GO)
- FalleN (CS:GO)
- Babi (Valorant)
        `;
        await bot.editMessageText(creatorsMessage, {
          chat_id: chatId,
          message_id: mainMenuMessageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Voltar ao Menu', callback_data: 'start' }]
            ]
          }
        });

      } else if (query.data === 'furia_cash') {
        const cashMessage = `
🤑 FURIA Cash:
- Ganhe pontos ao comprar na loja oficial.
- Troque pontos por descontos e brindes exclusivos.
        `;
        await bot.editMessageText(cashMessage, {
          chat_id: chatId,
          message_id: mainMenuMessageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Voltar ao Menu', callback_data: 'start' }]
            ]
          }
        });

      } else if (query.data.startsWith('player_')) {
        const playerName = query.data.replace('player_', '').trim();

        try {
          const stats = await getPlayerStats(playerName);

          const statsMessage = `
📊 Estatísticas de ${stats.nickname} (${stats.fullName}):
- Time Atual: ${stats.team}
- Idade: ${stats.age}
- Rating: ${stats.rating}
- Impacto: ${stats.impact || 'N/A'}
- DPR: ${stats.dpr || 'N/A'}
- ADR: ${stats.adr || 'N/A'}
- KAST: ${stats.kast || 'N/A'}%
- KPR: ${stats.kpr || 'N/A'}
- Headshots: ${stats.headshots || 'N/A'}%
- Maps Jogados: ${stats.mapsPlayed || 'N/A'}
          `;

          if (stats.image) {
            await bot.sendPhoto(chatId, stats.image, {
              caption: statsMessage,
              reply_markup: {
                inline_keyboard: [
                  [{ text: 'Voltar ao Menu', callback_data: 'start' }]
                ]
              }
            });
          } else {
            await bot.editMessageText(statsMessage, {
              chat_id: chatId,
              message_id: mainMenuMessageId,
              reply_markup: {
                inline_keyboard: [
                  [{ text: 'Voltar ao Menu', callback_data: 'start' }]
                ]
              }
            });
          }
        } catch (error) {
          console.error(error);
          await bot.sendMessage(chatId, `Erro ao buscar estatísticas de ${playerName}.`);
        }
      }

      await bot.answerCallbackQuery(query.id);
    } catch (error) {
      console.error(error);
      await bot.sendMessage(chatId, 'Erro ao processar o comando.');
    }
  });

  console.log('🤖 Bot do Telegram iniciado!');
}