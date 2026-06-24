import { useEffect, useMemo, useState } from "react";
import "../styles/Conversation.css";

import Button from "../components/Button";

import { useNavigate, useParams } from "react-router-dom";
import { apiRequest, getStoredUser } from "../api";

function Conversation() {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const currentUser = useMemo(() => getStoredUser(), []);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    let isActive = true;
    const markMessagesAsRead = () =>
      apiRequest(`/messages/read/${conversationId}`, { method: "PUT" }).catch(
        () => {},
      );

    Promise.all([
      apiRequest(`/conversations/${conversationId}`),
      apiRequest(`/messages/${conversationId}`),
    ])
      .then(([conversationData, messageData]) => {
        if (!isActive) return;
        setConversation(conversationData);
        setMessages(messageData);
        markMessagesAsRead();
      })
      .catch((requestError) => setError(requestError.message));

    const refreshMessages = window.setInterval(() => {
      apiRequest(`/messages/${conversationId}`)
        .then((messageData) => {
          if (!isActive) return;
          setMessages(messageData);
          markMessagesAsRead();
        })
        .catch(() => {});
    }, 2000);

    return () => {
      isActive = false;
      window.clearInterval(refreshMessages);
    };
  }, [conversationId, currentUser, navigate]);

  const otherMember = conversation?.members.find(
    (member) => String(member._id) !== String(currentUser?.id),
  );

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;

    try {
      const message = await apiRequest(`/messages/${conversationId}`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      setMessages((current) => [...current, message]);
      setText("");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="conversation-page">
      <div className="conversation-header">
        <button
          className="conversation-back"
          type="button"
          aria-label="Back to chats"
          onClick={() => navigate("/chat")}
        >
          ←
        </button>

        {otherMember?.avatar ? (
          <img src={otherMember.avatar} alt="" />
        ) : (
          <span className="conversation-avatar" aria-hidden="true" />
        )}

        <h3>{otherMember?.username || "Conversation"}</h3>
      </div>

      <div className="messages">
        {messages.map((message) => {
          const senderId = message.sender?._id || message.sender;
          const isOutgoing = String(senderId) === String(currentUser?.id);
          const isSeen =
            isOutgoing &&
            message.readBy?.some(
              (userId) =>
                String(userId?._id || userId) === String(otherMember?._id),
            );

          return (
            <div
              className={`message ${isOutgoing ? "right" : "left"} ${
                isSeen ? "seen" : ""
              }`}
              key={message._id}
            >
              <span className="message-text">{message.text}</span>
              <time className="message-time" dateTime={message.createdAt}>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
          );
        })}

        {!messages.length && !error && (
          <p className="conversation-status">No messages yet.</p>
        )}

        {error && <p className="conversation-status">{error}</p>}
      </div>

      <form className="input-box" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type something..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        <Button text="Send" className="send-btn" type="submit" />
      </form>
    </div>
  );
}

export default Conversation;
