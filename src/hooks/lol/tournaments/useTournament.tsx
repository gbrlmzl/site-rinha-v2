import { apiFetch } from '@/services/interceptor';

export const useTournament = () => {
  const getMyTournaments = async () => {
    try {
      const response = await apiFetch(
        `http://localhost:8080/lol/tournaments/me?game=lol`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      /**
             * Retorno da API(response):
             * public record MyTournamentsSummaryData(
                        Long id,
                        String name,
                        TournamentGame game,
                        TournamentStatus status,
                        OffsetDateTime startsAt
                ) 
             * 
             */
      //Tipar data(dados) e criar uma lista com os objetos do response(MyTournamentSummaryData)
    } catch (err) {
      console.log(err);
    }
  };

  return {
    // Retorna uma lista com o response.json, que é os MyTournament
  };
};
