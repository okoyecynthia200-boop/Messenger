import { useEffect, useMemo, useState } from "react";
import "../styles/Chat.css";

import Button from "../components/Button";

import { useNavigate } from "react-router-dom";

import { HiOutlineDotsHorizontal } from "react-icons/hi";

import {
  IoAdd,
  IoChatbubbleOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { apiRequest, clearSession, getStoredUser } from "../api";

function ProfileAvatar({ avatar, alt, className }) {
  return avatar ? (
    <img className={className} src={avatar} alt={alt} />
  ) : (
    <span className={`${className} blank-avatar`} aria-label={alt} />
  );
}

function Chat() {
  const navigate = useNavigate();
  const currentUser = useMemo(() => getStoredUser(), []);
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserQuery, setAddUserQuery] = useState("");
  const [addUserResults, setAddUserResults] = useState([]);
  const [addUserStatus, setAddUserStatus] = useState("");
  const [status, setStatus] = useState("Loading conversations...");

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    let isActive = true;
    const loadConversations = () => {
      apiRequest("/conversations")
        .then((data) => {
          if (!isActive) return;
          setConversations(data);
          setStatus(data.length ? "" : "Search for a user to start chatting.");
        })
        .catch((error) => {
          if (isActive) setStatus(error.message);
        });
    };

    loadConversations();
    const refreshConversations = window.setInterval(loadConversations, 2000);

    return () => {
      isActive = false;
      window.clearInterval(refreshConversations);
    };
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timeout = setTimeout(() => {
      apiRequest(`/users/search?username=${encodeURIComponent(query.trim())}`)
        .then(setUsers)
        .catch((error) => setStatus(error.message));
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!showAddUser) {
      return;
    }

    if (!addUserQuery.trim()) {
      return;
    }

    const timeout = setTimeout(() => {
      apiRequest(`/users/search?username=${encodeURIComponent(addUserQuery.trim())}`)
        .then((data) => {
          setAddUserResults(data);
          setAddUserStatus(data.length ? "" : "No users found.");
        })
        .catch((error) => {
          setAddUserResults([]);
          setAddUserStatus(error.message);
        });
    }, 250);

    return () => clearTimeout(timeout);
  }, [addUserQuery, showAddUser]);

  const openConversation = async (userId) => {
    try {
      const conversation = await apiRequest(`/conversations/${userId}`, {
        method: "POST",
      });
      setShowAddUser(false);
      setAddUserQuery("");
      setAddUserResults([]);
      navigate(`/conversation/${conversation._id}`);
    } catch (error) {
      setStatus(error.message);
    }
  };

  const getOtherMember = (conversation) =>
    conversation.members.find((member) => member._id !== currentUser?.id) ||
    conversation.members[0];

  const addUserMessage = !addUserQuery.trim()
    ? "Type a username to add someone."
    : addUserStatus || (!addUserResults.length ? "Searching..." : "");

  return (
    <div className="chat-page">
      <div className="top-bar">
        <Button
          icon={<HiOutlineDotsHorizontal />}
          className="icon-btn"
          onClick={() => {
            clearSession();
            navigate("/");
          }}
        />

        <div className="top-right">
          <Button
            icon={<IoAdd />}
            className="icon-btn add-btn"
            onClick={() => {
              setShowAddUser((isOpen) => !isOpen);
              setAddUserQuery("");
              setAddUserResults([]);
              setAddUserStatus("");
            }}
          />

          {showAddUser && (
            <div className="add-user-dropdown">
              <input
                className="add-user-input"
                placeholder="Add user by username"
                value={addUserQuery}
                autoFocus
                onChange={(event) => {
                  setAddUserQuery(event.target.value);
                  setAddUserResults([]);
                  setAddUserStatus("");
                }}
              />

              <div className="add-user-list">
                {addUserResults.map((user) => (
                  <button
                    className="add-user-option"
                    key={user._id}
                    type="button"
                    onClick={() => openConversation(user._id)}
                  >
                    <ProfileAvatar
                      avatar={user.avatar}
                      alt=""
                      className="add-user-avatar"
                    />

                    <span>
                      <strong>{user.username}</strong>
                      <small>Add to chats</small>
                    </span>
                  </button>
                ))}

                {addUserMessage && (
                  <p className="add-user-status">{addUserMessage}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <h1>Chats</h1>

      <input
        className="search-box"
        placeholder="Search users..."
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          if (!event.target.value.trim()) {
            setUsers([]);
          }
        }}
      />

      {query.trim() &&
        users.map((user) => (
          <div className="contact" key={user._id} onClick={() => openConversation(user._id)}>
            <ProfileAvatar
              avatar={user.avatar}
              alt=""
              className="contact-avatar"
            />

            <div>
              <h3>{user.username}</h3>
              <p>Start a conversation</p>
            </div>
          </div>
        ))}

      {!query.trim() &&
        conversations.map((conversation) => {
          const otherMember = getOtherMember(conversation);
          return (
            <div
              className="contact"
              key={conversation._id}
              onClick={() => navigate(`/conversation/${conversation._id}`)}
            >
              <ProfileAvatar
                avatar={otherMember?.avatar}
                alt=""
                className="contact-avatar"
              />

              <div>
                <h3>{otherMember?.username || "Conversation"}</h3>
                <p>{conversation.lastMessage?.text || "No messages yet"}</p>
              </div>

              {conversation.unreadCount > 0 && (
                <span
                  className="message-count"
                  aria-label={`${conversation.unreadCount} unread messages`}
                >
                  {conversation.unreadCount}
                </span>
              )}
            </div>
          );
        })}

      {status && <p className="empty-state">{status}</p>}

      <div className="bottom-nav">
        <Button
          icon={<IoChatbubbleOutline />}
          text="Chats"
          className="nav-btn"
        />

        <Button
          icon={<IoPersonOutline />}
          text="You"
          className="nav-btn"
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
}

export default Chat;
