import Email from "./Email";
const Emails = ({ emails, onDelete, onToggle, onClick }) => {
  return (
    <>
      {emails.map((email, index) => (
        <Email
          key={index}
          email={email}
          onDelete={onDelete}
          onToggle={onToggle}
          onClick={onClick}
        />
      ))}
    </>
  );
};

export default Emails;
