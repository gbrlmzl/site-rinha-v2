'use client';

import { Box, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { ABOUT_SECTION_TOKENS, QUEM_SOMOS_TOKENS } from '@/theme';
import { MEMBERS, type Member } from '@/data/members';
import HScrollSnap from '@/components/shared/HScrollSnap';
import MemberFlag from './MemberFlag';
import MemberInfoDialog from './MemberInfoDialog';

// Ordem específica do desktop: com active=0 a vista inicial mostra
// [Ryan | Gabriel (centro) | Victor]. Mobile mantém a ordem em MEMBERS.
const DESKTOP_ORDER: Member[] = (() => {
  const byId = (id: string) => MEMBERS.find((m) => m.id === id)!;
  return [
    byId('gbrlmzl'),         // centro
    byId('victorhugosalv'),  // direita (+1)
    byId('JohnWesleyPinto'), // oculto (+2)
    byId('JoseRyanBeserra'), // oculto (-2)
    byId('ryanpsouzaa'),     // esquerda (-1, via wrap)
  ];
})();

export default function QuemSomos() {
  const sx = QUEM_SOMOS_TOKENS.sx;
  const total = DESKTOP_ORDER.length;
  const [active, setActive] = useState(0);
  const [openMember, setOpenMember] = useState<Member | null>(null);

  const goTo = (idx: number) =>
    setActive(((idx % total) + total) % total);

  // Offset relativo (-, 0, +) com wrap-around — apenas |offset|<=1 fica visível
  const slots = useMemo(() => {
    return DESKTOP_ORDER.map((member, i) => {
      let offset = i - active;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;
      return { member, offset };
    });
  }, [active, total]);

  return (
    <Box sx={ABOUT_SECTION_TOKENS.sx.topicBox}>
      <Typography sx={ABOUT_SECTION_TOKENS.sx.topicTitle}>Quem somos</Typography>
      <Box sx={ABOUT_SECTION_TOKENS.sx.titleDivider} />

      <Box sx={ABOUT_SECTION_TOKENS.sx.textContainer}>
        <Typography sx={ABOUT_SECTION_TOKENS.sx.topicText}>
          A Rinha da UFPB nasceu da iniciativa de um grupo de amigos que
          transformou a vontade de jogar em um torneio de verdade. Conheça quem
          está por trás da organização.
        </Typography>
      </Box>

      <Box sx={sx.sectionContainer}>
        {/* Desktop: carrossel 3D com centro + adjacentes */}
        <Box sx={sx.desktopViewport}>
          {slots.map(({ member, offset }) => (
            <Box
              key={member.id}
              sx={sx.desktopSlot(offset)}
              onClick={() => {
                if (offset === -1 || offset === 1) goTo(active + offset);
              }}
            >
              <MemberFlag member={member} onOpenInfo={setOpenMember} />
            </Box>
          ))}
        </Box>

        {/* Mobile: scroll-snap horizontal */}
        <HScrollSnap sx={sx.mobileViewport}>
          {MEMBERS.map((member) => (
            <Box key={member.id} sx={sx.mobileSlot}>
              <MemberFlag member={member} onOpenInfo={setOpenMember} />
            </Box>
          ))}
        </HScrollSnap>
      </Box>

      <MemberInfoDialog
        member={openMember}
        open={openMember !== null}
        onClose={() => setOpenMember(null)}
      />
    </Box>
  );
}
