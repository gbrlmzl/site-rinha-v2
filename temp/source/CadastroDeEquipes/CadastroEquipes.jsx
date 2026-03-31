"use client";
import { Box, Button, Container, Paper, Stepper, Step, StepLabel, Typography, Snackbar, Card, Alert, CircularProgress } from "@mui/material";
import EquipeInfo from "./EquipeInfo";
import JogadorInfo from "./JogadorInfo";
import ConfirmacaoDadosEquipe from "./ConfirmacaoDadosEquipe";
import { useCadastroEquipe } from "../../hooks/useCadastroEquipe";
import { useState } from "react";
import { useRef } from "react";
import Pagamento from "./Pagamento";
import '@fontsource/russo-one';
import "@fontsource/roboto";

const formTitles = ["Informações da equipe", "Jogador 1 (Capitão)", "Jogador 2", "Jogador 3", "Jogador 4", "Jogador 5", "Jogador 6 (Opcional)", "Confirmação","Pagamento"];
const steps = ["Informações da equipe", "Jogadores", "Confirmação", "Pagamento"];

function CadastroEquipes() {
  const {
    currentStep,
    setCurrentStep,
    imagePreview,
    defaultPosicaoIcon,
    equipe,
    jogadores,
    formPagamento,  
    qrCode,
    qrCodeBase64,
    qrCodeGerado,
    loading,
    aceitaTermos,
    pagamentoAprovado,
    valorPagamento,
    handleAceitaTermosChange,
    handleEquipeDataChange,
    handleJogadoresDataChange,
    handleImagePreviewChange,
    handlePosicaoIconChange,
    handlePagamento,
    handleFormPagamentoChange,
    handleConfirmaEscudo

  } = useCadastroEquipe();

  const jogadorTemporario = useRef(jogadores[currentStep - 1]);
  const stepperRef = useRef(null); // Referência para o contêiner do Stepper
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarCpfErrorOpen, setSnackbarCpfErrorOpen] = useState(false); // Snackbar para erro de CPF
  const [snackbarJogadorInfoErrorOpen, setSnackbarJogadorInfoErrorOpen] = useState(false); // Snackbar para erro de informações do jogador
  const [snackbarJogadorInfoErrorOpenMessage, setSnackbarJogadorInfoErrorOpenMessage] = useState(""); // Mensagem de erro do jogador
  
  const handleCopiaPix = () => {
    setSnackbarOpen(true); // Abre snackbar de cópia de PIX
    setTimeout(() => setSnackbarOpen(false), 3000); // Fecha o snackbar após 3 segundos
  }


  const validarForm = () => {
    const { cpf } = formPagamento;
    const cpfRegex = /^\d{11}$/; // Apenas números, exatamente 11 dígitos 
    if (!cpfRegex.test(cpf)) {
      return false;
    }
    return true;
  };

  const convertStep = () => {
    if(currentStep === 0) return 0; // Equipe
    if(currentStep >= 1 && currentStep <= 6) return 1; // Jogadores
    if(currentStep === 7) return 2; // Confirmação
    if(currentStep === 8) return 3; // Pagamento
    return -1; // Valor padrão, caso não corresponda a nenhum passo

  }
  const isMatriculaUnica = () => {
    // Verifica se existem jogadores com matriculas repetidas
    //Crie um array com as matrículas dos jogadores que são diferentes de ""
    const matriculas = jogadores.map((jogador) => jogador.matricula).filter((matricula) => matricula !== "");
    //Verifique se existe alguma matricula que se repete nesse array de matriculas
    const matriculaSet = new Set();

    for (const matricula of matriculas) {
      if (matriculaSet.has(matricula)) {
        return false; // Matrícula repetida encontrada
      }
      matriculaSet.add(matricula);
    }

    //se existir, retorne false, se não existir, retorne true
    return true; //todas as matriculas são únicas
    
  }

  const validarJogador = (jogador, step) => {
    // Validação básica para jogadores não desabilitados
    if (!jogador.disabledPlayer) {
      // Se não for jogador externo, a matrícula deve ter exatamente 11 dígitos
      if (!jogador.isExternalPlayer && !/^\d{6,11}$/.test(jogador.matricula)) {
        setSnackbarJogadorInfoErrorOpenMessage("Por favor, insira uma mátricula válida!"); // Abre snackbar de erro
        setSnackbarJogadorInfoErrorOpen(true); // Abre snackbar de erro
        return false;
      }
       
      // Campos obrigatórios
      const camposObrigatorios = ['nomeJogador', 'nickname', 'discordUser'];
      for (const campo of camposObrigatorios) {
        if (!jogador[campo] || jogador[campo].trim() === ""){
          setSnackbarJogadorInfoErrorOpenMessage(`Por favor, preencha todos os campos!`); // Abre snackbar de erro
          setSnackbarJogadorInfoErrorOpen(true); // Abre snackbar de erro
          return false;

        } 
      }
  
      // Validação do e-mail no jogador capitão
      if (step === 1 && (!equipe.emailContato || !equipe.emailContato.includes('@'))) {
        return false;
      }
      if(step >=1 && step <= 5){
        if(jogador.posicao === "") {
          setSnackbarJogadorInfoErrorOpenMessage("Por favor, selecione uma posição!"); 
          setSnackbarJogadorInfoErrorOpen(true); // Abre snackbar de erro
          return false; // Verifica se a posição foi selecionada
      }
    }
  }  
    return true;
  };

  const validarEquipe = () => {
    // Validação básica para a equipe
    if (!equipe.nomeEquipe || equipe.nomeEquipe.trim() === "") {
      setSnackbarJogadorInfoErrorOpenMessage("Por favor, insira um nome para a equipe."); // Abre snackbar de erro
      setSnackbarJogadorInfoErrorOpen(true); // Abre snackbar de erro
      return false;
    }else if(equipe.nomeEquipe.trim().length < 3 || equipe.nomeEquipe.length > 30){
      setSnackbarJogadorInfoErrorOpenMessage("O nome da equipe deve ter entre 3 e 30 caracteres."); // Abre snackbar de erro
      setSnackbarJogadorInfoErrorOpen(true); // Abre snackbar de erro
      return false;

    }
  
    // Validação do e-mail
    
  
    return true;

  }
  


  
  

 


  const handleNext = (event) => {
    if(event) event.preventDefault(); // Impede o recarregamento da página

    if(currentStep === 0){
      if(!validarEquipe()){
        return; // Se a validação falhar, não avança para o próximo passo
      }
    }
    
    if (currentStep !== 0 && currentStep <= 6) {
      if (!validarJogador(jogadorTemporario.current, currentStep)) {
        
        return; // Se a validação falhar, não avança para o próximo passo
      } 
      handleJogadoresDataChange(jogadorTemporario.current, currentStep - 1);
      }  //Atualiza os dados dos jogadores globalmente

    if(currentStep === 7){
      if(!isMatriculaUnica()){
        setSnackbarJogadorInfoErrorOpenMessage("As matrículas dos jogadores devem ser únicas!"); // Abre snackbar de erro
        setSnackbarJogadorInfoErrorOpen(true); // Abre snackbar de erro
        return false; // Se a validação falhar, não avança para o próximo passo
      }
      handleConfirmaEscudo(); // Chama a função para confirmar o escudo antes de prosseguir para o formulário de pagamento
    }

    if (currentStep === 8) {
      if(validarForm()){ 
        handlePagamento();
      }else{
        setSnackbarCpfErrorOpen(true); // Abre snackbar de erro de CPF

      }
      

    } else {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        scrollToStep(nextStep);
        return nextStep;
      });
    }

    

    };
  ;


  const handlePrevious = () => {
    setCurrentStep((prev) => {
      const previousStep = prev - 1;
      scrollToStep(previousStep); // Rola para o passo anterior
      return previousStep;
    });
  };

  const scrollToStep = (step) => {
    if (stepperRef.current) {
      const stepElement = stepperRef.current.querySelectorAll(".MuiStep-root")[step];
      if (stepElement) {
        stepElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  };

  

  return (
    <Box component="form" onSubmit={handleNext} autoComplete="off" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Typography gutterBottom align="center" sx={{ fontSize: "2rem", fontWeight: "bold", mb: 2, color:"white", fontFamily: "Russo One", py:3}}>
          Inscrever Equipe
      </Typography>
      <Container maxWidth="md" sx={{paddingBottom: 3 }}>
      <Paper elevation={3} sx={{ p: 3, height: {xs: "auto", md: "auto" }}} >
        

        {/* Stepper para indicar progresso */}
        <Box ref={stepperRef}  sx={{ overflowX: "auto", maxWidth: "100%" }}>
          <Stepper activeStep={convertStep()} alternativeLabel sx={{margin: "0 auto",
            maxWidth: "100%",
            margin: "0 auto",
            //paddingX: { xs: 1, sm: 2, md: 3 }, // Ajusta o espaçamento horizontal
            "& .MuiStepLabel-label": {
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // Tamanho da fonte do rótulo
            },
            "& .MuiStepIcon-root": {
              width: { xs: 24, sm: 30, md: 36 }, // Tamanho dos ícones do Stepper
              height: { xs: 24, sm: 30, md: 36 },
            },
           }}>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Conteúdo do formulário */}
        <Box  sx={{ mt: 1, px:{xs:0, md:6} }}>
            

          {currentStep === 0 ? (
            <EquipeInfo
              formTitle="Equipe"
              data={equipe}
              onChange={handleEquipeDataChange}
              escudoPreview={imagePreview}
              onImageChange={handleImagePreviewChange}

            />
          ) : currentStep >= 1 && currentStep <=6 ?(
            <JogadorInfo
              formTitle={formTitles[currentStep]}
              data={jogadores[currentStep - 1]}
              onSave={(value) => jogadorTemporario.current = value}
              posicaoIcon={defaultPosicaoIcon[currentStep - 1]}
              onPosicaoChange={(value) => handlePosicaoIconChange(value, currentStep - 1)}
              stepAtual={currentStep}
              dataEquipe={equipe}
              onEmailChange={handleEquipeDataChange}
            />
          ) : currentStep === 7 ?(
            <ConfirmacaoDadosEquipe dataEquipe={equipe} dataJogadores={jogadores} escudoPreview={imagePreview} aceita={aceitaTermos} onAceitaTermos={handleAceitaTermosChange}/>
            
          ): (
            <Pagamento
              formTitle={formTitles[currentStep]}
              data={formPagamento}
              onChange={handleFormPagamentoChange}
              valor={valorPagamento}
              qrCodeGerado={qrCodeGerado}
              qrCode={qrCode}
              qrCodeBase64={qrCodeBase64}
              loading={loading}
              pagamentoAprovado={pagamentoAprovado}
              onCopiaPix={handleCopiaPix}
              />

            )}
        </Box>{/*box final do conteudo do formulario*/}

        {/* Botões de navegação */}
        <Box sx={{ display: "flex", 
          justifyContent: currentStep === formTitles.length - 1 ? "center" : "space-between"
           , mt: 2 , paddingX: { xs: 1, sm: 2, md: 5 },}}>
          {currentStep < formTitles.length - 1 && (
            <Button  variant="contained"  disabled={currentStep === 0} onClick={handlePrevious} >
            Anterior
          </Button>
          )}
          

          {currentStep < formTitles.length - 2 ? (
            <Button type= "submit" variant="contained" >
              Próximo
            </Button>
          ) : currentStep === formTitles.length - 2 ? (
            <Button variant="contained" color="success" onClick={handleNext} disabled={!aceitaTermos} > {/* Depois criar uma função separada handlePagamentoClick */}
              Pagamento
            </Button>
          ) : currentStep === formTitles.length - 1 && !qrCodeGerado  && !pagamentoAprovado? (
            <Button type= "submit" variant="contained" color="success" disabled={loading}>
              Gerar QR Code PIX
            </Button> 

          ):(
            <div></div>
          )
          }
        </Box>
      </Paper>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Código para pagamento copiado!"
      />

      <Snackbar
        open={snackbarJogadorInfoErrorOpen}
        onClose={() => setSnackbarJogadorInfoErrorOpen(false)}
        type="error"
        >
        <Alert onClose={() => setSnackbarJogadorInfoErrorOpen(false)} severity="error" sx={{ width: '100%' }}>
          {snackbarJogadorInfoErrorOpenMessage}
        </Alert>

      </Snackbar>
      
      <Snackbar
        open={snackbarCpfErrorOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarCpfErrorOpen(false)}
        message="CPF inválido!"
        type="error"
      >
        <Alert onClose={() => setSnackbarCpfErrorOpen(false)} severity="error" sx={{ width: '100%' }}>
          CPF inválido!
        </Alert>
      </Snackbar>
     
    </Container>
    </Box>

    
  );
}

export default CadastroEquipes;
