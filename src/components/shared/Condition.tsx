import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Stack, Typography } from '@mui/material';

type ConditionProps = {
  ok: boolean;
  text: string;
  textColor?: string;
  checkedColor?: string;
  uncheckedColor?: string;
};

const Condition = ({ ok, text, textColor, checkedColor, uncheckedColor }: ConditionProps) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {ok ? (
        <CheckCircleIcon
          fontSize="small"
          sx={{ color: checkedColor ?? 'success.main' }}
        />
      ) : (
        <RadioButtonUncheckedIcon
          fontSize="small"
          sx={{ color: uncheckedColor ?? 'text.disabled' }}
        />
      )}
      <Typography variant="body2" sx={{ color: textColor ?? 'text.primary' }}>
        {text}
      </Typography>
    </Stack>
  );
};

export default Condition;
