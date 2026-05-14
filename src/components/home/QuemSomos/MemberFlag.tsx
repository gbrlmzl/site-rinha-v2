'use client';

import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Image from 'next/image';
import { QUEM_SOMOS_TOKENS } from '@/theme';
import type { Member } from '@/data/members';

type Props = {
  member: Member;
  onOpenInfo: (member: Member) => void;
};

export default function MemberFlag({ member, onOpenInfo }: Props) {
  const githubUrl = `https://github.com/${member.githubUser}`;
  const avatarUrl = `${githubUrl}.png?size=240`;
  const sx = QUEM_SOMOS_TOKENS.sx;

  return (
    <Box sx={sx.flag}>
      <Box className="flag-gradient" sx={sx.flagGradient} />

      <Box sx={sx.flagContent}>
        <Tooltip title={`Ir ao GitHub de ${member.realName}`} arrow>
          <Box
            component="a"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={sx.avatarWrapper}
            aria-label={`GitHub de ${member.nickname}`}
          >
            <Box sx={sx.avatarImageHolder}>
              <Image
                src={avatarUrl}
                alt={`Avatar de ${member.nickname}`}
                width={120}
                height={120}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                unoptimized
              />
            </Box>
            <Box sx={sx.githubBadge}>
              <GitHubIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        </Tooltip>

        <Typography sx={sx.realName}>{member.realName}</Typography>
        <Typography sx={sx.nickname}>{member.nickname}</Typography>
        <Typography sx={sx.shortBio}>{member.shortBio}</Typography>

        <Chip
          label={member.role}
          variant="outlined"
          size="small"
          sx={sx.roleChip}
        />

        <Box sx={sx.flagFooter}>
          <Tooltip title="Mais informações" arrow>
            <IconButton
              sx={sx.infoButton}
              onClick={() => onOpenInfo(member)}
              aria-label={`Mais informações sobre ${member.nickname}`}
            >
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
