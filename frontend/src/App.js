import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

import {
  FiPlus,
  FiMessageSquare,
  FiSend,
  FiZap
} from "react-icons/fi";

import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("khushi-ai-chats");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeId, setActiveId] = useState(() => {
    const saved = localStorage.getItem("khushi-ai-active");
    return saved || null;
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(
      "khushi-ai-chats",
      JSON.stringify(conversations)
    );
  }, [conversations]);

  useEffect(() => {
    if (activeId) {
      localStorage.setItem(
        "khushi-ai-active",
        activeId
      );
    }
  }, [activeId]);

  const activeConversation =
    conversations.find(
      (c) => c.id === activeId
    ) || null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [activeConversation]);

  const createNewChat = () => {
    const id = Date.now().toString();

    const chat = {
      id,
      title: "New Conversation",
      messages: []
    };

    setConversations((prev) => [
      chat,
      ...prev
    ]);

    setActiveId(id);
  };

  const updateConversation = (
    id,
    messages,
    title = null
  ) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id
          ? {
              ...conv,
              messages,
              title:
                title ||
                conv.title
            }
          : conv
      )
    );
  };

  const sendMessage = async (
    customPrompt = null
  ) => {
    const prompt =
      customPrompt || message;

    if (!prompt.trim()) return;

    let currentId = activeId;

    if (!currentId) {
      currentId =
        Date.now().toString();

      const newChat = {
        id: currentId,
        title:
          prompt.length > 30
            ? prompt.slice(0, 30) +
              "..."
            : prompt,
        messages: []
      };

      setConversations((prev) => [
        newChat,
        ...prev
      ]);

      setActiveId(currentId);
    }

    const conversation =
      conversations.find(
        (c) => c.id === currentId
      ) || {
        messages: []
      };

    const updatedMessages = [
      ...conversation.messages,
      {
        sender: "user",
        text: prompt
      }
    ];

    updateConversation(
      currentId,
      updatedMessages,
      prompt.slice(0, 30)
    );

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/ask",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            prompt
          })
        }
      );

      const data =
        await res.json();

      const finalMessages = [
        ...updatedMessages,
        {
          sender: "ai",
          text: data.response
        }
      ];

      updateConversation(
        currentId,
        finalMessages
      );
    } catch (error) {
      const finalMessages = [
        ...updatedMessages,
        {
          sender: "ai",
          text:
            "⚠️ Unable to connect to backend."
        }
      ];

      updateConversation(
        currentId,
        finalMessages
      );
    }

    setLoading(false);
  };

  const suggestions = [
    "Create a React Login Form",
    "Explain Binary Search",
    "Generate Python Project Ideas",
    "Teach Dynamic Programming"
  ];

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="brand">

          <FiZap />

          <span>
            Khushi AI
          </span>

        </div>

        <button
          className="new-chat-btn"
          onClick={createNewChat}
        >
          <FiPlus />
          New Chat
        </button>

        <div className="history">

          {conversations.map(
            (conv) => (
              <div
                key={conv.id}
                className={`history-item ${
                  activeId === conv.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveId(
                    conv.id
                  )
                }
              >
                <FiMessageSquare />
                <span>
                  {conv.title}
                </span>
              </div>
            )
          )}

        </div>

      </aside>

      <main className="main">

        {!activeConversation ||
        activeConversation.messages
          .length === 0 ? (

          <motion.div
            className="landing"
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
          >

            <div className="hero-icon">
              🤖
            </div>

            <h1>
              Khushi AI
            </h1>

            <p>
              Your Premium Coding
              Assistant
            </p>

            <div className="suggestions">

              {suggestions.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={index}
                    className="suggestion-card"
                    onClick={() =>
                      sendMessage(
                        item
                      )
                    }
                  >
                    {item}
                  </div>
                )
              )}

            </div>

          </motion.div>

        ) : (

          <div className="chat-box">

            {activeConversation.messages.map(
              (
                msg,
                index
              ) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 20
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  className={`message ${msg.sender}`}
                >

                  {msg.sender ===
                  "ai" ? (
                    <ReactMarkdown>
                      {
                        msg.text
                      }
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}

                </motion.div>
              )
            )}

            {loading && (
              <div className="typing">
                <span />
                <span />
                <span />
              </div>
            )}

            <div
              ref={
                chatEndRef
              }
            />

          </div>

        )}

        <div className="floating-input">

          <input
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            placeholder="Ask anything..."
            onKeyDown={(e) =>
              e.key ===
                "Enter" &&
              sendMessage()
            }
          />

          <button
            onClick={() =>
              sendMessage()
            }
          >
            <FiSend />
          </button>

        </div>

      </main>

    </div>
  );
}

export default App;