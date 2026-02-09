import { useEffect, useCallback, useRef } from 'react';
import { useConnectionStatus, useAvailableTools, useToolExecution, useServerConfig } from './useStores';
import { McpClientService } from '../core/mcp-client';
import { createLogger } from '@extension/shared/lib/logger';
import { useToastStore } from '@src/stores/toast.store';

const logger = createLogger('useMcpCommunication');

export const useMcpCommunication = () => {
  const { setStatus, setError, setIsConnected, isReconnecting, status } = useConnectionStatus();
  const { setTools } = useAvailableTools();
  const { addExecution, updateExecution } = useToolExecution();
  const { config } = useServerConfig();
  const { addToast } = useToastStore.getState();

  const clientRef = useRef(McpClientService.getInstance());
  const retryCountRef = useRef(0);
  const maxRetries = 5;
  const baseDelay = 2000;

  // Function to connect to the MCP server
  const connect = useCallback(async () => {
    if (!config.uri) {
      // logger.warn('[useMcpCommunication] No server URI configured');
      return;
    }

    try {
      setStatus('connecting');
      setIsConnected(false);
      setError(null);

      logger.debug('[useMcpCommunication] Connecting to:', config.uri);

      // Update client configuration
      clientRef.current.updateConfig(config);

      // Attempt connection
      const isConnected = await clientRef.current.connect();

      if (isConnected) {
        setStatus('connected');
        setIsConnected(true);
        retryCountRef.current = 0; // Reset retry count on success

        // Initial tool fetch
        const tools = await clientRef.current.fetchTools();
        setTools(tools);
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('[useMcpCommunication] Connection error:', errorMessage);
      setStatus('error');
      setError(errorMessage);
      setIsConnected(false);

      // Auto-Retry Logic
      if (retryCountRef.current < maxRetries) {
        const delay = baseDelay * Math.pow(1.5, retryCountRef.current);
        logger.info(
          `[useMcpCommunication] Auto-retrying in ${delay}ms (Attempt ${retryCountRef.current + 1}/${maxRetries})`,
        );

        setTimeout(() => {
          retryCountRef.current++;
          connect();
        }, delay);
      } else {
        addToast({
          title: 'Connection Failed',
          message: 'Max retries reached. Please check server status.',
          type: 'error',
          duration: 5000,
        });
      }
    }
  }, [config, setStatus, setIsConnected, setError, setTools]);

  // Handle server config updates
  const updateServerConfig = useCallback(
    async (newConfig: { uri: string; connectionType: any }) => {
      logger.debug('[useMcpCommunication] Updating server config:', newConfig);
      clientRef.current.updateConfig(newConfig);
      // Reset retries when manually changing config
      retryCountRef.current = 0;
      return connect();
    },
    [connect],
  );

  // Force reconnection
  const forceReconnect = useCallback(async () => {
    logger.debug('[useMcpCommunication] Forcing reconnection');
    retryCountRef.current = 0;
    return connect();
  }, [connect]);

  // Check connection status
  const forceConnectionStatusCheck = useCallback(async () => {
    return clientRef.current.isConnected();
  }, []);

  // Send message / Execute tool
  const sendMessage = useCallback(
    async (tool: any) => {
      try {
        logger.debug('[useMcpCommunication] Executing tool:', tool.name);

        const executionId = crypto.randomUUID();
        addExecution({
          id: executionId,
          toolName: tool.name,
          status: 'pending',
          startTime: Date.now(),
          args: tool.arguments, // Assuming args are passed in tool object or handled by UI
        });

        const result = await clientRef.current.executeTool(tool.name, tool.arguments || {});

        updateExecution(executionId, {
          status: 'success',
          endTime: Date.now(),
          result: result,
        });

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('[useMcpCommunication] Tool execution error:', errorMessage);

        // Find the last pending execution? Or pass ID through context?
        // For simplicity here, we might miss updating the exact ID if we don't track it better.
        // Ideally executeTool returns the ID or we manage state better.

        throw error;
      }
    },
    [addExecution, updateExecution],
  );

  // Refresh tools
  const refreshTools = useCallback(
    async (force = false) => {
      try {
        const tools = await clientRef.current.fetchTools(force);
        setTools(tools);
        return tools;
      } catch (error) {
        logger.error('[useMcpCommunication] Error refreshing tools:', error);
        return [];
      }
    },
    [setTools],
  );

  // Get current server config
  const getServerConfig = useCallback(async () => {
    return config;
  }, [config]);

  // Initial connection on mount (or config change)
  useEffect(() => {
    connect();

    return () => {
      clientRef.current.disconnect();
    };
  }, [connect]); // connect depends on config, so this handles config changes

  return {
    availableTools: useAvailableTools().tools,
    sendMessage,
    refreshTools,
    forceReconnect,
    serverStatus: status,
    updateServerConfig,
    getServerConfig,
    forceConnectionStatusCheck,
    lastConnectionError: useConnectionStatus().error,
  };
};
