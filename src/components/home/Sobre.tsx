import { Container, Typography, Box } from '@mui/material';
import Image from 'next/image';
import { ABOUT_SECTION_TOKENS } from '@/theme';
import EmailPerguntandoInteresse from '@/assets/imgs/home/emailPerguntandoInteresse.png';
import FirstBloodDaRinha from '@/assets/imgs/home/firstBloodRinha.png';
import EntregaDoTrofeu from '@/assets/imgs/home/entregaTrofeu.png';

export default function Sobre() {
  return (
    <Container sx={ABOUT_SECTION_TOKENS.sx.pageContainer}>

      <Box sx={ABOUT_SECTION_TOKENS.sx.topicBox}>
        <Typography sx={ABOUT_SECTION_TOKENS.sx.topicTitle}>A origem</Typography>
        <Box sx={ABOUT_SECTION_TOKENS.sx.titleDivider} />

        <Box sx={ABOUT_SECTION_TOKENS.sx.textContainer}>
          <Typography sx={ABOUT_SECTION_TOKENS.sx.topicText}>
            Sentindo a falta de um evento competitivo entre os estudantes do Campus IV, um grupo de amigos decidiu mudar esse cenário.{'\n'}A ideia era simples, mas ambiciosa: criar um torneio de League of Legends onde jogadores pudessem competir ao mesmo tempo em que geravam um entretenimento da mais alta qualidade.
          </Typography>
          <Typography sx={ABOUT_SECTION_TOKENS.sx.topicText}>
            O primeiro passo foi um email enviado ao mercado interno da faculdade perguntando quem teria interesse em participar desse torneio.
          </Typography>
        </Box>

        <Box component="figure" sx={ABOUT_SECTION_TOKENS.sx.figureContainer}>
          <Box sx={ABOUT_SECTION_TOKENS.sx.imageWrapper}>
            <Image
              src={EmailPerguntandoInteresse}
              alt="Email enviado ao Mercado DCX"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>
          <Typography component="figcaption" variant="body2" sx={ABOUT_SECTION_TOKENS.sx.figureCaption}>
            Email enviado ao Mercado DCX (Mercado interno da UFPB)
          </Typography>
        </Box>
      </Box>

      <Box sx={ABOUT_SECTION_TOKENS.sx.topicBox}>
        <Typography sx={ABOUT_SECTION_TOKENS.sx.topicTitle}>A primeira edição</Typography>
        <Box sx={ABOUT_SECTION_TOKENS.sx.titleDivider} />

        <Box sx={ABOUT_SECTION_TOKENS.sx.textContainer}>
          <Typography sx={ABOUT_SECTION_TOKENS.sx.topicText}>
            Um bom número de pessoas manifestou interesse e tivemos 6 equipes inscritas:
          </Typography>
          <Typography sx={{ ...ABOUT_SECTION_TOKENS.sx.topicText, fontFamily: 'var(--font-russo-one)' }}>
            Old Monkeys, Riot Tinto, Caipira's, Os Afundados, PHDPP e Los Coitados.
          </Typography>
          <Typography sx={ABOUT_SECTION_TOKENS.sx.topicText}>
            A competição teve início no dia 01/11/2024, com a partida inaugural entre Riot Tinto e PHDPP. O primeiro abate da competição ficou nas mãos de CLT Abismo, um momento simbólico que marcou o início da Rinha.
          </Typography>
        </Box>

        <Box component="figure" sx={ABOUT_SECTION_TOKENS.sx.figureContainer}>
          <Box sx={ABOUT_SECTION_TOKENS.sx.imageWrapper}>
            <Image
              src={FirstBloodDaRinha}
              alt="First Blood da Rinha"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>
          <Typography component="figcaption" variant="body2" sx={ABOUT_SECTION_TOKENS.sx.figureCaption}>
            First Blood da Rinha pelas mãos do CLT abismo, jogador da equipe PHDPP
          </Typography>
        </Box>
      </Box>

      <Box sx={ABOUT_SECTION_TOKENS.sx.topicBox}>
        <Typography sx={ABOUT_SECTION_TOKENS.sx.topicTitle}>A grande final</Typography>
        <Box sx={ABOUT_SECTION_TOKENS.sx.titleDivider} />

        <Box sx={ABOUT_SECTION_TOKENS.sx.textContainer}>
          <Typography sx={ABOUT_SECTION_TOKENS.sx.topicText}>
            A grande final foi disputada entre Old Monkeys e Caipira's, em uma série melhor de 5. Com um desempenho consistente, a Old Monkeys conquistou o título com um placar de 3x1, sagrando-se a primeira campeã do torneio.
          </Typography>
        </Box>

        <Box component="figure" sx={ABOUT_SECTION_TOKENS.sx.figureContainer}>
          <Box sx={ABOUT_SECTION_TOKENS.sx.imageWrapper}>
            <Image
              src={EntregaDoTrofeu}
              alt="Entrega do troféu da Rinha"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>
          <Typography component="figcaption" variant="body2" sx={ABOUT_SECTION_TOKENS.sx.figureCaption}>
            Entrega da premiação ao capitão da equipe Old Monkeys
          </Typography>
        </Box>
      </Box>

      <Box sx={ABOUT_SECTION_TOKENS.sx.topicBox}>
        <Typography sx={ABOUT_SECTION_TOKENS.sx.topicTitle}>Missão</Typography>
        <Box sx={ABOUT_SECTION_TOKENS.sx.titleDivider} />

        <Box sx={ABOUT_SECTION_TOKENS.sx.textContainer}>
          <Typography sx={ABOUT_SECTION_TOKENS.sx.topicText}>
            A missão da Rinha da UFPB está muito bem definida:
          </Typography>
          <Typography sx={{ ...ABOUT_SECTION_TOKENS.sx.topicText, mt: 2, fontWeight: 'bold' }}>
            Gerar entretenimento da mais alta qualidade para nossos espectadores e promover a interação entre os estudantes da UFPB por meio do esporte.
          </Typography>
        </Box>
      </Box>

      <Box sx={ABOUT_SECTION_TOKENS.sx.topicBox}>
        <Typography sx={ABOUT_SECTION_TOKENS.sx.topicTitle}>Futuro</Typography>
        <Box sx={ABOUT_SECTION_TOKENS.sx.titleDivider} />

        <Box sx={ABOUT_SECTION_TOKENS.sx.textContainer}>
          <Typography sx={ABOUT_SECTION_TOKENS.sx.topicText}>
            A organização da Rinha da UFPB procura sempre tornar o torneio mais atrativo tanto para os espectadores como para os competidores. Para isso, vamos buscar patrocínios com a finalidade de aumentar a premiação e aprimorar a estrutura da Rinha.
            {'\n\n'}
            Também queremos manter uma frequência de campeonatos e expandir para outros jogos competitivos, como CS2 e Valorant, trazendo ainda mais jogadores para a comunidade.
            {'\n\n'}
            E não para por aí!{'\n'}O site vai evoluir junto com o torneio. Em breve, cada jogador vai poder acompanhar suas próprias estatísticas, ver seu desempenho em cada edição e ser visto por outras pessoas. Ou seja, não é só jogar: aqui você vai construir sua história dentro do torneio.
          </Typography>
        </Box>
      </Box>

    </Container>
  );
}