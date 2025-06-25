
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { UserIcon, LogOutIcon, SparklesIcon, FolderIcon, FileIcon, PlayIcon, Send, Loader2, MessageSquare, Code, Eye } from 'lucide-react';
import { AuthModal } from '@/components/auth-modal';

interface FileItem {
  name: string;
  content: string;
  language: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  files?: Record<string, FileItem>;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function IDE() {
  const [user, setUser] = useState<User | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [files, setFiles] = useState<Record<string, FileItem>>({});
  const [activeFile, setActiveFile] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      content: 'Hey! 👋 What do you want to build today? I can create websites, apps, games, calculators, and more!',
      timestamp: new Date()
    }
  ]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.log('Not logged in');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isGenerating) return;
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    const currentInput = inputMessage;
    setInputMessage('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentInput,
          requestType: 'build'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'ai',
        content: data.response || 'App created successfully!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      if (data.success && data.files && Object.keys(data.files).length > 0) {
        setFiles(data.files);
        setActiveFile(Object.keys(data.files)[0]);
      }
    } catch (error) {
      console.error('Error creating app:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'ai',
        content: 'Sorry, there was an error creating your app. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/viraaj/logout', { method: 'POST' });
      setUser(null);
      setFiles({});
      setMessages([{
        id: '1',
        sender: 'ai',
        content: 'Hey! 👋 What do you want to build today? I can create websites, apps, games, calculators, and more!',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="h-screen bg-[#0d1117] text-white flex flex-col">
      {/* Top Header */}
      <div className="bg-[#161b22] border-b border-gray-700 p-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-5 h-5 text-blue-400" />
          <span className="font-semibold">AI App Builder</span>
        </div>
        
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-lg">
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span className="text-slate-200 text-sm">{user.name}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <LogOutIcon className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        )}
      </div>

      {/* Main 3-Panel Layout */}
      <div className="flex-1 flex">
        {/* Chat Panel - Dominant Left Side */}
        <div className="w-3/5 flex flex-col border-r border-gray-700">
          {/* Chat Header */}
          <div className="bg-[#161b22] border-b border-gray-700 p-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">Chat</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#161b22] border border-gray-700'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-[#161b22] border border-gray-700 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Creating your app...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700 bg-[#0d1117]">
            <div className="flex space-x-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="💬 Describe what you want to build..."
                className="flex-1 bg-[#161b22] border-gray-600 text-white text-sm h-12 px-4"
                disabled={isGenerating}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isGenerating}
                className="bg-blue-600 hover:bg-blue-700 h-12 px-6"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Files + Preview */}
        <div className="w-2/5 flex">
          {/* Files Panel - Compact */}
          <div className="w-40 bg-[#161b22] border-r border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <FolderIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Files</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {Object.keys(files).length === 0 ? (
                <div className="text-center text-gray-400 text-xs mt-4">
                  No files yet
                </div>
              ) : (
                Object.entries(files).map(([filename, file]) => (
                  <div
                    key={filename}
                    onClick={() => setActiveFile(filename)}
                    className={`flex items-center px-2 py-1.5 cursor-pointer hover:bg-gray-700 rounded text-xs transition-colors ${
                      activeFile === filename ? 'bg-gray-700 text-blue-400' : 'text-gray-300'
                    }`}
                    title={filename}
                  >
                    <FileIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate text-xs">{filename}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Preview Panel - Remaining Space */}
          <div className="flex-1 flex flex-col">
            <div className="bg-[#161b22] border-b border-gray-700 p-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Preview</span>
              </div>
            </div>
            <div className="flex-1 bg-white">
              {files['index.html'] ? (
                <iframe
                  srcDoc={files['index.html'].content}
                  className="w-full h-full border-0"
                  title="Live Preview"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No preview available</p>
                    <p className="text-sm">Chat with AI to create an app</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={(userData) => {
            setUser(userData);
            setShowAuthModal(false);
          }}
        />
      )}
    </div>
  );
}
