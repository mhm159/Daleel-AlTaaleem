'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/api';
import { Card, Loader, Alert, Button } from '../ui/Button';

export default function MessagingPanel() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await api.get('/messages/conversations');
      setConversations(data.conversations || []);
      if (data.conversations?.length > 0) {
        setActiveConversation(data.conversations[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation]);

  const loadMessages = async (convId) => {
    try {
      const data = await api.get(`/messages/conversation/${convId}`);
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    try {
      await api.post('/messages', {
        receiverId: activeConversation.withUser?.id,
        studentId: activeConversation.studentId,
        content: newMessage,
      });
      setNewMessage('');
      loadMessages(activeConversation.id);
      loadConversations();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="flex h-[600px] overflow-hidden rounded-2xl border border-house-200">
      {/* Conversations list */}
      <div className="w-1/3 border-r border-house-200 bg-house-50 overflow-y-auto">
        <div className="border-b border-house-200 p-4 font-bold text-house-800">الرسائل</div>
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setActiveConversation(conv)}
            className={`flex w-full items-center space-x-3 p-4 text-left transition-colors hover:bg-white ${activeConversation?.id === conv.id ? 'bg-white' : ''}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600 font-bold">
              {(conv.withUser?.name || conv.studentName || 'T')[0]}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-house-800">{conv.withUser?.name || conv.studentName}</div>
              <div className="line-clamp-1 text-xs text-house-500">{conv.lastMessage.content}</div>
            </div>
            {conv.unreadCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-xs text-white">{conv.unreadCount}</span>
            )}
          </button>
        ))}
        {conversations.length === 0 && (
          <div className="p-4 text-center text-sm text-house-400">لا توجد محادثات حتى الآن</div>
        )}
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col">
        {activeConversation ? (
          <>
            <div className="border-b border-house-200 p-4">
              <div className="font-bold text-house-800">
                {activeConversation.withUser?.name || activeConversation.studentName}
              </div>
              {activeConversation.studentName && (
                <div className="text-xs text-house-500">{activeConversation.studentName}</div>
              )}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === messages[0]?.senderId ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-2 ${
                      msg.senderId === activeConversation.withUser?.id
                        ? 'bg-house-100 text-house-800'
                        : 'bg-sky-500 text-white'
                    }`}
                  >
                    {msg.content}
                    <div className={`mt-1 text-xs ${msg.senderId === activeConversation.withUser?.id ? 'text-house-400' : 'text-sky-100'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-house-200 p-4">
              <div className="flex space-x-2">
                <input
                  className="input-field flex-1"
                  placeholder="اكتب رسالة..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button variant="primary" onClick={sendMessage}>إرسال</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-house-400">
            اختر محادثة للبدء بالمراسلة
          </div>
        )}
      </div>
    </div>
  );
}
