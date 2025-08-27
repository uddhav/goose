import { useEffect, useRef, useState } from 'react';
import { IpcRendererEvent } from 'electron';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ErrorUI } from './components/ErrorBoundary';
import { ExtensionInstallModal } from './components/ExtensionInstallModal';
import { ToastContainer } from 'react-toastify';
import { GoosehintsModal } from './components/GoosehintsModal';
import AnnouncementModal from './components/AnnouncementModal';
import { generateSessionId } from './sessions';
import ProviderGuard from './components/ProviderGuard';

import { ChatType } from './types/chat';
import Hub from './components/hub';
import Pair from './components/pair';
import SettingsView, { SettingsViewOptions } from './components/settings/SettingsView';
import SessionsView from './components/sessions/SessionsView';
import SchedulesView from './components/schedule/SchedulesView';
import ProviderSettings from './components/settings/providers/ProviderSettingsPage';
import { useChat } from './hooks/useChat';
import { AppLayout } from './components/Layout/AppLayout';
import { ChatProvider } from './contexts/ChatContext';
import { DraftProvider } from './contexts/DraftContext';

import 'react-toastify/dist/ReactToastify.css';
import { useConfig } from './components/ConfigContext';
import { ModelAndProviderProvider } from './components/ModelAndProviderContext';
import PermissionSettingsView from './components/settings/permission/PermissionSetting';

import { type SessionDetails } from './sessions';
import ExtensionsView, { ExtensionsViewOptions } from './components/extensions/ExtensionsView';
import { Recipe } from './recipe';
import RecipesView from './components/RecipesView';
import RecipeEditor from './components/RecipeEditor';

// Import the new modules
import { createNavigationHandler, View, ViewOptions } from './utils/navigationUtils';
import { initializeApp } from './utils/appInitialization';

// Route Components
const HubRouteWrapper = ({
  chat,
  setChat,
  setPairChat,
  setIsGoosehintsModalOpen,
}: {
  chat: ChatType;
  setChat: (chat: ChatType) => void;
  setPairChat: (chat: ChatType) => void;
  setIsGoosehintsModalOpen: (isOpen: boolean) => void;
}) => {
  const navigate = useNavigate();
  const setView = createNavigationHandler(navigate);

  return (
    <Hub
      readyForAutoUserPrompt={true}
      chat={chat}
      setChat={setChat}
      setPairChat={setPairChat}
      setView={setView}
      setIsGoosehintsModalOpen={setIsGoosehintsModalOpen}
    />
  );
};

