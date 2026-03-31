
import { use, useState } from "react";
import { inicialEquipe, inicialJogadores, inicialFormPagamento } from "../components/CadastroDeEquipes/teamData.js";
//import { TopIcon, JungleIcon, MidIcon, ADCIcon, SupportIcon, DefaultIconPosition } from "../../assets/icons/icons.js"; // Centralizar ícones
import TopIcon from "../assets/icons/Position-Top.png";
import JungleIcon from "../assets/icons/Position-Jungle.png";
import MidIcon from "../assets/icons/Position-Mid.png";
import ADCIcon from "../assets/icons/Position-Bot.png";
import SupportIcon from "../assets/icons/Position-Support.png";
import DefaultIconPosition from "../assets/icons/DefaultIcon.svg"; // Ícone padrão
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";



export const useCadastroEquipe = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [imagePreview, setImagePreview] = useState(); //Estado para armazenar a URL da imagem, de forma que seja visivel no navegador
  const [imagePreviewFile, setImagePreviewFile] = useState(null); // Estado para armazenar o arquivo de imagem, para que seja enviado ao Imgur
  const [defaultPosicaoIcon, setDefaultPosicaoIcon] = useState(Array(6).fill(DefaultIconPosition));
  const [equipe, setEquipe] = useState(inicialEquipe);
  const [jogadores, setJogadores] = useState(inicialJogadores);
  const [formPagamento, setFormPagamento] = useState(inicialFormPagamento);
  const [validationEquipe, setValidationEquipe] = useState(false);
  const [qrCode, setQrCode] = useState(null); // guarda o QR Code
  const [qrCodeBase64, setQrCodeBase64] = useState(null); // guarda o base64 do QR Code
  const [loading, setLoading] = useState(false); // estado de carregamento
  const [qrCodeGerado, setQrCodeGerado] = useState(false); // estado de QR Code gerado
  const [aceitaTermos, setAceitaTermos] = useState(false); // estado de aceitação dos termos
  const [pagamentoAprovado, setPagamentoAprovado] = useState(false); // estado de pagamento aprovado
  const [uuidPagamento, setUuidPagamento] = useState(null);
  const [valorPagamento, setValorPagamento] = useState(null); // estado do valor do pagamento

  

  const handleConfirmaEscudo = async () => {
    
    if (!imagePreviewFile) {
      return; 
    }
    setLoading(true); // Inicia o carregamento
    try{
      const urlEscudoImgur = await uploadImagemParaImgur(imagePreviewFile); // Faz o upload da imagem para o Imgur
      
      atualizarEscudoEquipe(urlEscudoImgur); // Atualiza o estado da equipe com a URL do escudo
      

    }catch (err) {
      
    } finally {
      setLoading(false);
    }
    

    

  }


  const uploadImagemParaImgur = async (file) => {

    const nomeEquipe = equipe.nomeEquipe; // Nome da equipe
    const formData = new FormData();
    formData.append('image',file );
    formData.append('title',nomeEquipe) //Adiciona o nome da equipe como titulo da imagem mo imgur
  
    try {
       const response = await fetch("/api/upload-imgur", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.link) {
      return data.link;
    } else {
      console.error("Erro no upload:", data.error || "Erro desconhecido");
    }
  } catch (error) {
    console.error("Erro no upload do escudo:", error);
  }
  };
  
  
  

  
  const atualizarEscudoEquipe = (urlEscudoImgur) => {
    setEquipe((prev) => ({ ...prev, escudo: urlEscudoImgur })); // Atualiza o estado da equipe com o arquivo de imagem
  }



  const handleAceitaTermosChange = (event) => {
    const newAceitaTermos = event.target.checked;
    setAceitaTermos(newAceitaTermos); // Atualiza o estado de aceitação dos termos

  }
  
  
 
  

  const handleEquipeValidation = (value) => {
    setValidationEquipe(value);

  }
  const handleFormPagamentoChange = (data) => {
    setFormPagamento((prev) => ({ ...prev, ...data })); // Atualiza o estado com os dados do formulário de pagamento

  }

 


 

  const handlePagamento = async () => {
    if (loading) return; // Impede execução se já estiver carregando
    setLoading(true);
    setQrCodeBase64(null); // limpa QR antigo

    

    const jogadoresAtivos = jogadores.filter(jogador => !jogador.disabledPlayer);

    const dadosEquipe = {
      ...equipe,
      jogadores: jogadoresAtivos, // Filtra jogadores ativos
    };

    const dadosPagamento = {
      nome: formPagamento.nome,
      sobrenome: formPagamento.sobrenome,
      email: formPagamento.email,
      cpf: formPagamento.cpf,
    };
    

    try {
      const response = await fetch("/api/inscricoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dadosEquipe,
          dadosPagamento,
        }),
      });
      

      const dataPagamento = await response.json();
   
      if (dataPagamento.qrCodeBase64 && dataPagamento.qrCode) {
        setQrCodeBase64(`data:image/png;base64,${dataPagamento.qrCodeBase64}`);
        setQrCode(dataPagamento.qrCode); // Atualiza o estado com o QR Code
        setQrCodeGerado(true); // Atualiza o estado indicando que o QR Code foi gerado
        setUuidPagamento(dataPagamento.uuid); // isso ativa o hook acima
        setValorPagamento(dataPagamento.valor); // Atualiza o valor do pagamento
        
        
        

        

      } else {
        console.error("Erro ao gerar QR Code.");
      }
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    if (!uuidPagamento) return;
  
    const stompClientRef = { current: null }; // simples objeto ref local
  
    const socket = new SockJS(process.env.NEXT_PUBLIC_API_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        
  
        client.subscribe(`/topic/pagamentos/${uuidPagamento}`, (message) => {
          const body = JSON.parse(message.body);
          
  
          if (body.status === "PAGAMENTO REALIZADO") {
            
            onPagamentoAprovado();
          }
        });
      },
      onDisconnect: () => {},
      debug: () => {},
    });
  
    client.activate();
    stompClientRef.current = client;
  
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [uuidPagamento]);
  

  

  const onPagamentoAprovado = () => {
    setQrCodeGerado(false); // Reseta o QR Code gerado
    setPagamentoAprovado(true); // Chama função que muda a tela, por exemplo

  } 


 

  const handleEquipeDataChange = (data) => {
    setEquipe((prev) => ({ ...prev, ...data }));
  };

  const handleJogadoresDataChange = (data,index) => {
    setJogadores((prev) => {
      const newJogadores = [...prev];
      newJogadores[index] = data;
      return newJogadores;
    });
  };

  const handleImagePreviewChange =  (file) => {
    setImagePreview(URL.createObjectURL(file));  // Atualiza o estado com a URL do arquivo
    setImagePreviewFile(file); // Atualiza o estado com o arquivo de imagem
  };

  const handlePosicaoIconChange = (value, jogadorIndex) => {
    const posicoesMap = { TOP_LANER: TopIcon, JUNGLER: JungleIcon, MID_LANER: MidIcon, AD_CARRY: ADCIcon, SUPPORT: SupportIcon, Default: DefaultIconPosition };
    if (posicoesMap[value]) {
      setDefaultPosicaoIcon((prevIcons) => {
        const newIcons = [...prevIcons];
        newIcons[jogadorIndex] = posicoesMap[value];
        return newIcons;
      });
    }
  };

  return {
    currentStep,
    setCurrentStep,
    imagePreview,
    defaultPosicaoIcon,
    equipe,
    jogadores,
    validationEquipe,
    formPagamento,
    qrCodeBase64,
    qrCode,
    loading,
    qrCodeGerado,
    aceitaTermos,
    pagamentoAprovado,
    valorPagamento,
    handleAceitaTermosChange,
    handleEquipeDataChange,
    handleJogadoresDataChange,
    handleImagePreviewChange,
    handlePosicaoIconChange,
    handleEquipeValidation,
    handlePagamento,
    handleFormPagamentoChange,
    handleConfirmaEscudo,

   
    
  };
};
