import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Stack, Typography } from "@mui/material";

type ConditionProps = {
    ok: boolean;
    text: string;
    textColor?: string
};

const Condition = ({ ok, text, textColor }: ConditionProps) => {
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            {ok ? (
                <CheckCircleIcon color="success" fontSize="small" />
            ) : (
                <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
            )}
            <Typography variant="body2" sx={{ color: textColor?? 'text.primary' }}>
                {text}
            </Typography>
        </Stack>
    );
};

export default Condition;