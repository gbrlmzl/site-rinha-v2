export type Member = {
  id: string;
  realName: string;
  nickname: string;
  githubUser: string;
  roles: string[];
  /** Frase curta exibida no próprio card (1 linha, ~80 chars). */
  //shortBio: string;
  /** Texto completo exibido no modal de detalhes. */
  bio: string;
};

// O avatar é resolvido automaticamente via https://github.com/{githubUser}.png
export const MEMBERS: Member[] = [
  {
    id: 'gbrlmzl',
    realName: 'Gabriel Mizael',
    nickname: 'hot for teacher',
    githubUser: 'gbrlmzl',
    roles: ['Fundador'],
    //shortBio: 'Idealizador da Rinha',
    bio: 'Metallica'
  },
  {
    id: 'victorhugosalv',
    realName: 'Victor Hugo Salviano',
    nickname: 'Chico Kit Laska',
    githubUser: 'victorhugosalv',
    roles: ['Desenvolvedor', 'DevOps'],
    //shortBio: 'Cooperador na construção da plataforma',
    bio: 'Descrição mais detalhada sobre a atuação deste membro na Rinha.',
  },
  {
    id: 'JohnWesleyPinto',
    realName: 'John Wesley',
    nickname: 'ImaBit',
    githubUser: 'JohnWesleyPinto',
    roles: ['Co-Fundador', 'Comentarista'],
    //shortBio: 'Logística do torneio e comentarista',
    bio: 'Descrição mais detalhada sobre a atuação deste membro na Rinha',
  },
  {
    id: 'ryanpsouzaa',
    realName: 'Ryan Pereira',
    nickname: 'foxyTpk',
    githubUser: 'ryanpsouzaa',
    roles: ['Desenvolvedor', 'Narrador'],
    //shortBio: 'Narrador principal e colaborador no desenvolvimento da plataforma',
    bio: 'Descrição mais detalhada sobre a atuação deste membro na Rinha.',
  },
  {
    id: 'JoseRyanBeserra',
    realName: 'José Ryan',
    nickname: 'Albed0o',
    githubUser: 'JoseRyanBeserra',
    roles: ['Comentarista'],
    //shortBio: 'Análises e leitura de partidas durante as transmissões',
    bio: 'Descrição mais detalhada sobre a atuação deste membro na Rinha',
  },
];
