/**
 * 🚀 Día 13: Real-time Updates con WebSockets
 *
 * Implementación de comunicación en tiempo real
 * usando WebSockets con React para crear aplicaciones interactivas
 *
 * Conceptos clave:
 * - WebSocket connections
 * - Real-time communication
 * - Event handling
 * - Connection management
 * - Heartbeat y reconnection
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// 1. WebSocket Manager Class
class WebSocketManager {
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      ...options,
    };

    this.ws = null;
    this.reconnectAttempts = 0;
    this.heartbeatTimer = null;
    this.listeners = new Map();
    this.isConnected = false;
    this.shouldReconnect = true;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.handleReconnect();
    }
  }

  handleOpen(event) {
    console.log('✅ WebSocket connected');
    this.isConnected = true;
    this.reconnectAttempts = 0;

    // Iniciar heartbeat
    this.startHeartbeat();

    // Notificar listeners
    this.emit('connected', event);
  }

  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);

      // Manejar mensajes de heartbeat
      if (data.type === 'pong') {
        return;
      }

      // Emitir evento específico
      this.emit(data.type, data);

      // Emitir evento genérico
      this.emit('message', data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  handleClose(event) {
    console.log('🔌 WebSocket disconnected:', event.code, event.reason);
    this.isConnected = false;

    // Detener heartbeat
    this.stopHeartbeat();

    // Notificar listeners
    this.emit('disconnected', event);

    // Intentar reconectar
    if (this.shouldReconnect && event.code !== 1000) {
      this.handleReconnect();
    }
  }

  handleError(error) {
    console.error('❌ WebSocket error:', error);
    this.emit('error', error);
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.options.maxReconnectAttempts) {
      this.reconnectAttempts++;

      console.log(
        `🔄 Reconnecting... (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`
      );

      setTimeout(() => {
        this.connect();
      }, this.options.reconnectInterval);
    } else {
      console.error('❌ Max reconnection attempts reached');
      this.emit('reconnectionFailed');
    }
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'ping' });
      }
    }, this.options.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  send(data) {
    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected, message queued');
      // Aquí podrías implementar una cola de mensajes
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event).add(callback);

    // Retornar función para desuscribir
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket listener:', error);
        }
      });
    }
  }

  disconnect() {
    this.shouldReconnect = false;
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
    }
  }
}

// 2. React Hook para WebSocket
const useWebSocket = (url, options = {}) => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);

  const wsRef = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
    }

    wsRef.current = new WebSocketManager(url, options);

    // Configurar listeners
    wsRef.current.on('connected', () => {
      setConnectionStatus('Connected');
    });

    wsRef.current.on('disconnected', () => {
      setConnectionStatus('Disconnected');
    });

    wsRef.current.on('error', () => {
      setConnectionStatus('Error');
    });

    wsRef.current.on('message', data => {
      setLastMessage(data);
      setMessageHistory(prev => [...prev, data].slice(-100)); // Mantener solo últimos 100
    });

    wsRef.current.connect();
  }, [url, options]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback(data => {
    if (wsRef.current) {
      wsRef.current.send(data);
    }
  }, []);

  const addEventListener = useCallback((event, callback) => {
    if (wsRef.current) {
      return wsRef.current.on(event, callback);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connectionStatus,
    lastMessage,
    messageHistory,
    sendMessage,
    addEventListener,
    connect,
    disconnect,
  };
};

// 3. Componente de Chat en tiempo real
const ChatRoom = ({ roomId, userId, username }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [users, setUsers] = useState([]);
  const [isTyping, setIsTyping] = useState({});

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { connectionStatus, sendMessage, addEventListener } = useWebSocket(
    `ws://localhost:8080/chat/${roomId}`,
    {
      reconnectInterval: 2000,
      maxReconnectAttempts: 10,
    }
  );

  // Configurar event listeners
  useEffect(() => {
    if (!addEventListener) return;

    const unsubscribes = [
      // Mensajes del chat
      addEventListener('message', data => {
        if (data.type === 'chat_message') {
          setMessages(prev => [...prev, data.message]);
        }
      }),

      // Usuarios conectados
      addEventListener('users_update', data => {
        setUsers(data.users);
      }),

      // Indicador de escritura
      addEventListener('typing', data => {
        setIsTyping(prev => ({
          ...prev,
          [data.userId]: data.isTyping,
        }));
      }),

      // Usuario se unió
      addEventListener('user_joined', data => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            type: 'system',
            content: `${data.username} se unió al chat`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }),

      // Usuario se fue
      addEventListener('user_left', data => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            type: 'system',
            content: `${data.username} dejó el chat`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }),
    ];

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe && unsubscribe());
    };
  }, [addEventListener]);

  // Scroll automático a nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Unirse al chat cuando se conecta
  useEffect(() => {
    if (connectionStatus === 'Connected') {
      sendMessage({
        type: 'join_room',
        roomId,
        userId,
        username,
      });
    }
  }, [connectionStatus, roomId, userId, username, sendMessage]);

  const handleSendMessage = e => {
    e.preventDefault();

    if (inputValue.trim() && connectionStatus === 'Connected') {
      sendMessage({
        type: 'chat_message',
        roomId,
        message: {
          id: Date.now(),
          userId,
          username,
          content: inputValue.trim(),
          timestamp: new Date().toISOString(),
        },
      });

      setInputValue('');
    }
  };

  const handleTyping = e => {
    setInputValue(e.target.value);

    // Enviar indicador de escritura
    sendMessage({
      type: 'typing',
      roomId,
      userId,
      username,
      isTyping: true,
    });

    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Detener indicador después de 1 segundo
    typingTimeoutRef.current = setTimeout(() => {
      sendMessage({
        type: 'typing',
        roomId,
        userId,
        username,
        isTyping: false,
      });
    }, 1000);
  };

  const getTypingUsers = () => {
    return Object.entries(isTyping)
      .filter(([id, typing]) => typing && id !== userId)
      .map(([id]) => users.find(u => u.id === id)?.username)
      .filter(Boolean);
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>Chat Room {roomId}</h2>
        <div className="connection-status">
          Status:{' '}
          <span className={connectionStatus.toLowerCase()}>
            {connectionStatus}
          </span>
        </div>
        <div className="users-online">Usuarios: {users.length}</div>
      </div>

      <div className="messages-container">
        {messages.map(message => (
          <div
            key={message.id}
            className={`message ${message.type} ${
              message.userId === userId ? 'own' : 'other'
            }`}>
            {message.type === 'system' ? (
              <div className="system-message">{message.content}</div>
            ) : (
              <>
                <div className="message-header">
                  <span className="username">{message.username}</span>
                  <span className="timestamp">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-content">{message.content}</div>
              </>
            )}
          </div>
        ))}

        {/* Indicador de escritura */}
        {getTypingUsers().length > 0 && (
          <div className="typing-indicator">
            <span>{getTypingUsers().join(', ')} está escribiendo...</span>
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="message-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleTyping}
          placeholder="Escribe un mensaje..."
          disabled={connectionStatus !== 'Connected'}
          className="message-input"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || connectionStatus !== 'Connected'}
          className="send-button">
          Enviar
        </button>
      </form>
    </div>
  );
};

