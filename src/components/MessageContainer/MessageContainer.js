// src/components/MessageContainer/MessageContainer.jsx

import React, { useEffect, useRef } from "react";
import "./MessageContainer.css";

const MessageContainer = ({ messageList, user, showEmoticon = true }) => {
  const messagesEndRef = useRef(null); // ✅ 스크롤 위치를 참조할 ref

  // 메시지 목록이 업데이트될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <div className="chat-wrapper">
      {messageList.map((message, index) => {
        const key = message._id || `message-${index}-${message.chat.substring(0, 5)}`;

        const isSystem = message.user.name === "system";
        const isMyMessage = user && message.user.name === user.name;
        const isFirstMessage = index === 0;
        const prevMessage = messageList[index - 1];
        const isSameSenderAsPrev =
          !isFirstMessage && prevMessage.user.name === message.user.name;

        // 이모티콘 출력 여부 설정
        const emoji = showEmoticon ? message.emoticon : "";

        return (
          <div
            key={key}
            className={`message-item-wrapper ${isSystem ? "system" : isMyMessage ? "my" : "your"}`}
          >
            {isSystem ? (
              <div className="system-message-container">
                <p className="system-message">{message.chat}</p>
              </div>
            ) : isMyMessage ? (
              <div className="my-message-container">
                <div className="my-message">
                  {/* 내 메시지 + 이모티콘 */}
                  <span>{message.chat} {emoji}</span>
                </div>
              </div>
            ) : (
              <div className="your-message-container">
                {/* 프로필 이미지 (이전 보낸 사람과 다를 때만 표시) */}
                {!isSameSenderAsPrev ? (
                  <img
                    src="/profile.jpeg"
                    alt="profile"
                    className="profile-image"
                  />
                ) : (
                  <div className="profile-placeholder"></div>
                )}

                <div className="your-message-content">
                  {/* 유저 이름 (이전 보낸 사람과 다를 때만 표시) */}
                  {!isSameSenderAsPrev && (
                    <div className="user-name">{message.user.name}</div>
                  )}
                  <div className="your-message">
                    {/* 상대 메시지 + 이모티콘 */}
                    <span>{message.chat} {emoji}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {/* 스크롤 제어용 빈 요소 */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageContainer;