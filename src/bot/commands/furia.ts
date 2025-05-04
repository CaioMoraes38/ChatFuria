import { HLTV } from 'hltv';

export interface PlayerStats {
  fullName: string;
  nickname: string;
  team: string;
  age: string | number;
  rating: string | number;
  impact: string | number;
  dpr: string | number;
  adr: string | number;
  kast: string | number;
  kpr: string | number;
  headshots: string | number;
  mapsPlayed: string | number;
  image: string;
}

export async function getFuriaTeams() {
  try {
    const furiaId = 8297;     // FURIA masculina
    const furiaFeId = 11661;  // FURIA feminina

    const [teamMale, teamFemale] = await Promise.all([
      HLTV.getTeam({ id: furiaId }),
      HLTV.getTeam({ id: furiaFeId })
    ]);

    const malePlayers = teamMale.players.map(player => player.name).join('\n');
    const femalePlayers = teamFemale.players.map(player => player.name).join('\n');

    return {
      malePlayers,
      femalePlayers
    };
  } catch (error) {
    console.error('Erro ao buscar jogadores da FURIA:', error);
    throw new Error('Erro ao buscar informações da FURIA.');
  }
}

export async function getPlayerStats(playerName: string): Promise<PlayerStats> {
  try {
    const playerSearch = await HLTV.getPlayerByName({ name: playerName });

    if (!playerSearch || !playerSearch.id) {
      throw new Error(`Jogador ${playerName} não encontrado.`);
    }

    const rawStats = await HLTV.getPlayer({ id: playerSearch.id });
    const stats = rawStats as any;

    return {
      fullName: stats.name || 'N/A',
      nickname: stats.nick || stats.nickname || 'N/A',
      team: stats.team?.name || 'Sem time',
      age: stats.age || 'N/A',
      rating: stats.statistics?.rating || 'N/A',
      impact: stats.statistics?.impact || 'N/A',
      dpr: stats.statistics?.dpr || 'N/A',
      adr: stats.statistics?.adr || 'N/A',
      kast: stats.statistics?.kast || 'N/A',
      kpr: stats.statistics?.kpr || 'N/A',
      headshots: stats.statistics?.headshots || 'N/A',
      mapsPlayed: stats.statistics?.mapsPlayed || 'N/A',
      image: stats.image || ''
    };
  } catch (error) {
    console.error(`Erro ao buscar estatísticas de ${playerName}:`, error);
    throw new Error(`Erro ao buscar estatísticas de ${playerName}.`);
  }
}
