'use client';

import { useAuthContext } from "@/contexts/AuthContext";
import { useTournament } from "@/hooks/lol/tournaments/useTournament";
import { Box } from "@mui/material";
import { useEffect } from "react";

export default function TorneioHome() {
    const { user, isAuthenticated, isLoading } = useAuthContext();

    const {

    } = useTournament();

    useEffect(() => {
        if (isAuthenticated) {
            //Chamar método para buscar listas de inscrições da api(MyTournament)
            findMyTournaments():
        }
    }, [isAuthenticated,]);

    return (
        <Box>
            <Box>
                {/**
                 Seção de Competições Ativas(MyTournament)
                 -> Aqui o usuário LOGADO conseguirá visualizar os torneios em que ele está INSCRITO, com inscrição confirmada ou pendente.
                 -> 
                 */}
            </Box>
            <Box>
                {
                    /**
                     * Aqui é a seção dos próximos Torneios
                     * Regra: Mesmo o usuário não autenticado deve ter acesso aos próximos torneios, e ao participe(detalhar)
                     * Gerar Componente: TournamentResume com as respectivas props tipadas
                     */
                }
            </Box>
        </Box>
    )
}
