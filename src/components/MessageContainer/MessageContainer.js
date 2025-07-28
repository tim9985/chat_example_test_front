// src/components/MessageContainer/MessageContainer.js

import React, { useEffect, useRef } from "react"; // ✅ useRef, useEffect 임포트
import "./MessageContainer.css";

const MessageContainer = ({ messageList, user }) => {
  const messagesEndRef = useRef(null); // ✅ 스크롤 위치를 참조할 ref

  // 메시지 목록이 업데이트될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]); // messageList가 변경될 때마다 실행

  // 디버깅용: MessageContainer가 받은 데이터를 콘솔에 출력 (필요 없으면 삭제해도 됩니다)
  // console.log("MessageContainer가 받은 데이터:", messageList); 

  return (
    <div className="chat-wrapper">
      {messageList.map((message, index) => {
        // key에 _id가 없으면 문제가 될 수 있으므로, message.id 또는 고유한 값을 사용하는 것을 권장합니다.
        const key = message._id || `message-${index}-${message.chat.substring(0, 5)}`; 
        
        const isSystem = message.user.name === "system";
        const isMyMessage = user && message.user.name === user.name;
        const isFirstMessage = index === 0;
        const prevMessage = messageList[index - 1];
        const isSameSenderAsPrev = !isFirstMessage && prevMessage.user.name === message.user.name;

        return (
          <div key={key} className={`message-item-wrapper ${isSystem ? 'system' : isMyMessage ? 'my' : 'your'}`}>
            {isSystem ? (
              <div className="system-message-container">
                <p className="system-message">{message.chat}</p>
              </div>
            ) : isMyMessage ? (
              <div className="my-message-container">
                <div className="my-message">
                  {/* 메시지 뒤에 이모티콘을 바로 추가 */}
                  <span>{message.chat} {message.emoticon}</span> 
                </div>
              </div>
            ) : (
              <div className="your-message-container">
                {/* 프로필 조건부 렌더링 - 동일 발신자일 경우 빈 공간 유지 (마진을 위한) */}
                {!isSameSenderAsPrev ? (
                  <img
                    src="/profile.jpeg"
                    alt="profile"
                    className="profile-image"
                  />
                ) : (
                  // 프로필 이미지와 동일한 너비와 마진을 갖는 빈 div로 대체하여 정렬 유지
                  <div className="profile-placeholder"></div>
                )}

                <div className="your-message-content">
                  {/* 이름 조건부 렌더링 - 동일 발신자일 경우 이름 숨김 */}
                  {!isSameSenderAsPrev && (
                    <div className="user-name">{message.user.name}</div>
                  )}
                  <div className="your-message">
                    {/* 메시지 뒤에 이모티콘을 바로 추가 */}
                    <span>{message.chat} {message.emoticon}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {/* 스크롤할 때 맨 아래를 가리킬 빈 div */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageContainer;