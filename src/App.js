import { useEffect, useState } from "react";
import "./App.css";
import socket from "./server";
import InputField from "./components/InputField/InputField";
import MessageContainer from "./components/MessageContainer/MessageContainer";

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  
  useEffect(() => {

    // 1. 앱 시작 시, DB에서 이전 채팅 내역을 가져오는 함수
    const fetchInitialMessages = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/chats");
        if (!response.ok) {
          throw new Error("과거 대화 기록을 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setMessageList(data); // 가져온 데이터로 채팅 목록을 초기화
      } catch (error) {
        console.error(error);
      }
    };
    
    // 함수 실행
    fetchInitialMessages();

    // 2. 새로운 실시간 메시지를 수신하는 리스너
    const handleMessage = (newMessage) => {
      setMessageList((prevState) => [...prevState, newMessage]);
    };
    
    socket.on("message", handleMessage);

    // 3. 사용자 이름 묻기 (로그인 정보가 없을 때만)
    if (!user) {
      askUserName();
    }

    // 컴포넌트가 사라질 때 소켓 리스너 정리 (메모리 누수 방지)
    return () => {
      socket.off("message", handleMessage);
    };
  }, []); // 의존성 배열 []이 비어있으므로 이 코드는 최초 렌더링 시 **단 한 번만** 실행됩니다.

  const askUserName = () => {
    const userName = prompt("당신의 이름을 입력하세요");
    if (userName) {
      socket.emit("login", userName, (res) => {
        if (res?.ok) {
          setUser(res.data);
        } else {
          alert(`로그인 실패: ${res.error}`);
        }
      });
    }
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    socket.emit("sendMessage", message, (res) => {
      if(res?.ok) {
          setMessage("");
      } else {
          alert(`메시지 전송 실패: ${res.error}`);
      }
    });
  };

  return (
    <div>
      <div className="App">
        <MessageContainer messageList={messageList} user={user} />
        <InputField
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default App;