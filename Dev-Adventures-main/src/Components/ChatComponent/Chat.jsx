import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { MessageCircle, X, ArrowLeft, ImageIcon } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [connection, setConnection] = useState(null);
  const [newMessages, setNewMessages] = useState({});
  const [userId, setUserId] = useState(null);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const messagesEndRef = useRef(null);

  const constructImageUrl = (profileImage) => {
    if (!profileImage) return null;
    if (profileImage.startsWith("/")) {
      return `http://localhost:5101${profileImage}`;
    }
    return `http://localhost:5101/images/profiles/${profileImage}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let mounted = true;
    let currentUserId = null;

    const connectToSignalR = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token not found");

        let decodedToken;
        try {
          decodedToken = jwtDecode(token);
          setUserId(decodedToken.userId);
          currentUserId = decodedToken.userId;
        } catch (error) {
          throw new Error("Invalid authentication token");
        }

        const newConnection = new signalR.HubConnectionBuilder()
          .withUrl("http://localhost:5101/chathub", {
            transport: signalR.HttpTransportType.WebSockets,
            accessTokenFactory: () => localStorage.getItem("authToken"),
          })
          .withAutomaticReconnect([0, 2000, 5000, 10000, null])
          .configureLogging(signalR.LogLevel.Debug)
          .build();

        newConnection.on("ReceiveMessage", (senderId, messageContent) => {
          setMessages((prev) => {
            const isSentByMe = senderId === userId;

            if (
              prev.some(
                (msg) =>
                  msg.senderId === senderId && msg.text === messageContent
              )
            ) {
              return prev;
            }

            return [
              ...prev,
              {
                senderId,
                text: messageContent,
                isSentByMe,
                timestamp: new Date(),
              },
            ];
          });
        });

        newConnection.on("NewMessageNotification", (senderId) => {
          if (
            senderId !== userId &&
            (!selectedUser || selectedUser.id !== senderId)
          ) {
            setNewMessages((prev) => {
              const updated = { ...prev, [senderId]: true };
              setHasNewMessages(Object.values(updated).some((val) => val));
              return updated;
            });
          }
        });

        newConnection.on("AvailableUsers", (users) => {
          if (mounted) {
            const usersWithImages = users.map(user => ({
              ...user,
              profileImageUrl: constructImageUrl(user.profileImage)
            }));
            setOnlineUsers(usersWithImages || []);
          }
        });

        newConnection.on("ChatHistory", (history, currentUserId) => {
          if (mounted) {
            const formattedMessages = history.map((m) => ({
              senderId: m.senderId,
              text: m.content,
              isSentByMe: m.senderId === currentUserId,
              timestamp: new Date(m.timestamp),
            }));
            setMessages(formattedMessages);
          }
        });

        await newConnection.start();
        setConnection(newConnection);
        await newConnection.invoke("GetAvailableUsers");
      } catch (err) {
        console.error("SignalR Connection Error:", err.message);
      }
    };

    connectToSignalR();
    return () => {
      mounted = false;
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  const sendMessage = async () => {
    if (connection && message.trim() !== "" && selectedUser) {
      const trimmedMessage = message.trim();
      setMessage("");

      setMessages((prev) => [
        ...prev,
        {
          senderId: userId,
          text: trimmedMessage,
          isSentByMe: true,
          timestamp: new Date(),
        },
      ]);

      try {
        await connection.invoke("SendMessage", selectedUser.id, trimmedMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const selectUser = async (user) => {
    setSelectedUser(user);
    setMessages([]);
    setNewMessages((prev) => {
      const updated = { ...prev, [user.id]: false };
      setHasNewMessages(Object.values(updated).some((val) => val));
      return updated;
    });

    if (connection) {
      try {
        await connection.invoke("GetChatHistory", user.id);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderProfileImage = (user) => {
    if (user.profileImageUrl) {
      return (
        <img
          src={user.profileImageUrl}
          alt={user.fullname}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <ImageIcon className="text-gray-400 h-6 w-6" strokeWidth={1} />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 relative"
        >
          <MessageCircle size={24} />
          {hasNewMessages && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              ●
            </span>
          )}
        </button>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-xl w-96 h-[32rem] flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
            {selectedUser && (
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-lg font-semibold text-gray-100 flex-1 text-center">
              {selectedUser ? selectedUser.fullname : "Available Users"}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {!selectedUser ? (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-2">
                {onlineUsers.length === 0 ? (
                  <div className="text-gray-400 text-center mt-4">
                    No users available
                  </div>
                ) : (
                  onlineUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => selectUser(user)}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded cursor-pointer"
                    >
                      {renderProfileImage(user)}
                      <span className="text-gray-100 flex-1">
                        {user.fullname}
                      </span>
                      {newMessages[user.id] && (
                        <span className="text-red-500 text-lg mr-2">●</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.isSentByMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-xs ${
                        msg.isSentByMe
                          ? "bg-blue-500 text-white"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-gray-700 text-gray-100 rounded px-4 py-2"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;