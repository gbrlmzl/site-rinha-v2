'use client';

import { useState } from 'react';
import { getAdminTournamentById } from '@/services/admin/adminTournamentService';

export interface TournamentExtraDetails {
  description: string | null;
  createdAt: string;
  rulesUrl: string;
}

/**
 * Encapsula o "expandir card/linha de torneio" do admin: estado aberto/fechado +
 * carregamento lazy dos detalhes (description/createdAt/rulesUrl) só na primeira expansão.
 */
export function useTournamentExpandedDetails(tournamentId: number) {
  const [expanded, setExpanded] = useState(false);
  const [extra, setExtra] = useState<TournamentExtraDetails | null>(null);

  const toggle = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && !extra) {
      const detail = await getAdminTournamentById(tournamentId);
      setExtra({
        description: detail.description ?? null,
        createdAt: detail.createdAt,
        rulesUrl: detail.rulesUrl,
      });
    }
  };

  return { expanded, extra, toggle };
}
