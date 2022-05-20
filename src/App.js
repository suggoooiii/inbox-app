import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
// import shortid from "shortid";

// my imports
import "./App.css";
import Emails from "./components/Emails";
import MyButton from "./components/MyButton";
import Email from "./components/Email";

function App() {
  // state
  const [emails, setEmails] = useState([]);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  // Modal state
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const totalMessages = emails.length;
  const unReadMessages = emails.filter((e) => e.isRead === false).length;
  const navigate = useNavigate();

  // lifecycle
  useEffect(() => {
    const getEmails = async () => {
      const emailsFromServer = await fetchEmails();
      setEmails(emailsFromServer);
    };

    getEmails();
  }, []);

  // navigate to messagePage with e state
  const onClickMessage = (e) => {
    console.log(e);
    navigate("/messagepage", { state: e });
  };

  //fetch emails && get data
  const fetchEmails = async () => {
    const res = await fetch("http://localhost:5000/emails");
    const data = await res.json();
    return data;
  };

  // fetch a single email
  const fetchEmail = async (id) => {
    const res = await fetch(`http://localhost:5000/emails/${id}`);
    const data = await res.json();

    return data;
  };

  // Modal Style
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const addEmail = async (email) => {
    const res = await fetch("http://localhost:5000/emails", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(email),
    });

    const data = await res.json();

    setEmails([...emails, data]);
  };

  const deleteEmail = async (id) => {
    const res = await fetch(`http://localhost:5000/emails/${id}`, {
      method: "DELETE",
    });
    //We should control the response status to decide if we will change the state or not.
    res.status === 200
      ? setEmails(emails.filter((email) => email.id !== id))
      : alert("Error Deleting This Task");
  };

  // Toggle Read
  const toggleRead = async (id) => {
    const taskToToggle = await fetchEmail(id);
    const updEmail = { ...taskToToggle, isRead: !taskToToggle.isRead };

    const res = await fetch(`http://localhost:5000/emails/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updEmail),
    });

    const data = await res.json();

    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, isRead: data.isRead } : email
      )
    );
  };

  function Home() {
    return (
      <>
        <main>
          <h2>Hello Jim !</h2>
          <p>
            You have {unReadMessages} unread messages out of {totalMessages}
          </p>
        </main>
        <nav>
          <Link to="/inbox">View Inbox</Link>
        </nav>
      </>
    );
  }

  function MessagePage() {
    // receive state from prev screen
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();

    return (
      <>
        <h3>{state.subject}</h3>
        <main>
          <h5>{state.content}</h5>
          <nav>
            <MyButton
              onClick={() => navigate(-1)}
              color="black"
              text="go back"
            />
          </nav>
        </main>
      </>
    );
  }

  function InboxPage() {
    return (
      <main>
        {/* <MyButton text="compose email" /> */}
        <MyButton text="Show All" onClick={() => setShowAll(!showAll)} />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 2000,
          }}
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>
        {showAll ? (
          <UnreadEmails />
        ) : (
          <Emails
            emails={emails}
            onDelete={deleteEmail}
            onToggle={toggleRead}
            onClick={onClickMessage}
          />
        )}
        <nav className="nav">
          <Link to="/">Home</Link>
        </nav>
      </main>
    );
  }

  function UnreadEmails() {
    return emails
      .filter((e) => e.isRead === false)
      .map((e, i) => (
        <Email
          onDelete={deleteEmail}
          onToggle={toggleRead}
          key={i}
          email={e}
          onClick={onClickMessage}
        />
      ));
  }

  return (
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="messagepage" element={<MessagePage />} />
          <Route path="inbox" element={<InboxPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
