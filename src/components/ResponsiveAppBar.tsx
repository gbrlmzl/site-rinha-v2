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
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button, ListItemIcon } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';


const pages = [
  { title: 'INÍCIO', url: '/' },
  { title: 'NOTÍCIAS', url: '/noticias' },
  { title: 'SOBRE', url: '/sobre' },
];
const games = [
  { title: 'League Of Legends', url: '/lol' },
  { title: 'Valorant', url: '/valorant' },
  { title: 'Counter Strike', url: '/cs' },
];

function ResponsiveAppBar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const [isNavDrawerOpen, setIsNavDrawerOpen] = React.useState(false);
  const [isNavDrawerOptionsOpen, setIsNavDrawerOptionsOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const avatarRef = React.useRef<HTMLButtonElement>(null);

  const handleOpenNavMenu = () => setIsNavDrawerOpen(true);
  const handleOpenNavOptions = () => setIsNavDrawerOptionsOpen(true);
  const handleCloseNavMenu = () => setIsNavDrawerOpen(false);
  const handleCloseNavOptions = () => setIsNavDrawerOptionsOpen(false);

  const handleOpenUserMenu = () => {
    // Usa o próprio botão/avatar como âncora para manter posicionamento estável.
    setAnchorElUser(avatarRef.current);

  };
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = async () => {
    handleCloseUserMenu();
    handleCloseNavOptions();
    await logout();
    router.push('/');
  };

  // Pega a inicial do nickname para o Avatar caso não haja foto
  const avatarLetter = user?.nickname?.charAt(0).toUpperCase() ?? '';

  // -------------------------------------------------------
  // Seção reutilizável: botão de login OU avatar do usuário
  // -------------------------------------------------------
  const AuthSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    if (isLoading) {
      return (
        <Skeleton
          variant="circular"
          width={38}
          height={38}
          sx={{ bgcolor: 'rgba(255,255,255,0.15)' }}
        />
      );
    }

    if (isAuthenticated && user) {
      return (
        <Tooltip title="Abrir menu do usuário">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, display: { xs: 'none', md: 'flex' } }}>
            <Avatar
              alt={user.nickname}
              src={user.profilePic || undefined}
              sx={{
                width: 38,
                height: 38,
                bgcolor: '#11B5E4',
                border: '2px solid #11B5E4',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {/* Mostra foto se existir; caso contrário, a inicial */}
              {!user.profilePic && avatarLetter}
            </Avatar>
          </IconButton>
        </Tooltip>
      );
    }

    //Não autenticado
    if (isMobile) {
      return (
        <Box sx={{ pt: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            sx={{ width: '75%', borderRadius: 8 }}
            onClick={handleCloseNavOptions}
          >
            <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
              Fazer Login
            </Link>
          </Button>
        </Box>
      );
    }

    return (
      <Button
        variant="contained"
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: 150,
          borderRadius: 4,
          backgroundColor: '#11B5E4',
          '&:hover': { backgroundColor: '#0b80a0' },
        }}
      >
        <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
          Fazer Login
        </Link>
      </Button>
    );
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#0E1241', borderBottom: '2px solid #F0E' }}>
      <Box sx={{ width: '100%', paddingInline: { xs: 1, md: 3 } }}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>

          {/* === MOBILE: logo à esquerda + hamburguer à direita === */}
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

          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mr: 1 }}>
            {/* Avatar/login no mobile */}
            <AuthSection isMobile={false} />

            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="abrir menu de opções"
              onClick={handleOpenNavOptions}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          </Box>

          {/* === DRAWER MOBILE ESQUERDO (jogos) === */}
          <Drawer
            anchor="left"
            open={isNavDrawerOpen}
            onClose={handleCloseNavMenu}
            disableScrollLock
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
              <IconButton onClick={handleCloseNavMenu}>
                <img src="/logoMenuUp.svg" alt="" width={100} />
              </IconButton>
            </Box>
            <Box sx={{ background: '#0a247c', p: 1 }}>
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

          {/* === DRAWER MOBILE DIREITO (páginas + login/perfil) === */}
          <Drawer
            anchor="right"
            open={isNavDrawerOptionsOpen}
            onClose={handleCloseNavOptions}
            disableScrollLock
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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingInline: 3,
              }}
            >
              <IconButton sx={{ mt: 1 }}>
                <img src="/logo.svg" alt="" width={60} />
              </IconButton>
              <CancelRoundedIcon onClick={handleCloseNavOptions} fontSize="large" sx={{ cursor: 'pointer' }} />
            </Box>

            {/* Se autenticado, mostra info do usuário no topo do drawer */}
            {!isLoading && isAuthenticated && user && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 3,
                    py: 2,
                    mt: 1,
                    backgroundColor: 'rgba(17, 181, 228, 0.1)',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Avatar
                    alt={user.nickname}
                    src={user.profilePic || undefined}
                    sx={{ width: 44, height: 44, bgcolor: '#11B5E4', fontWeight: 'bold' }}
                  >
                    {!user.profilePic && avatarLetter}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{user.nickname}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            <Box role="presentation" sx={{ pt: 2, pl: 2 }}>
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={handleCloseNavOptions}>
                  <Link href={page.url} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    <Typography sx={{ textAlign: 'left' }}>{page.title}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Box>

            {/* Botão de login OU opções de conta no mobile */}
            {!isLoading && !isAuthenticated && <AuthSection isMobile={true} />}

            {!isLoading && isAuthenticated && (
              <Box sx={{ pt: 2, pl: 2 }}>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 1 }} />
                <MenuItem onClick={() => { handleCloseNavOptions(); router.push('/conta'); }}>
                  <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  Minha conta
                </MenuItem>
                <MenuItem onClick={() => { handleCloseNavOptions(); router.push('/configuracoes'); }}>
                  <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Configurações
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: '#ff6b6b' }}>
                  <ListItemIcon sx={{ color: '#ff6b6b', minWidth: 36 }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Encerrar sessão
                </MenuItem>
              </Box>
            )}
          </Drawer>

          {/* === DESKTOP DRAWER (jogos, abre ao clicar no logo) === */}
          <Drawer
            anchor="top"
            open={isNavDrawerOpen}
            onClose={handleCloseNavMenu}
            disableScrollLock
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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingInline: 2.5,
                pt: 1,
              }}
            >
              <IconButton onClick={handleCloseNavMenu}>
                <img src="/logoMenuUp.svg" alt="" width={100} />
              </IconButton>
              <Button onClick={handleCloseNavMenu} sx={{ color: 'white' }}>
                <CancelRoundedIcon fontSize="large" />
              </Button>
            </Box>
            <Box sx={{ background: '#0a247c', p: 1 }}>
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

          {/* === DESKTOP: logo clicável === */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}>
            <IconButton size="large" edge="start" color="inherit" onClick={handleOpenNavMenu}>
              <img src="/logoMenuDown.svg" alt="" width={100} />
            </IconButton>
          </Box>

          {/* === DESKTOP: links de navegação === */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link key={page.title} href={page.url} style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{page.title}</Typography>
                </MenuItem>
              </Link>
            ))}
          </Box>

          {/* === DESKTOP: botão de login OU avatar === */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', pr: 2 }}>
            {isLoading && (
              <Skeleton variant="circular" width={38} height={38}
                sx={{ bgcolor: 'rgba(255,255,255,0.15)' }} />
            )}

            {!isLoading && isAuthenticated && user && (
              <Tooltip title="Abrir menu do usuário">
                <IconButton ref={avatarRef} onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user.nickname}
                    src={user.profilePic || undefined}
                    sx={{
                      width: 38, height: 38,
                      bgcolor: '#11B5E4',
                      border: '2px solid #11B5E4',
                      fontSize: '1rem', fontWeight: 'bold',
                    }}
                  >
                    {!user.profilePic && avatarLetter}
                  </Avatar>
                </IconButton>
              </Tooltip>
            )}

            {!isLoading && !isAuthenticated && (
              <Button variant="contained" sx={{
                width: 150, borderRadius: 4,
                backgroundColor: '#11B5E4',
                '&:hover': { backgroundColor: '#0b80a0' },
              }}>
                <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Fazer Login
                </Link>
              </Button>
            )}
          </Box>

          {/* === MENU DROPDOWN DO USUÁRIO (desktop) === */}
          <Menu
            sx={{ mt: 1 }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            disableScrollLock
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: '#0E1241',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                  minWidth: 200
                }
              }
            }}


          >
            {/* Cabeçalho com nome e email */}
            {user && (
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{user.nickname}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                  {user.email}
                </Typography>
              </Box>
            )}

            <MenuItem onClick={() => { handleCloseUserMenu(); router.push('/conta'); }}>
              <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Minha conta
            </MenuItem>

            <MenuItem onClick={() => { handleCloseUserMenu(); router.push('/configuracoes'); }}>
              <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Configurações
            </MenuItem>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            <MenuItem onClick={handleLogout} sx={{ color: '#ff6b6b' }}>
              <ListItemIcon sx={{ color: '#ff6b6b', minWidth: 36 }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Encerrar sessão
            </MenuItem>
          </Menu>

        </Toolbar>
      </Box>
    </AppBar>
  );
}

export default ResponsiveAppBar;
