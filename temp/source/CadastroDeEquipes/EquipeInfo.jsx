"use client";
import { useState } from "react";
import { Box, Button, TextField, Typography, Grid, Card, CardMedia } from "@mui/material";
import { styled } from "@mui/system";
import UploadIcon from '@mui/icons-material/Upload';


function EquipeInfo({ formTitle, data, onChange, onImageChange, escudoPreview }) {
  

  const handleImageUpload = (event) => {
    if (!event?.target?.files) return;

    const file = event.target.files[0];
    if (file) {
    onImageChange(file); // Chama a função para lidar com a mudança de imagem
  };
}

  const handleEquipeChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...data, [name]: value });

  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <Box sx={{ maxWidth: 500, p: {xs: 1.5, md: 2}, mx: "auto"}}>
      <Typography  variant="h4" fontFamily={"Russo One"} gutterBottom align="center">
        {formTitle}
      </Typography>

      <Grid container spacing={2} justifyContent="center" flexDirection={"column"}>
        {/* Escudo da equipe */}
        <Grid  size={{ xs: 12}} display="flex" justifyContent="center">
          <Card sx={{ width: 200, height: 200, display: "flex", justifyContent: "center", alignItems: "center", boxShadow: 3 }}>
            {escudoPreview ? (
              <CardMedia component="img" image={escudoPreview} alt="Escudo da equipe" sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <Typography variant="body1" color="textSecondary" align="center" >
                Ideal: PNG 
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Botão de Upload */}
        <Grid  size={{ xs: 12 }} display="flex" justifyContent="center" alignItems={"center"}>
          <Button component="label" variant="contained" /*startIcon={<CloudUpload />}*/color="primary" >
           <Typography sx={{marginRight:1}}>Escudo</Typography><UploadIcon width={40} height={40} ></UploadIcon>
            <VisuallyHiddenInput type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageUpload} />
          </Button>
        </Grid>

        {/* Input do Nome da Equipe */}
        <Grid autoComplete="off"  size={{ xs: 12 }}>
          <TextField
            fullWidth
            placeholder="Nome da Equipe"
            variant="outlined"
            name="nomeEquipe"
            value={data.nomeEquipe}
            onChange={handleEquipeChange}
            required
            
            
            sx={{ borderRadius: 4, backgroundColor: "#fff", "& .MuiOutlinedInput-root": { borderRadius: 4, height:50},height: 50, }}
            slotProps={{htmlInput: { style: { textAlign: "center", fontSize: "1.65rem", fontFamily:"Roboto", fontWeight: 600 }},}}
            
            
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default EquipeInfo;

