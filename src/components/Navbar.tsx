'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { Button } from '@mui/material';



const pages = [{ title: 'INÍCIO', url: '/' }, { title: 'NOTÍCIAS', url: '/noticias' }, { title: 'SOBRE', url: '/sobre' }];
const settings = ['Minha conta', 'Configurações', 'Encerrar sessão'];
const games = [{ title: 'League Of Legends', url: '/lol' }, { title: 'Valorant', url: '/valorant' }, { title: 'Counter Strike', url: '/cs' }]

function ResponsiveAppBar() {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = React.useState(false);
  const [isNavDrawerOptionsOpen, setIsNavDrawerOptionsOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = () => {
    setIsNavDrawerOpen(true);
  };

  const handleOpenNavOptions = () => {
    setIsNavDrawerOptionsOpen(true);
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setIsNavDrawerOpen(false);
  };

  const handleCloseNavOptions = () => {
    setIsNavDrawerOptionsOpen(false);
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#0E1241", borderBottom: "2px solid #F0E" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }} >
          {/*<IconButton size="small" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <img src="/logoMenuDown.svg" alt="" width={100} />
          </IconButton>*/}

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="abrir menu"
            onClick={handleOpenNavMenu}
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}
          >
            <img src="/logoMenuDown.svg" alt="" width={100} />
          </IconButton>

          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="abrir menu de opções"
            onClick={handleOpenNavOptions}
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}>
            <MenuIcon fontSize='large' />

          </IconButton>

          <Drawer
            anchor="left"
            open={isNavDrawerOpen}
            onClose={handleCloseNavMenu}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                width: 280,
                backgroundColor: '#0E1241',
                color: 'white',
              },
            }}
          >
            <Box>
              <IconButton
                onClick={handleCloseNavMenu}
              >
                <img src="/logoMenuUp.svg" alt="" width={100} />
              </IconButton>
            </Box>
            <Box sx={{background:"#0a247c", p : 1}}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', pl: 2 }}>JOGOS</Typography>
            </Box>
            <Box role="presentation" sx={{ pt: 2 }}>

              {games.map((game) => (
                <MenuItem key={game.title} onClick={handleCloseNavMenu}>
                  <Link href={game.url} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    {game.title}
                  </Link>
                </MenuItem>
              ))}
            </Box>
          </Drawer>
          <Drawer
            anchor="right"
            open={isNavDrawerOptionsOpen}
            onClose={handleCloseNavOptions}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                width: '100%',
                backgroundColor: '#0E1241',
                color: 'white',
                
              },
              
              
            }}
          >
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingInline: 3}}>
              <IconButton sx={{mt: 1}}>
                <img src="/logo.svg" alt="" width={60} />
              </IconButton>
              
              <CancelRoundedIcon
               onClick={handleCloseNavOptions}
               fontSize='large'/>
              
              
            </Box>
            <Box role="presentation" sx={{ pt: 2, pl: 2 }}>
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={handleCloseNavOptions}>
                  <Link href={page.url} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    <Typography sx={{ textAlign: 'left' }}>{page.title}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Box>
            {/* Login Button -> Aparecer quando o usuário não estiver autenticado */}
            <Box sx={{ pt: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{width: '75%', borderRadius: 8}}>
                <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Fazer Login
                </Link>
              </Button>

            </Box>

          </Drawer>


          {/* Desktop Drawer */}

          <Drawer
            anchor="top"
            open={isNavDrawerOpen}
            onClose={handleCloseNavMenu}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                height: 300,
                backgroundColor: '#0E1241',
                color: 'white',
              },
            }}
          >
            <Box sx={{display: 'flex', justifyContent:'space-between', alignItems: 'center', paddingInline: 2.5, pt: 1}}>
              <IconButton
                onClick={handleCloseNavMenu}
              >
                <img src="/logoMenuUp.svg" alt="" width={100} />
              </IconButton>
              <Button onClick={handleCloseNavMenu} sx={{color: "white"}}>
                <CancelRoundedIcon fontSize='large'/>
              </Button>
              
            </Box>
            <Box sx={{background:"#0a247c", p : 1}}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', pl: 2 }}>JOGOS</Typography>
            </Box>
            <Box role="presentation" sx={{ pt: 2 }}>

              {games.map((game) => (
                <MenuItem key={game.title} onClick={handleCloseNavMenu}>
                  <Link href={game.url} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    {game.title}
                  </Link>
                </MenuItem>
              ))}
            </Box>
          </Drawer>


          {/* Desktop menu */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="abrir menu"
              onClick={handleOpenNavMenu}
              
            >
              <img src="/logoMenuDown.svg" alt="" width={100} />
            </IconButton>
            

          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/*pages.map((page) => (
              <Button
                key={page.title}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.title}
              </Button>
            ))*/}

            {pages.map((page) => (
              <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                <Link href={page.url} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography sx={{ textAlign: 'center' }}>{page.title}</Typography>
                </Link>
              </MenuItem>
            ))}
          </Box>

          <Box sx={{ display:{ xs: 'none', md: 'block' } }}>
            <Button variant='contained' sx={{ width: 150, borderRadius: 4, backgroundColor: '#11B5E4', '&:hover': { backgroundColor: '#0b80a0' },  }}>
              <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                Fazer Login
              </Link>
            </Button>
          </Box>
          {/* User Menu */}
          {/*<Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="Abrir Configurações">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>*/}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
