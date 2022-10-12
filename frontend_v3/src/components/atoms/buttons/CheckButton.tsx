import Button from "@mui/material/Button";

interface CheckButtonProps {
  color: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  variant: "text" | "outlined" | "contained";
  content: string;
  isChecked?: boolean;
  onClick: () => void;
}

const CheckButton = (props: CheckButtonProps): JSX.Element => {
  const { color, variant, isChecked, onClick, content } = props;

  // TODO: 상위 컴포넌트에 isChecked 상태 관리하는 이벤트 핸들러 구현 필요
  return (
    <Button
      color={color}
      variant={variant}
      disabled={!isChecked}
      onClick={onClick}
      sx={{
        "&:focus": {
          border: 0,
          outline: 0,
        },
        marginLeft: "0.25rem",
        marginRight: "0.25rem",
      }}
    >
      {content}
    </Button>
  );
};

CheckButton.defaultProps = {
  isChecked: true,
};

export default CheckButton;
