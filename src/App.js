import { useEffect, useState } from "react";
import "./App.css";
import socket from "./server";
import InputField from "./components/InputField/InputField";
import MessageContainer from "./components/MessageContainer/MessageContainer";
import LoginModal from "./components/LoginModal/LoginModal";

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  // 이모티콘 On/Off 상태 (기본: On)
  const [showEmoticon, setShowEmoticon] = useState(true);

  useEffect(() => {
    // DB에서 과거 메시지 불러오기
    const fetchInitialMessages = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/chats");
        if (!response.ok) {
          throw new Error("과거 대화 기록을 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setMessageList(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInitialMessages();

    // 실시간 메시지 수신 처리
    const handleMessage = (newMessage) => {
      setMessageList((prevState) => [...prevState, newMessage]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  // 로그인
  const handleLogin = ({ name, password }) => {
    return new Promise((resolve, reject) => {
      socket.emit("login", { name, password }, (res) => {
        if (res?.ok) {
          setUser(res.user || res.data);
          resolve(res.user || res.data);
        } else {
          reject(new Error(res.error || "로그인 실패"));
        }
      });
    });
  };

  // 회원가입
  const handleRegister = ({ name, password }) => {
    return new Promise((resolve, reject) => {
      socket.emit("register", { name, password }, (res) => {
        if (res?.ok) {
          resolve(res.user || res.data);
        } else {
          reject(new Error(res.error || "회원가입 실패"));
        }
      });
    });
  };

  // 메시지 전송
  const sendMessage = (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    socket.emit("sendMessage", message, (res) => {
      if (res?.ok) {
        setMessage("");
      } else {
        alert(`메시지 전송 실패: ${res.error}`);
      }
    });
  };

  // 이모티콘 버튼 토글
  const toggleEmoticon = () => {
    setShowEmoticon((prev) => !prev);
  };

  return (
    <div className="App">
      {!user && <LoginModal onLogin={handleLogin} onRegister={handleRegister} />}
      {user && (
        <>
          <MessageContainer
            messageList={messageList}
            user={user}
            showEmoticon={showEmoticon}
          />
          <InputField
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            showEmoticon={showEmoticon}
            toggleEmoticon={() => setShowEmoticon(prev => !prev)}
          />
        </>
      )}
    </div>
  );
}

export default App;