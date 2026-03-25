'use client'
import { Title } from "@mui/icons-material";
import { Button, Card, Typography} from "@mui/material";
import Inicio from "@/components/Inicio";
import { getUser } from "@/services/authService";



export default function Home() {
  return (
    <div>
      <main>
        <Card>
          <h1>Página em construção!</h1>
          <Button onClick={async () => {
            const user = await getUser();
            if (user) {
              console.log(user);
            }
          }} variant="contained">Printar informações do usuário</Button>
  
        </Card>
      </main>
    </div>
  );
}
