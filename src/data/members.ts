export type Member = {
  id: string;
  realName: string;
  nickname: string;
  githubUser: string;
  role: string;
  /** Frase curta exibida no próprio card (1 linha, ~80 chars). */
  shortBio: string;
  /** Texto completo exibido no modal de detalhes. */
  bio: string;
};

// O avatar é resolvido automaticamente via https://github.com/{githubUser}.png
export const MEMBERS: Member[] = [
  {
    id: 'gbrlmzl',
    realName: 'Gabriel Mizael',
    nickname: 'Hot For Teacher',
    githubUser: 'gbrlmzl',
    role: 'Fundador',
    shortBio: 'Idealizador da Rinha — placeholder editável.',
    bio: 'Descrição mais detalhada sobre a atuação deste membro na Rinha — substituir manualmente.',
  },
  {
    id: 'victorhugosalv',
    realName: 'Victor Hugo Salviano',
    nickname: 'Chico Kit Laska',
    githubUser: 'victorhugosalv',
    role: 'Desenvolvedor e DevOps',
    shortBio: 'Cooperador na construção da plataforma — placeholder editável.',
    bio: 'Descrição mais detalhada sobre a atuação deste membro na Rinha — substituir manualmente.',
  },
  {
    id: 'ryanpsouzaa',
    realName: 'Ryan Pereira',
    nickname: 'foxyTpk',
    githubUser: 'ryanpsouzaa',
    role: 'Desenvolvedor e Narrador',
    shortBio: 'Voz e código por trás das transmissões — placeholder editável.',
    bio: 'Descrição mais detalhada sobre a atuação deste membro na Rinha — substituir manualmente.',
  },
  {
    id: 'JohnWesleyPinto',
    realName: 'John Wesley',
    nickname: 'john',
    githubUser: 'JohnWesleyPinto',
    role: 'Organizador e Comentarista',
    shortBio: 'Logística do torneio e análises ao vivo — placeholder editável.',
    bio: 'Descrição mais detalhada sobre a atuação deste membro na Rinha — substituir manualmente.',
  },
  {
    id: 'JoseRyanBeserra',
    realName: 'José Ryan',
    nickname: 'albed0o',
    githubUser: 'JoseRyanBeserra',
    role: 'Comentarista',
    shortBio: 'Análises e leitura de partidas — placeholder editável.',
    bio: 'Descrição mais detalhada sobre a atuação deste membro na Rinha — substituir manualmente.',
  },
];
