'use client';
import { useEffect, useState } from 'react';
import {Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography,Checkbox } from '@mui/material';
import {Box} from '@mui/system';
import Link from 'next/link';


function ModalBox({ open, handleClose }) {
return(
    <Box>
        {/* Modal */}
        <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{paper:{sx: { borderRadius: 4, p: 2, backgroundColor: "#000022", color: "white" }},
                    backdrop:{sx: { backgroundColor: "rgba(0, 0, 0, 0.85)" }}}} 
        >
        <DialogTitle fontFamily="Russo One" sx={{ fontSize: '1.5rem' }}>
        AVISO IMPORTANTE:
        </DialogTitle>
        <DialogContent sx={{ fontSize: '1rem' }}>
        <Typography gutterBottom>
            Por favor, leia o <Link href={"/regulamento"} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none", color:"#01F7FF", }} 
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00BFFF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#01F7FF")}>regulamento</Link> e veja a <Link href={"/programacao"} target="_blank" rel="noopener noreferrer"
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00BFFF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#01F7FF")} 
            style={{textDecoration:"none", color:"#01F7FF", }} >
            programação</Link> do torneio antes de prosseguir com a inscrição.
        </Typography>
        </DialogContent>
        <DialogActions sx={{px: 3, display:"flex", flexDirection:"column", gap: 2}}>
        {/*<Box sx={{display:"flex", justifyContent:"space-between", flexDirection:"row", width:"65%"}}>
        <Link href={"/regulamento"} target="_blank" rel="noopener noreferrer" >
            <Button variant="outlined" color="inscricaoButton" sx={{ fontWeight: "bold" }}>
                Ver Regulamento
            </Button>
        </Link>
        <Link href={"/programacao"} target="_blank" rel="noopener noreferrer" >
            <Button variant="outlined" color="inscricaoButton" sx={{ fontWeight: "bold" }}>
                Ver Programação
            </Button>
        </Link>
        </Box>
        */}
        
        <Box>
        <Button
            variant="contained"
            color="cyanButton"
            onClick={handleClose}
            sx={{ fontWeight: "bold",":hover": { backgroundColor: "#0051E6", color: "white" }  }}
        >
            CONTINUAR 
        </Button>

        </Box>
        

       
        </DialogActions>
        </Dialog>
    </Box>
    );
}

export default ModalBox;