// 4. Componente de notificaciones en tiempo real
const RealTimeNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const { connectionStatus, addEventListener } = useWebSocket(
    'ws://localhost:8080/notifications'
  );

  useEffect(() => {
    if (!addEventListener) return;

    const unsubscribe = addEventListener('notification', data => {
      const notification = {
        id: Date.now(),
        ...data,
        timestamp: new Date().toISOString(),
      };

      setNotifications(prev => [notification, ...prev].slice(0, 10));

      // Mostrar notificación nativa del navegador
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/notification-icon.png',
        });
      }
    });

    return unsubscribe;
  }, [addEventListener]);

  const requestNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const dismissNotification = id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h3>Notificaciones</h3>
        <button onClick={requestNotificationPermission}>
          Permitir notificaciones
        </button>
        <div className="connection-status">{connectionStatus}</div>
      </div>

      <div className="notifications-list">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification ${notification.type}`}>
            <div className="notification-header">
              <h4>{notification.title}</h4>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="dismiss-button">
                ×
              </button>
            </div>
            <div className="notification-body">{notification.message}</div>
            <div className="notification-time">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Componente principal de la aplicación
const RealTimeApp = () => {
  const [currentUser] = useState({
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    username: 'Usuario' + Math.floor(Math.random() * 1000),
  });

  const [activeRoom, setActiveRoom] = useState('general');

  return (
    <div className="realtime-app">
      <header className="app-header">
        <h1>Chat en Tiempo Real</h1>
        <div className="user-info">Conectado como: {currentUser.username}</div>
      </header>

      <div className="app-content">
        <div className="sidebar">
          <RealTimeNotifications />

          <div className="room-selector">
            <h3>Salas</h3>
            {['general', 'tech', 'random'].map(room => (
              <button
                key={room}
                onClick={() => setActiveRoom(room)}
                className={activeRoom === room ? 'active' : ''}>
                #{room}
              </button>
            ))}
          </div>
        </div>

        <div className="main-content">
          <ChatRoom
            roomId={activeRoom}
            userId={currentUser.id}
            username={currentUser.username}
          />
        </div>
      </div>
    </div>
  );
};

// 6. Estilos CSS
const realTimeStyles = `
  .chat-room {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .chat-header {
    padding: 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .connection-status .connected {
    color: #28a745;
  }

  .connection-status .disconnected {
    color: #dc3545;
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  .message {
    margin-bottom: 16px;
    padding: 12px;
    border-radius: 8px;
    max-width: 70%;
  }

  .message.own {
    background: #007bff;
    color: white;
    margin-left: auto;
  }

  .message.other {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
  }

  .message.system {
    background: #fff3cd;
    color: #856404;
    text-align: center;
    margin: 0 auto;
    max-width: 50%;
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6c757d;
    font-style: italic;
  }

  .typing-dots {
    display: flex;
    gap: 4px;
  }

  .typing-dots span {
    width: 4px;
    height: 4px;
    background: #6c757d;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
  }

  .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
  .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes typing {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  .message-form {
    display: flex;
    padding: 16px;
    background: #f8f9fa;
    border-top: 1px solid #dee2e6;
  }

  .message-input {
    flex: 1;
    padding: 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    margin-right: 8px;
  }

  .send-button {
    padding: 12px 24px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .send-button:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

// 7. Ejercicios prácticos
const ejerciciosPracticos = [
  {
    titulo: 'Implementar Salas Privadas',
    descripcion: 'Crear sistema de salas privadas con invitaciones',
    codigo: `
      const usePrivateRoom = (roomId, password) => {
        const [isAuthorized, setIsAuthorized] = useState(false);
        
        const joinPrivateRoom = useCallback(async () => {
          const response = await fetch('/api/rooms/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId, password })
          });
          
          if (response.ok) {
            setIsAuthorized(true);
          }
        }, [roomId, password]);
        
        return { isAuthorized, joinPrivateRoom };
      };
    `,
  },
  {
    titulo: 'File Sharing en Chat',
    descripcion: 'Permitir compartir archivos en tiempo real',
    codigo: `
      const FileShare = ({ onFileShare }) => {
        const handleFileUpload = async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
          
          const { fileUrl } = await response.json();
          
          onFileShare({
            type: 'file',
            fileName: file.name,
            fileUrl,
            fileSize: file.size
          });
        };
        
        return (
          <input
            type="file"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
        );
      };
    `,
  },
];

console.log('🚀 Ejercicio 7: Real-time Updates con WebSockets');
console.log('📝 Conceptos cubiertos:', [
  'WebSocket connections',
  'Real-time communication',
  'Event handling',
  'Connection management',
  'Heartbeat y reconnection',
]);

export { ChatRoom, RealTimeNotifications, useWebSocket, WebSocketManager };
export default RealTimeApp;
