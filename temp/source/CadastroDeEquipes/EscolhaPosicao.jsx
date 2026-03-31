import React, { useState } from "react";
import { Menu, MenuItem, Backdrop, IconButton, Stack, Box, ButtonBase } from "@mui/material";
import Image from "next/image"; // Importando o componente Image
import TopIcon from "../../assets/icons/Position-Top.png";
import JungleIcon from "../../assets/icons/Position-Jungle.png";
import MidIcon from "../../assets/icons/Position-Mid.png";
import ADCIcon from "../../assets/icons/Position-Bot.png";
import SupportIcon from "../../assets/icons/Position-Support.png";




function EscolhaPosicao({onChange, defaultIcon}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
   // Estado local para a posição padrão
  
   // Mapeamento de posições para os caminhos das imagens
   


  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleSelectPosicao = (value) => {
    onChange(value); // Atualiza o estado global com a posição selecionada
    handleCloseMenu();
  };

  return (
    <Box mt={2}>
      {/* Ícone para abrir o menu */}
      <IconButton onClick={handleOpenMenu} color="primary"
      sx={{
        backgroundColor: "#E3E3E3", // Cor de fundo
        borderRadius: "50%", // Torna o fundo circular
        padding: "10px", // Espaçamento interno
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.35)", // Sombra para destaque
        "&:hover": {
          backgroundColor: "#e0e0e0", // Cor de fundo ao passar o mouse
        },
      }}
       >
      
    <Box 
        sx={{
          width: { xs: 40, md: 55 }, // Largura do ícone em px
          height: { xs: 40, md: 55 },
          position: "relative", // necessário para usar layout="fill"
        }} >  
      <Image src={defaultIcon} alt="Selecionar posição"  fill style={{objectFit:"contain"}}/> 
    </Box>
  
        {/* Ícone de exemplo */}
      </IconButton>

      {/* Backdrop para escurecer o fundo */}
      <Backdrop open={menuOpen} onClick={handleCloseMenu} style={{ zIndex: 1 }} />

      {/* Menu de seleção */}

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
          
          }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
         
        }}
         
        
        slotProps={{
            paper: {
              sx: {
                gap: 1, // Espaçamento entre os itens
                // Espaçamento interno do menu
                //backgroundColor: "#000000",//"#0A96AA", // Cor de fundo personalizada
                backgroundImage: "linear-gradient(to bottom,#F5F5F5,rgb(100, 100, 100))", // Gradiente de fundo
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.35)", // Sombra para destaque
                borderRadius: "8px", // Bordas arredondadas
                width:"fit-content", // Largura do menu
                maxWidth: {xs: "80vw", md: "100vw"}, // Largura máxima do menu
                padding: 0, // Espaçamento interno do menu
                
                
              },
              
              
            },
            
           
          }}
       

        // Estilizando o Menu para exibir os itens horizontalmente
        
      >
        

        <Stack sx={{ display: "flex", flexDirection: "row", gap: 3, paddingX: 1,  "& .MuiMenuItem-root": {
          p: {xs: 0.25, md: 1}, // Espaçamento interno dos itens do menu
          minWidth: {xs: 0, md: 0}, // Largura mínima dos itens do menu
          },  }} >
          <MenuItem onClick={() => handleSelectPosicao("TOP_LANER")}>
            <Box sx={{ width: { xs: 35, md: 40 }, height: "auto", position: "relative" }}>
              <Image src={TopIcon} alt="Top" layout="responsive" width={40} height={40} />
            </Box>
          </MenuItem>

          <MenuItem onClick={() => handleSelectPosicao("JUNGLER")}>
            <Box sx={{ width: { xs: 35, md: 40 }, height: "auto", position: "relative" }}>
              <Image src={JungleIcon} alt="Selva" layout="responsive" width={40} height={40} />
            </Box>
          </MenuItem>

          <MenuItem onClick={() => handleSelectPosicao("MID_LANER")}>
            <Box sx={{ width: { xs: 35, md: 40 }, height: "auto", position: "relative" }}>
              <Image src={MidIcon} alt="Meio" layout="responsive" width={40} height={40} />
            </Box>
          </MenuItem>

          <MenuItem onClick={() => handleSelectPosicao("AD_CARRY")}>
            <Box sx={{ width: { xs: 35, md: 40 }, height: "auto", position: "relative" }}>
              <Image src={ADCIcon} alt="Atirador" layout="responsive" width={40} height={40} />
            </Box>
          </MenuItem>

          <MenuItem onClick={() => handleSelectPosicao("SUPPORT")}>
            <Box sx={{ width: { xs: 35, md: 40 }, height: "auto", position: "relative" }}>
              <Image src={SupportIcon} alt="Suporte" layout="responsive" width={40} height={40} />
            </Box>
          </MenuItem>
        </Stack>
        
        
      </Menu>



      
      
    </Box>
  );
}

export default EscolhaPosicao;