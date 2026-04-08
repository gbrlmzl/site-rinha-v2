'use client'
import styles from "./page.module.css";
import { Button, Card} from "@mui/material";
import chogat from "../../public/chogat.jpg";
import Image from "next/image";

export default function Home() {
  return (
      <main >
        <Image src={chogat} width={1600} height={900}  alt="Chogat" />
      </main>
  );
}
