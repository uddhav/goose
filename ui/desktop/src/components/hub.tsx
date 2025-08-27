/**
 * Hub Component
 *
 * The Hub is the main landing page and entry point for the Goose Desktop application.
 * It serves as the welcome screen where users can start new conversations.
 *
 * Key Responsibilities:
 * - Displays SessionInsights to show session statistics and recent chats
 * - Provides a ChatInput for users to start new conversations
 * - Creates a new chat session with the submitted message and navigates to Pair
 * - Ensures each submission from Hub always starts a fresh conversation
 *
 * Navigation Flow:
 * Hub (input submission) → Pair (new conversation with the submitted message)
 *
 * Unlike the previous implementation that used BaseChat, the Hub now uses only
 * ChatInput directly, which allows for clean separation between the landing page
 * and active conversation states. This ensures that every message submitted from
 * the Hub creates a brand new chat session in the Pair view.
 */

import { SessionInsights } from './sessions/SessionsInsights';
import ChatInput from './ChatInput';
import { generateSessionId } from '../sessions';
import { ChatState } from '../types/chatState';
import { ContextManagerProvider } from './context_management/ContextManager';
import 'react-toastify/dist/ReactToastify.css';

import { ChatType } from '../types/chat';
import { DEFAULT_CHAT_TITLE } from '../contexts/ChatContext';
import { View, ViewOptions } from '../utils/navigationUtils';

export default function Hub({
  chat: _chat,
  setChat: _setChat,
  setPairChat,
  setView,
  setIsGoosehintsModalOpen,
}: {
  readyForAutoUserPrompt: boolean;
  chat: ChatType;
  setChat: (chat: ChatType) => void;
  setPairChat: (chat: ChatType) => void;
  setView: (view: View, viewOptions?: ViewOptions) => void;
  setIsGoosehintsModalOpen: (isOpen: boolean) => void;
}) {
  // Handle chat input submission - create new chat and navigate to pair
  const handleSubmit = (e: React.FormEvent) => {
    const customEvent = e as unknown as CustomEvent;
    const combinedTextFromInput = customEvent.detail?.value || '';

    if (combinedTextFromInput.trim()) {
      // Always create a completely new chat session with a unique ID for the PAIR
      const newChatId = generateSessionId();
      const newPairChat = {
        id: newChatId, // This generates a unique ID each time
        title: DEFAULT_CHAT_TITLE,
        messages: [], // Always start with empty messages
        messageHistoryIndex: 0,
        recipeConfig: null, // Clear recipe for new chats from Hub
        recipeParameters: null, // Clear parameters for new chats from Hub
      };

      // Update the PAIR chat state immediately to prevent flashing
      setPairChat(newPairChat);

      // Navigate to pair page with the message to be submitted immediately
      setView('pair', {
        disableAnimation: true,
        initialMessage: combinedTextFromInput,
        resetChat: true,
      });
    }

    // Prevent default form submission
    e.preventDefault();
  };

  return (
    <ContextManagerProvider>
      <div className="flex flex-col h-full bg-background-muted">
        <div className="flex-1 flex flex-col mb-0.5">
          <SessionInsights />
        </div>

        <ChatInput
          handleSubmit={handleSubmit}
          autoSubmit={false}
          chatState={ChatState.Idle}
          onStop={() => {}}
          commandHistory={[]}
          initialValue=""
          setView={setView}
          numTokens={0}
          inputTokens={0}
          outputTokens={0}
          droppedFiles={[]}
          onFilesProcessed={() => {}}
          messages={[]}
          setMessages={() => {}}
          disableAnimation={false}
          sessionCosts={undefined}
          setIsGoosehintsModalOpen={setIsGoosehintsModalOpen}
        />
      </div>
    </ContextManagerProvider>
  );
}
