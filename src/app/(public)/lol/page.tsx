'use client'
import { Title } from "@mui/icons-material";
import { Button, Card, Typography} from "@mui/material";
import Inicio from "@/components/lol/inicio/Inicio";
import { getUser } from "@/services/authService";



export default function Home() {
  return (
    <Inicio />
  );
}
