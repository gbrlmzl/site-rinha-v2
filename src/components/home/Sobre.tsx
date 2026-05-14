import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import type { ReactNode } from 'react';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { ABOUT_SECTION_TOKENS } from '@/theme';
import EmailPerguntandoInteresse from '@/assets/imgs/home/emailPerguntandoInteresse.png';
import FirstBloodDaRinha from '@/assets/imgs/home/firstBloodRinha.png';
import EntregaDoTrofeu from '@/assets/imgs/home/entregaTrofeu.png';
import QuemSomos from '@/components/home/QuemSomos/QuemSomos';

const sx = ABOUT_SECTION_TOKENS.sx;

type HistoryEvent = {
  date: string;
  title: string;
  paragraphs: ReactNode[];
  image: {
    src: typeof EmailPerguntandoInteresse;
    alt: string;
    caption: string;
  };
};

const HISTORY: HistoryEvent[] = [
  {
    date: 'Outubro · 2024',
    title: 'A origem',
    paragraphs: [
      <>
        Sentindo a falta de um evento competitivo entre os estudantes do Campus
        IV, um grupo de amigos decidiu mudar esse cenário.{'\n'}A ideia era
        simples, mas ambiciosa: criar um torneio de League of Legends onde
        jogadores pudessem competir ao mesmo tempo em que geravam um
        entretenimento da mais alta qualidade para os espectadores.
      </>,
      <>
        O primeiro passo foi um email enviado ao mercado interno da faculdade
        perguntando quem teria interesse em participar desse torneio.
      </>,
    ],
    image: {
      src: EmailPerguntandoInteresse,
      alt: 'Email enviado ao Mercado DCX',
      caption: 'Email enviado ao Mercado DCX (Mercado interno da UFPB)',
    },
  },
  {
    date: '01 · 11 · 2024',
    title: 'A primeira edição',
    paragraphs: [
      <>Um bom número de pessoas manifestou interesse e tivemos 6 equipes inscritas:</>,
      <Box component="span" sx={sx.topicTextEmphasis} key="teams">
        Old Monkeys, Riot Tinto, Caipira&apos;s, Os Afundados, PHDPP e Los Coitados.
      </Box>,
      <>
        A competição teve início no dia 01/11/2024, com a partida inaugural
        entre Riot Tinto e PHDPP. O primeiro abate da competição ficou nas mãos
        de CLT Abismo, um momento simbólico que marcou o início da Rinha.
      </>,
    ],
    image: {
      src: FirstBloodDaRinha,
      alt: 'First Blood da Rinha',
      caption: 'First Blood da Rinha pelas mãos do CLT abismo, jogador da equipe PHDPP',
    },
  },
  {
    date: '21 · 11 · 2024',
    title: 'A grande final',
    paragraphs: [
      <>
        A grande final foi disputada entre Old Monkeys e Caipira&apos;s, em uma
        série melhor de 5. Com um desempenho consistente, a Old Monkeys
        conquistou o título com um placar de 3x1, sagrando-se a primeira
        campeã do torneio.
      </>,
    ],
    image: {
      src: EntregaDoTrofeu,
      alt: 'Entrega do troféu da Rinha',
      caption: 'Entrega da premiação ao capitão da equipe Old Monkeys',
    },
  },
];

export default function Sobre() {
  return (
    <Container sx={sx.pageContainer}>
      {/* Hero */}
      <Box sx={sx.hero}>
        <Typography sx={sx.heroEyebrow}>Conheça a Rinha</Typography>
        <Typography component="h1" sx={sx.heroTitle}>
          A história da Rinha
        </Typography>
        <Typography sx={sx.heroSubtitle}>
          De um e-mail no mercado interno do campus a um torneio com equipes,
          transmissão e troféu — essa é a história, as pessoas e a missão
          por trás da Rinha da UFPB.
        </Typography>

        <Box sx={sx.heroStatsRow}>
          <Box sx={sx.heroStatChip}>
            <EmojiEventsRoundedIcon sx={{ fontSize: 18 }} />
            <Box component="span" sx={sx.heroStatValue}>1</Box>
            edição realizada
          </Box>
          <Box sx={sx.heroStatChip}>
            <CalendarTodayRoundedIcon sx={{ fontSize: 18 }} />
            <Box component="span" sx={sx.heroStatValue}>2024</Box>
            ano de fundação
          </Box>
        </Box>
      </Box>

      {/* Conector hero → primeira edição */}
      <Box sx={sx.timelineConnector} aria-hidden />

      {/* Timeline da história */}
      <Box sx={sx.timelineWrapper}>
        {HISTORY.map((event, idx) => (
          <Box key={event.title}>
            {idx > 0 && <Box sx={sx.timelineConnector} aria-hidden />}

            <Box sx={sx.topicBox}>
              <Box sx={sx.timelineDateBadge}>{event.date}</Box>
              <Typography sx={sx.topicTitle}>{event.title}</Typography>
              <Box sx={sx.titleDivider} />

              <Box sx={sx.textContainer}>
                {event.paragraphs.map((p, i) => (
                  <Typography key={i} sx={sx.topicText} component="div">
                    {p}
                  </Typography>
                ))}
              </Box>

              <Box component="figure" sx={sx.figureContainer}>
                <Box sx={sx.imageWrapper}>
                  <Image
                    src={event.image.src}
                    alt={event.image.alt}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </Box>
                <Typography
                  component="figcaption"
                  variant="body2"
                  sx={sx.figureCaption}
                >
                  {event.image.caption}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <QuemSomos />

      {/* Missão — card destacado */}
      <Box sx={sx.topicBox}>
        <Typography sx={sx.topicTitle}>Missão</Typography>
        <Box sx={sx.titleDivider} />

        <Box sx={sx.missionCard}>
          <Typography sx={sx.missionLead}>
            A missão da Rinha da UFPB está muito bem definida:
          </Typography>
          <Typography sx={sx.missionStatement}>
            Gerar entretenimento da mais alta qualidade para nossos espectadores
            e promover a interação entre os estudantes da UFPB por meio do
            esporte.
          </Typography>
        </Box>
      </Box>

      {/* Futuro */}
      <Box sx={sx.topicBox}>
        <Typography sx={sx.topicTitle}>Futuro</Typography>
        <Box sx={sx.titleDivider} />

        <Box sx={sx.textContainer}>
          <Typography sx={sx.topicText}>
            A organização da Rinha da UFPB procura sempre tornar o torneio mais
            atrativo tanto para os espectadores como para os competidores. Para
            isso, vamos buscar patrocínios com a finalidade de aumentar a
            premiação e aprimorar a estrutura da Rinha.
            {'\n\n'}
            Também queremos manter uma frequência de campeonatos e expandir
            para outros jogos competitivos, como CS2 e Valorant, trazendo ainda
            mais jogadores para a comunidade.
            {'\n\n'}
            E não para por aí!{'\n'}O site vai evoluir junto com o torneio. Em
            breve, cada jogador vai poder acompanhar suas próprias estatísticas,
            ver seu desempenho em cada edição e ser visto por outras pessoas.
            Ou seja, não é só jogar: aqui você vai construir sua história dentro
            do torneio.
          </Typography>
        </Box>
      </Box>

    </Container>
  );
}