const PairRouteWrapper = ({
  chat,
  setChat,
  setPairChat,
  setIsGoosehintsModalOpen,
}: {
  chat: ChatType;
  setChat: (chat: ChatType) => void;
  setPairChat: (chat: ChatType) => void;
  setIsGoosehintsModalOpen: (isOpen: boolean) => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const chatRef = useRef(chat);
  const setView = createNavigationHandler(navigate);

  // Keep the ref updated with the current chat state
  useEffect(() => {
    chatRef.current = chat;
  }, [chat]);

  // Check if we have a resumed session or recipe config from navigation state
  useEffect(() => {
    const appConfig = window.appConfig?.get('recipe');
    if (appConfig && !chatRef.current.recipeConfig) {
      const recipe = appConfig as Recipe;

      const updatedChat: ChatType = {
        ...chatRef.current,
        recipeConfig: recipe,
        title: recipe.title || chatRef.current.title,
        messages: [], // Start fresh for recipe from deeplink
        messageHistoryIndex: 0,
      };
      setChat(updatedChat);
      setPairChat(updatedChat);
      return;
    }

    // Only process navigation state if we actually have it
    if (!location.state) {
      console.log('No navigation state, preserving existing chat state');
      return;
    }

    const resumedSession = location.state?.resumedSession as SessionDetails | undefined;
    const recipeConfig = location.state?.recipeConfig as Recipe | undefined;
    const resetChat = location.state?.resetChat as boolean | undefined;

    if (resumedSession) {
      console.log('Loading resumed session in pair view:', resumedSession.session_id);
      console.log('Current chat before resume:', chatRef.current);

      // Convert session to chat format - this clears any existing recipe config
      const sessionChat: ChatType = {
        id: resumedSession.session_id,
        title: resumedSession.metadata?.description || `ID: ${resumedSession.session_id}`,
        messages: resumedSession.messages,
        messageHistoryIndex: resumedSession.messages.length,
        recipeConfig: null, // Clear recipe config when resuming a session
      };

      // Update both the local chat state and the app-level pairChat state
      setChat(sessionChat);
      setPairChat(sessionChat);

      // Clear the navigation state to prevent reloading on navigation
      window.history.replaceState({}, document.title);
    } else if (recipeConfig && resetChat) {
      console.log('Loading new recipe config in pair view:', recipeConfig.title);

      const updatedChat: ChatType = {
        id: chatRef.current.id, // Keep the same ID
        title: recipeConfig.title || 'Recipe Chat',
        messages: [], // Clear messages to start fresh
        messageHistoryIndex: 0,
        recipeConfig: recipeConfig,
        recipeParameters: null, // Clear parameters for new recipe
      };

      // Update both the local chat state and the app-level pairChat state
      setChat(updatedChat);
      setPairChat(updatedChat);

      // Clear the navigation state to prevent reloading on navigation
      window.history.replaceState({}, document.title);
    } else if (recipeConfig && !chatRef.current.recipeConfig) {
      const updatedChat: ChatType = {
        ...chatRef.current,
        recipeConfig: recipeConfig,
        title: recipeConfig.title || chatRef.current.title,
      };

      // Update both the local chat state and the app-level pairChat state
      setChat(updatedChat);
      setPairChat(updatedChat);

      // Clear the navigation state to prevent reloading on navigation
      window.history.replaceState({}, document.title);
    } else if (location.state) {
      // We have navigation state but it doesn't match our conditions
      // Clear it to prevent future processing, but don't modify chat state
      console.log('Clearing unprocessed navigation state');
      window.history.replaceState({}, document.title);
    }
    // If we have a recipe config but resetChat is false and we already have a recipe,
    // do nothing - just continue with the existing chat state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
    <Pair
      chat={chat}
      setChat={setChat}
      setView={setView}
      setIsGoosehintsModalOpen={setIsGoosehintsModalOpen}
    />
  );
};

const SettingsRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setView = createNavigationHandler(navigate);

  // Get viewOptions from location.state or history.state
  const viewOptions =
    (location.state as SettingsViewOptions) || (window.history.state as SettingsViewOptions) || {};
  return <SettingsView onClose={() => navigate('/')} setView={setView} viewOptions={viewOptions} />;
};

const SessionsRoute = () => {
  const navigate = useNavigate();
  const setView = createNavigationHandler(navigate);

  return <SessionsView setView={setView} />;
};

const SchedulesRoute = () => {
  const navigate = useNavigate();
  return <SchedulesView onClose={() => navigate('/')} />;
};

const RecipesRoute = () => {
  const navigate = useNavigate();

  return (
    <RecipesView
      onLoadRecipe={(recipe) => {
        // Navigate to pair view with the recipe configuration in state
        navigate('/pair', {
          state: {
            recipeConfig: recipe,
            // Reset the pair chat to start fresh with the recipe
            resetChat: true,
          },
        });
      }}
    />
  );
};

const RecipeEditorRoute = () => {
  const location = useLocation();

  // Check for config from multiple sources:
  // 1. Location state (from navigation)
  // 2. localStorage (from "View Recipe" button)
  // 3. Window electron config (from deeplinks)
  let config = location.state?.config;

  if (!config) {
    const storedConfig = localStorage.getItem('viewRecipeConfig');
    if (storedConfig) {
      try {
        config = JSON.parse(storedConfig);
        // Clear the stored config after using it
        localStorage.removeItem('viewRecipeConfig');
      } catch (error) {
        console.error('Failed to parse stored recipe config:', error);
      }
    }
  }

  if (!config) {
    const electronConfig = window.electron.getConfig();
    config = electronConfig.recipe;
  }

  return <RecipeEditor config={config} />;
};

const PermissionRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const parentView = location.state?.parentView as View;
  const parentViewOptions = location.state?.parentViewOptions as ViewOptions;

  return (
    <PermissionSettingsView
      onClose={() => {
        // Navigate back to parent view with options
        switch (parentView) {
          case 'chat':
            navigate('/');
            break;
          case 'pair':
            navigate('/pair');
            break;
          case 'settings':
            navigate('/settings', { state: parentViewOptions });
            break;
          case 'sessions':
            navigate('/sessions');
            break;
          case 'schedules':
            navigate('/schedules');
            break;
          case 'recipes':
            navigate('/recipes');
            break;
          default:
            navigate('/');
        }
      }}
    />
  );
};

const ConfigureProvidersRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-background-default">
      <ProviderSettings
        onClose={() => navigate('/settings', { state: { section: 'models' } })}
        isOnboarding={false}
      />
    </div>
  );
};

const WelcomeRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-background-default">
      <ProviderSettings onClose={() => navigate('/')} isOnboarding={true} />
    </div>
  );
};

const ExtensionsRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get viewOptions from location.state or history.state (for deep link extensions)
  const viewOptions =
    (location.state as ExtensionsViewOptions) ||
    (window.history.state as ExtensionsViewOptions) ||
    {};

  return (
    <ExtensionsView
      onClose={() => navigate(-1)}
      setView={(view, options) => {
        switch (view) {
          case 'chat':
            navigate('/');
            break;
          case 'pair':
            navigate('/pair', { state: options });
            break;
          case 'settings':
            navigate('/settings', { state: options });
            break;
          default:
            navigate('/');
        }
      }}
      viewOptions={viewOptions}
    />
  );
};

export default function App() {
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isGoosehintsModalOpen, setIsGoosehintsModalOpen] = useState(false);
  const [agentWaitingMessage, setAgentWaitingMessage] = useState<string | null>(null);

  // Add separate state for pair chat to maintain its own conversation
  const [pairChat, setPairChat] = useState<ChatType>({
    id: generateSessionId(),
    title: 'Pair Chat',
    messages: [],
    messageHistoryIndex: 0,
    recipeConfig: null,
  });

  const { getExtensions, addExtension, read } = useConfig();
  const initAttemptedRef = useRef(false);

  // Create a setView function for useChat hook - we'll use window.history instead of navigate
  const setView = (view: View, viewOptions: ViewOptions = {}) => {
    console.log(`Setting view to: ${view}`, viewOptions);
    console.trace('setView called from:'); // This will show the call stack
    // Convert view to route navigation using hash routing
    switch (view) {
      case 'chat':
        window.location.hash = '#/';
        break;
      case 'pair':
        window.location.hash = '#/pair';
        break;
      case 'settings':
        window.location.hash = '#/settings';
        break;
      case 'extensions':
        window.location.hash = '#/extensions';
        break;
      case 'sessions':
        window.location.hash = '#/sessions';
        break;
      case 'schedules':
        window.location.hash = '#/schedules';
        break;
      case 'recipes':
        window.location.hash = '#/recipes';
        break;
      case 'permission':
        window.location.hash = '#/permission';
        break;
      case 'ConfigureProviders':
        window.location.hash = '#/configure-providers';
        break;
      case 'recipeEditor':
        window.location.hash = '#/recipe-editor';
        break;
      case 'welcome':
        window.location.hash = '#/welcome';
        break;
      default:
        console.error(`Unknown view: ${view}, not navigating anywhere. This is likely a bug.`);
        console.trace('Invalid setView call stack:');
        // Don't navigate anywhere for unknown views to avoid unexpected redirects
        break;
    }
  };

  const { chat, setChat } = useChat({ setIsLoadingSession, setView, setPairChat });

  useEffect(() => {
    if (initAttemptedRef.current) {
      console.log('Initialization already attempted, skipping...');
      return;
    }
    initAttemptedRef.current = true;

    const initialize = async () => {
      const config = window.electron.getConfig();
      const provider = (await read('GOOSE_PROVIDER', false)) ?? config.GOOSE_DEFAULT_PROVIDER;
      const model = (await read('GOOSE_MODEL', false)) ?? config.GOOSE_DEFAULT_MODEL;

      await initializeApp({
        getExtensions,
        addExtension,
        setPairChat,
        setMessage: setAgentWaitingMessage,
        provider: provider as string,
        model: model as string,
      });
    };

    initialize()
      .then(() => setAgentWaitingMessage(null))
      .catch((error) => {
        console.error('Fatal error during initialization:', error);
        setFatalError(error instanceof Error ? error.message : 'Unknown error occurred');
      });
  }, [getExtensions, addExtension, read, setPairChat, setAgentWaitingMessage]);

  useEffect(() => {
    console.log('Sending reactReady signal to Electron');
    try {
      window.electron.reactReady();
    } catch (error) {
      console.error('Error sending reactReady:', error);
      setFatalError(
        `React ready notification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }, []);

  // Handle navigation to pair view for recipe deeplinks after router is ready
  useEffect(() => {
    const recipeConfig = window.appConfig?.get('recipe');
    if (
      recipeConfig &&
      typeof recipeConfig === 'object' &&
      window.location.hash === '#/' &&
      !window.sessionStorage.getItem('ignoreRecipeConfigChanges')
    ) {
      console.log('Router ready - navigating to pair view for recipe deeplink:', recipeConfig);
      // Small delay to ensure router is fully initialized
      setTimeout(() => {
        window.location.hash = '#/pair';
      }, 100);
    } else if (window.sessionStorage.getItem('ignoreRecipeConfigChanges')) {
      console.log('Router ready - ignoring recipe config navigation due to new window creation');
    }
  }, []);

  // Handle recipe decode events from main process
  useEffect(() => {
    const handleLoadRecipeDeeplink = (_event: IpcRendererEvent, ...args: unknown[]) => {
      const recipeDeeplink = args[0] as string;
      const scheduledJobId = args[1] as string | undefined;

      // Store the deeplink info in app config for processing
      const config = window.electron.getConfig();
      config.recipeDeeplink = recipeDeeplink;
      if (scheduledJobId) {
        config.scheduledJobId = scheduledJobId;
      }

      // Navigate to pair view to handle the recipe loading
      if (window.location.hash !== '#/pair') {
        window.location.hash = '#/pair';
      }
    };

    const handleRecipeDecoded = (_event: IpcRendererEvent, ...args: unknown[]) => {
      const decodedRecipe = args[0] as Recipe;

      // Update the pair chat with the decoded recipe
      setPairChat((prevChat) => ({
        ...prevChat,
        recipeConfig: decodedRecipe,
        title: decodedRecipe.title || 'Recipe Chat',
        messages: [], // Start fresh for recipe
        messageHistoryIndex: 0,
      }));

      // Navigate to pair view if not already there
      if (window.location.hash !== '#/pair') {
        window.location.hash = '#/pair';
      }
    };

    const handleRecipeDecodeError = (_event: IpcRendererEvent, ...args: unknown[]) => {
      const errorMessage = args[0] as string;
      console.error('[App] Recipe decode error:', errorMessage);

      // Show error to user - you could add a toast notification here
      // For now, just log the error and navigate to recipes page
      window.location.hash = '#/recipes';
    };

    window.electron.on('load-recipe-deeplink', handleLoadRecipeDeeplink);
    window.electron.on('recipe-decoded', handleRecipeDecoded);
    window.electron.on('recipe-decode-error', handleRecipeDecodeError);

    return () => {
      window.electron.off('load-recipe-deeplink', handleLoadRecipeDeeplink);
      window.electron.off('recipe-decoded', handleRecipeDecoded);
      window.electron.off('recipe-decode-error', handleRecipeDecodeError);
    };
  }, [setPairChat, pairChat.id]);

  useEffect(() => {
    console.log('Setting up keyboard shortcuts');
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = window.electron.platform === 'darwin';
      if ((isMac ? event.metaKey : event.ctrlKey) && event.key === 'n') {
        event.preventDefault();
        try {
          const workingDir = window.appConfig?.get('GOOSE_WORKING_DIR');
          console.log(`Creating new chat window with working dir: ${workingDir}`);
          window.electron.createChatWindow(undefined, workingDir as string);
        } catch (error) {
          console.error('Error creating new window:', error);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Prevent default drag and drop behavior globally to avoid opening files in new windows
  // but allow our React components to handle drops in designated areas
  useEffect(() => {
    const preventDefaults = (e: globalThis.DragEvent) => {
      // Only prevent default if we're not over a designated drop zone
      const target = e.target as HTMLElement;
      const isOverDropZone = target.closest('[data-drop-zone="true"]') !== null;

      if (!isOverDropZone) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleDragOver = (e: globalThis.DragEvent) => {
      // Always prevent default for dragover to allow dropping
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: globalThis.DragEvent) => {
      // Only prevent default if we're not over a designated drop zone
      const target = e.target as HTMLElement;
      const isOverDropZone = target.closest('[data-drop-zone="true"]') !== null;

      if (!isOverDropZone) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Add event listeners to document to catch drag events
    document.addEventListener('dragenter', preventDefaults, false);
    document.addEventListener('dragleave', preventDefaults, false);
    document.addEventListener('dragover', handleDragOver, false);
    document.addEventListener('drop', handleDrop, false);

    return () => {
      document.removeEventListener('dragenter', preventDefaults, false);
      document.removeEventListener('dragleave', preventDefaults, false);
      document.removeEventListener('dragover', handleDragOver, false);
      document.removeEventListener('drop', handleDrop, false);
    };
  }, []);

  useEffect(() => {
    const handleFatalError = (_event: IpcRendererEvent, ...args: unknown[]) => {
      const errorMessage = args[0] as string;
      console.error('Encountered a fatal error:', errorMessage);
      console.error('Is loading session:', isLoadingSession);
      setFatalError(errorMessage);
    };
    window.electron.on('fatal-error', handleFatalError);
    return () => {
      window.electron.off('fatal-error', handleFatalError);
    };
  }, [isLoadingSession]);

  useEffect(() => {
    const handleSetView = (_event: IpcRendererEvent, ...args: unknown[]) => {
      const newView = args[0] as View;
      const section = args[1] as string | undefined;
      console.log(
        `Received view change request to: ${newView}${section ? `, section: ${section}` : ''}`
      );

      if (section && newView === 'settings') {
        window.location.hash = `#/settings?section=${section}`;
      } else {
        window.location.hash = `#/${newView}`;
      }
    };
    const urlParams = new URLSearchParams(window.location.search);
    const viewFromUrl = urlParams.get('view');
    if (viewFromUrl) {
      const windowConfig = window.electron.getConfig();
      if (viewFromUrl === 'recipeEditor') {
        const initialViewOptions = {
          recipeConfig: JSON.stringify(windowConfig?.recipeConfig),
          view: viewFromUrl,
        };
        window.history.replaceState(
          {},
          '',
          `/recipe-editor?${new URLSearchParams(initialViewOptions).toString()}`
        );
      } else {
        window.history.replaceState({}, '', `/${viewFromUrl}`);
      }
    }
    window.electron.on('set-view', handleSetView);
    return () => window.electron.off('set-view', handleSetView);
  }, []);

  useEffect(() => {
    const handleFocusInput = (_event: IpcRendererEvent, ..._args: unknown[]) => {
      const inputField = document.querySelector('input[type="text"], textarea') as HTMLInputElement;
      if (inputField) {
        inputField.focus();
      }
    };
    window.electron.on('focus-input', handleFocusInput);
    return () => {
      window.electron.off('focus-input', handleFocusInput);
    };
  }, []);

  if (fatalError) {
    return <ErrorUI error={new Error(fatalError)} />;
  }

  if (isLoadingSession) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-textStandard"></div>
      </div>
    );
  }

  return (
    <DraftProvider>
      <ModelAndProviderProvider>
        <HashRouter>
          <ToastContainer
            aria-label="Toast notifications"
            toastClassName={() =>
              `relative min-h-16 mb-4 p-2 rounded-lg
               flex justify-between overflow-hidden cursor-pointer
               text-text-on-accent bg-background-inverse
              `
            }
            style={{ width: '380px' }}
            className="mt-6"
            position="top-right"
            autoClose={3000}
            closeOnClick
            pauseOnHover
          />
          <ExtensionInstallModal addExtension={addExtension} />
          <div className="relative w-screen h-screen overflow-hidden bg-background-muted flex flex-col">
            <div className="titlebar-drag-region" />
            <Routes>
              <Route path="welcome" element={<WelcomeRoute />} />
              <Route path="configure-providers" element={<ConfigureProvidersRoute />} />
              <Route
                path="/"
                element={
                  <ChatProvider
                    chat={chat}
                    setChat={setChat}
                    contextKey="hub"
                    agentWaitingMessage={agentWaitingMessage}
                  >
                    <AppLayout setIsGoosehintsModalOpen={setIsGoosehintsModalOpen} />
                  </ChatProvider>
                }
              >
                <Route
                  index
                  element={
                    <ProviderGuard>
                      <HubRouteWrapper
                        chat={chat}
                        setChat={setChat}
                        setPairChat={setPairChat}
                        setIsGoosehintsModalOpen={setIsGoosehintsModalOpen}
                      />
                    </ProviderGuard>
                  }
                />
                <Route
                  path="pair"
                  element={
                    <ProviderGuard>
                      <ChatProvider
                        chat={pairChat}
                        setChat={setPairChat}
                        contextKey={`pair-${pairChat.id}`}
                        agentWaitingMessage={agentWaitingMessage}
                        key={pairChat.id}
                      >
                        <PairRouteWrapper
                          chat={pairChat}
                          setChat={setPairChat}
                          setPairChat={setPairChat}
                          setIsGoosehintsModalOpen={setIsGoosehintsModalOpen}
                        />
                      </ChatProvider>
                    </ProviderGuard>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProviderGuard>
                      <SettingsRoute />
                    </ProviderGuard>
                  }
                />
                <Route
                  path="extensions"
                  element={
                    <ProviderGuard>
                      <ExtensionsRoute />
                    </ProviderGuard>
                  }
                />
                <Route
                  path="sessions"
                  element={
                    <ProviderGuard>
                      <SessionsRoute />
                    </ProviderGuard>
                  }
                />
                <Route
                  path="schedules"
                  element={
                    <ProviderGuard>
                      <SchedulesRoute />
                    </ProviderGuard>
                  }
                />
                <Route
                  path="recipes"
                  element={
                    <ProviderGuard>
                      <RecipesRoute />
                    </ProviderGuard>
                  }
                />
                <Route
                  path="recipe-editor"
                  element={
                    <ProviderGuard>
                      <RecipeEditorRoute />
                    </ProviderGuard>
                  }
                />
                <Route
                  path="permission"
                  element={
                    <ProviderGuard>
                      <PermissionRoute />
                    </ProviderGuard>
                  }
                />
              </Route>
            </Routes>
          </div>
          {isGoosehintsModalOpen && (
            <GoosehintsModal
              directory={window.appConfig?.get('GOOSE_WORKING_DIR') as string}
              setIsGoosehintsModalOpen={setIsGoosehintsModalOpen}
            />
          )}
        </HashRouter>
        <AnnouncementModal />
      </ModelAndProviderProvider>
    </DraftProvider>
  );
}
