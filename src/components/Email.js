import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const Email = ({ email, onToggle, onDelete, onClick }) => {
  return (
    <div
      onClick={() => onClick(email)}
      className={`Email ${email.isRead && "isRead"}`}
      onDoubleClick={() => onToggle(email.id)}
    >
      <h3 className={`${email.isRead && "isRead"}`}>
        {email.subject}
        <DeleteOutlineRoundedIcon
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => onDelete(email.id)}
        />
      </h3>
      <p>{email.content}</p>
    </div>
  );
};

export default Email;
