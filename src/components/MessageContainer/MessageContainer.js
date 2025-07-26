
import { Container } from "@mui/system";
import "./MessageContainer.css";

const MessageContainer = ({ messageList, user }) => {
  return (
    <div>
      {messageList.map((message, index) => {
        return (
          <Container key={message._id || index} className="message-container">
            {message.user.name === "system" ? (
              <div className="system-message-container">
                <p className="system-message">{message.chat}</p>
              </div>
            ) : user && message.user.name === user.name ? (
              <div className="my-message-container">
                <div className="my-message">{message.chat}</div>
              </div>
            ) : (
              <div className="your-message-container">
                <img
                  src="/profile.jpeg" // 기본 프로필 이미지
                  alt="profile"
                  className="profile-image"
                />
                <div className="your-message-content">
                  {/* ▼▼▼▼▼ 이 부분이 핵심 수정사항입니다 ▼▼▼▼▼ */}
                  {
                    // 첫 메시지이거나, 바로 이전 메시지를 보낸 사람과 다를 경우에만 이름을 표시
                    (index === 0 || messageList[index - 1].user.name !== message.user.name) && (
                      <div className="user-name">{message.user.name}</div>
                    )
                  }
                  {/* ▲▲▲▲▲ 여기까지가 핵심 수정사항입니다 ▲▲▲▲▲ */}
                  <div className="your-message">{message.chat}</div>
                </div>
              </div>
            )}
          </Container>
        );
      })}
    </div>
  );
};

export default MessageContainer;
