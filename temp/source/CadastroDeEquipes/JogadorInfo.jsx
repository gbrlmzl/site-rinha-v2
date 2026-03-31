"use client"
import { useEffect, useState } from "react";
import { FormControlLabel,Checkbox, TextField, Typography,FormControl, FormGroup, Stack } from "@mui/material";
import EscolhaPosicao from "./EscolhaPosicao";
import { Box, Container, padding } from "@mui/system";
import { CheckBox } from "@mui/icons-material";




function JogadorInfo({formTitle, data, posicaoIcon, onPosicaoChange, onSave, stepAtual, dataEquipe, onEmailChange}) {
    const [localData, setLocalData] = useState(data); // Estado local para armazenar os dados do jogador temporariamente
    const stepJogadorOpcional = 6; // Defina o número do passo do jogador opcional aqui
    const stepJogadorCapitao = 1; // Defina o número do passo do jogador capitão aqui 

    const isJogadorOpcional = stepAtual === stepJogadorOpcional; // Verifica se o passo atual é o do jogador opcional
    const isMatriculasObrigatorias = stepAtual >= 1 && stepAtual <= 3; // Verifica se o passo atual é o dos jogadores com matricula obrigatórias
    const isJogadorCapitao = stepAtual === stepJogadorCapitao; // Verifica se o passo atual é o do jogador capitão
   
   
    useEffect(() => {
        setLocalData(data);
      }, [data]);

      useEffect(() => {
        if (onSave) onSave(localData)
      }, [localData, onSave]);
      
      

    const handleChange = (e) => {
        const{name, value} = e.target;
        name === "emailContato" ? onEmailChange({ ...dataEquipe, [name]: value }) : setLocalData((prev) => ({ ...prev, [name]: value }));
        
  
    };

    const handlePosicaoChange = (value) => {  
        setLocalData((prev) => ({ ...prev, posicao: value })); // Atualiza o estado local com a nova posição selecionada
        onPosicaoChange(value, posicaoIcon); // Atualiza o estado global com a posição selecionada
    }
    
    const handleOptionalCheckboxChange = () => {
        const newDisabledPlayer = !localData.disabledPlayer;
        
        setLocalData((prev) => ({
            ...prev,
            disabledPlayer: newDisabledPlayer,
            matricula: newDisabledPlayer ? "" : prev.matricula, // Limpa a matrícula se o jogador for desabilitado
            nomeJogador: newDisabledPlayer ? "" : prev.nomeJogador, // Limpa o nome se o jogador for desabilitado
            nickname: newDisabledPlayer ? "" : prev.nickname, // Limpa o nickname se o jogador for desabilitado
            discordUser: newDisabledPlayer ? "" : prev.discordUser, // Limpa o Discord se o jogador for desabilitado
            isExternalPlayer: newDisabledPlayer ? false : prev.isExternalPlayer, // Reseta o jogador externo se o jogador for desabilitado
            posicao: newDisabledPlayer ? "FILL" : prev.posicao, // Limpa a posição se o jogador for desabilitado
            
        }))
        onPosicaoChange("Default", posicaoIcon); // Reseta a posição para o ícone padrão 
        
       

    }

    const handleCheckboxChange = () => {
        const newIsExternalPlayer = !localData.isExternalPlayer;
        setLocalData((prev) => ({
            ...prev,
            isExternalPlayer: newIsExternalPlayer,
            matricula: newIsExternalPlayer ? "" : "",
            
          }));
          
        };
     // Exponha a função de salvar (opcional, se quiser dar um feedback interno)
    
    

    return (
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <Stack flexDirection={"row"}>
                <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", textAlign: "center", fontFamily:"Russo One"}}>
                    {formTitle}
                </Typography>
                {isMatriculasObrigatorias && (
                    <Typography  variant="text2" fontSize={"0.75 rem"}>
                        Matrícula obrigatória

                    </Typography>
                )}

                </Box>                
                

                {isJogadorOpcional && (
                <FormControl component="fieldset">
                    <FormGroup row>
                        <FormControlLabel 
                            control={<Checkbox checked={localData.disabledPlayer}   onChange={handleOptionalCheckboxChange}  />}
                            label="Sem jogador reserva" 
                            sx={{flexGrow: 1, marginLeft: {xs: 0, md: 2}}}
                        />
                    </FormGroup>
                </FormControl>
                )}
            </Stack>
            <Container  >
                <Stack spacing={{xs: 0.5, md: 1}} pt={1.25} pb={1}  sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <TextField 
                        type="text" 
                        id="player-name" 
                        name="nomeJogador" 
                        label="Nome" 
                        value={localData.nomeJogador} 
                        onChange={handleChange} 
                        fullWidth 
                        variant="outlined"
                        margin="dense"
                        required={!localData.disabledPlayer} // Torna o campo obrigatório se o jogador não for desabilitado
                        disabled={localData.disabledPlayer} // Desabilita o campo se o jogador for desabilitado
                        
                        
                        
                    />
        
                    <Stack   sx={{width: "100%", display: "flex", flexDirection:{ xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' },
                    }} >
                        <Box sx={{maxWidth:{xs: "100%", md: "60%"}, width:"100%"}}>
                            <TextField 
                            id="player-matricula" 
                            name="matricula" 
                            value={localData.matricula} 
                            onChange={handleChange} 
                            disabled={localData.isExternalPlayer || localData.disabledPlayer} // Desabilita o campo se o jogador for desabilitado ou se for um jogador externo
                            label={localData.isExternalPlayer ? "" : "Matrícula"} 
                            sx={{flexGrow: {xs: 0, md: 1}, marginRight: {xs: 0, md: 1}, }}
                            fullWidth 
                            variant="outlined"
                            margin="dense"
                            required={!localData.isExternalPlayer && !localData.disabledPlayer} // Torna o campo obrigatório se o jogador não for desabilitado e não for externo
                            regex={/^\d{11}$/} // Regex para validar matrícula  (11 dígitos)
                            />
                        </Box>
                        <FormControl component="fieldset" sx={{marginLeft: {xs: 0, md: 2}, }}>
                            <FormGroup row>
                                <FormControlLabel 
                                    control={<Checkbox checked={localData.isExternalPlayer} onChange={handleCheckboxChange}  />} 
                                    label="Não possui matrícula" 
                                    sx={{flexGrow: 1, marginLeft: {xs: 0, md: 2}}}
                                    disabled={isMatriculasObrigatorias || localData.disabledPlayer} // Desabilita o campo se o jogador for desabilitado
                                    

                                />
                                
                            </FormGroup>
                        </FormControl>            
                    </Stack>
                    {isJogadorCapitao && 
                        <TextField 
                            id="player-email" 
                            name="emailContato" 
                            value={dataEquipe.emailContato}
                            type="email"
                            required 
                            label="Email para contato" 
                            onChange={handleChange} 
                            fullWidth
                            variant="outlined" 
                            margin="dense"
                            
                        />}
        
                    <TextField 
                        type="text" 
                        id="player-nickname" 
                        name="nickname" 
                        label="Nickname + #" 
                        variant="outlined" 
                        value={localData.nickname} 
                        onChange={handleChange} 
                        fullWidth
                        margin="dense"
                        required={!localData.disabledPlayer}
                        disabled={localData.disabledPlayer} // Desabilita o campo se o jogador for desabilitado
                    />
        
                    <TextField 
                        id="player-discord" 
                        name="discordUser" 
                        value={localData.discordUser} 
                        label="Usuário no Discord" 
                        onChange={handleChange} 
                        fullWidth
                        variant="outlined" 
                        margin="dense"
                        required={!localData.disabledPlayer}
                        disabled={localData.disabledPlayer} // Desabilita o campo se o jogador for desabilitado
                    />
        
                    {!isJogadorOpcional && 
                    <Box alignItems="center" justifyItems="center"><EscolhaPosicao defaultIcon={posicaoIcon} onChange={handlePosicaoChange}/>
                    </Box>
                    
                    }
                    
                </Stack>
            </Container>
        </Box>
    );

    
    

    
}

export default JogadorInfo