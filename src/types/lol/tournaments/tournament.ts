export interface SubscribeTournamentResume{
    status: string
    name: string
    teamName: string
}

export interface SubscribeTournamentPendent extends SubscribeTournamentResume{
    expiresAt: string
}

