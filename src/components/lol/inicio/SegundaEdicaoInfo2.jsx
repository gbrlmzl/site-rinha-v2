import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import gravesBackground from "@/assets/imgs/gravesSplashFHD.svg";
import gravesBackgroundMobile from "@/assets/imgs/gravesSplashMobile.svg";
import Link from "next/link";

function InfoBox() {
  return (
    <Box sx={{ position: "relative", width: "100vw", height: { xs: "140vh", md: "100vh" }, overflowX: "hidden" }}>

      <Box sx={{ display: { xs: "none", lg: "block" } }}> {/* Imagem de fundo para telas grandes */}
        <Image
          src={gravesBackground}
          alt="Graves"
          fill
          style={{

            objectFit: "cover",
            objectPosition: "top right",
          }}
          priority
        />

      </Box>


      <Box sx={{
        display: {
          xs: "block", lg: "none", "& img": {
            objectFit: "cover",
            objectPosition: "bottom right",
            "@media (max-height: 750px)": {
              objectPosition: "top right",
              marginTop: "0vh",
            }
          }
        }
      }}> {/* Imagem de fundo para telas pequenas */}

        <Image
          src={gravesBackgroundMobile}
          alt="Graves"
          fill

          priority
        />



      </Box>




      {/* Texto por cima da imagem em telas grandes*/}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "60vw",
          height: "100%",
          px: { md: 6, lg: 8 },
          pt: { s: 10, md: 10, lg: 15, xl: 15 },
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "flex-start",
          alignContent: "flex-start",
          justifyContent: "flex-start",

          color: "white",
          textAlign: "center",
          flexWrap: "wrap",
          p: 2,
        }}
      >
        <Typography fontFamily={"Russo one"} fontSize={"2.75rem"} sx={{ fontWeight: "bold", mb: 4 }}>
          A SEGUNDA EDIÇÃO VEM AÍ!
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", gap: 2, maxWidth: "30vw", mb: 4 }}>
          <Typography variant="subtitleWhite">
            É isso mesmo, meus amigos.
          </Typography>
          <Typography variant="text2White" fontSize={"1.1125rem"} textAlign={"left"}>
            Formem suas equipes e se preparem, porque no dia <Typography component="span" fontSize={"1.1125rem"} fontWeight="bold" color="cyan"> 12 de maio </Typography> começa a segunda edição da Rinha do Campus IV!
          </Typography>
          <Typography variant="subtitleWhite" >
            Dessa vez, com um novo formato:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            <Typography >
              ● PLAY-IN COM FASE DE GRUPOS
            </Typography>
            <Typography>
              ● PLAYOFFS COM CHAVE SUPERIOR E CHAVE INFERIOR
            </Typography>
            <Typography>
              ● JOGOS NO PERÍODO NOTURNO (19H ÀS 22H)
            </Typography>

            <Typography>
              ● CADA EQUIPE PODE TER ATÉ 3 JOGADORES (INCLUINDO O RESERVA) DE FORA DO CAMPUS.
            </Typography>
          </Box>

        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "30vw", }}>
          <Link href="/lol/inscricoes" passHref>
            <Button variant="contained" size="large" sx={{ borderRadius: 5, px: 4, py: 1, fontSize: "1.25rem", fontFamily: "Russo One", fontWeight: "bold", ":hover": { backgroundColor: "#0051E6", color: "white" } }}>
              INSCREVA SUA EQUIPE
            </Button>
          </Link>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: 0.5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mb: 0.5 }}>
              <Typography variant="text2White" fontSize={"0.8rem"} >
                Ainda não tem uma equipe?
              </Typography>
            </Box>

          </Box>
          <Box sx={{ mt: 0.5 }}>
            <Typography fontSize={"0.8rem"} fontFamily={"Roboto"}>
              O período de inscrições vai até o dia <Typography component="span" fontSize={"0.8rem"} fontWeight="bold" color="cyan"> 8 de maio </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Texto por cima da imagem em telas pequenas*/}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          //height: "100%",
          px: { xs: 4, sm: 6 },
          pt: { xs: 15, sm: 15 },
          display: { xs: "flex", md: "none" },
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "flex-start",
          color: "white",
          textAlign: "center",
          flexWrap: "wrap",
          p: 2,
        }}
      >
        <Typography fontFamily={"Russo one"} fontSize={"1.4rem"} sx={{ fontWeight: "bold", mb: 2 }}>
          A SEGUNDA EDIÇÃO VEM AÍ!
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1.5, /*maxWidth:"30vw",*/ mb: 4 }}>
          <Typography variant="subtitleWhite" fontSize={"1.1125rem"}>
            É isso mesmo, meus amigos.
          </Typography>
          <Typography variant="text2White" fontSize={"0.9rem"}>
            Formem suas equipes e se preparem, porque no dia <Typography component="span" fontSize={"0.9rem"} fontWeight="bold" color="cyan"> 12 de maio </Typography> começa a segunda edição da Rinha do Campus IV!
          </Typography>
          <Box>

          </Box>


          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Link href="/lol/inscricoes" passHref>
              <Button variant="contained" size="large" sx={{ borderRadius: 5, mt: 2, px: 4, py: 1, fontSize: "1rem", fontFamily: "Russo One", fontWeight: "bold", ":hover": { backgroundColor: "#0051E6", color: "white" }, }}>
                INSCREVA SUA EQUIPE
              </Button>
            </Link>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: "0.20rem" }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mb: "0.20 rem" }}>
                <Typography variant="text2White" fontSize={"0.75rem"} >
                  Ainda não tem uma equipe?
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography fontSize={"0.75rem"} fontFamily={"Roboto"} mt={0.25}>
                O período de inscrições vai até o dia <Typography component="span" fontSize={"0.75rem"} fontWeight="bold" color="cyan"> 8 de maio </Typography>
              </Typography>
            </Box>
          </Box>

        </Box>



      </Box>
    </Box>
  );
}

export default InfoBox;
