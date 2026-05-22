'use client';

import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import Image from 'next/image';
import { QUEM_SOMOS_TOKENS } from '@/theme';
import type { Member } from '@/data/members';

type Props = {
  member: Member | null;
  open: boolean;
  onClose: () => void;
};

export default function MemberInfoDialog({ member, open, onClose }: Props) {
  const sx = QUEM_SOMOS_TOKENS.sx;
  if (!member) return null;

  const githubUrl = `https://github.com/${member.githubUser}`;
  const avatarUrl = `${githubUrl}.png?size=160`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: sx.dialogPaper } }}
      fullWidth
    >
      <Box sx={sx.dialogHeader}>
        <Box
          component="a"
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            ...sx.avatarWrapper,
            width: 72,
            height: 72,
            flexShrink: 0,
          }}
          aria-label={`GitHub de ${member.nickname}`}
        >
          <Box sx={sx.avatarImageHolder}>
            <Image
              src={avatarUrl}
              alt={`Avatar de ${member.nickname}`}
              width={72}
              height={72}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              unoptimized
            />
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ ...sx.realName, mt: 0, fontSize: '1.1rem' }}>
            {member.realName}
          </Typography>
          <Typography sx={sx.nickname}>{member.nickname}</Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{ color: 'rgba(255,255,255,0.7)' }}
          aria-label="Fechar"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={sx.dialogBody}>
        {/*
        <Chip
          label={member.role}
          variant="outlined"
          size="small"
          sx={{ ...sx.roleChip, mt: 0, alignSelf: 'flex-start' }}
        />
        */}

        <Typography sx={sx.dialogBodyText}>{member.bio}</Typography>

        <Box
          component="a"
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            color: 'primary.main',
            fontSize: '0.9rem',
            mt: 1,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <GitHubIcon sx={{ fontSize: 18 }} />
          github.com/{member.githubUser}
        </Box>
      </DialogContent>
    </Dialog>
  );
}