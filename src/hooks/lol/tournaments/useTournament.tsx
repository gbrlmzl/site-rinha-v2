import { apiFetch } from '@/services/interceptor';
import {
  MyTournamentsSummaryData,
  Page,
  TournamentDetailData,
  TournamentPublicSummaryData,
} from '@/types/lol/tournaments/tournament';

export const useTournament = () => {
  const getMyTournaments = async (game: string): Promise<Page<MyTournamentsSummaryData> | undefined> => {
    try {
      const response = await apiFetch(
        `http://localhost:8080/tournaments/me?game=${game}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error();
      }

      const data: Page<MyTournamentsSummaryData> = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const getPublicTournaments = async (
    game: string
  ): Promise<Page<TournamentPublicSummaryData> | undefined> => {
    try {
      const response = await fetch(
        `http://localhost:8080/tournaments?game=${game}&status=OPEN,FULL,ONGOING&size=50`,
        { method: 'GET' }
      );
      if (!response.ok) throw new Error();
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Fetches full tournament detail by numeric ID (public endpoint).
   */
  const getTournamentDetail = async (
    id: number
  ): Promise<TournamentDetailData | undefined> => {
    try {
      const response = await fetch(`http://localhost:8080/tournaments/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error();
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Fetches full tournament detail by slug (public endpoint, sends cookies
   * for auth so the backend can include the caller's team status if logged in).
   */
  const getTournamentDetailBySlug = async (
    slug: string
  ): Promise<TournamentDetailData | undefined> => {
    try {
      const response = await fetch(
        `http://localhost:8080/tournaments/slug/${slug}`,
        { method: 'GET', credentials: 'include' }
      );
      if (!response.ok) throw new Error();
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };

  return { getMyTournaments, getPublicTournaments, getTournamentDetail, getTournamentDetailBySlug };
};
