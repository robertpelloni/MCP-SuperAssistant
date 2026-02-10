import { useEffect, useCallback, useRef } from 'react';
import { useConnectionStatus, useAvailableTools, useToolExecution, useServerConfig } from './useStores';
import { mcpClient } from '../core/mcp-client';
import { createLogger } from '@extension/shared/lib/logger';
import { useToastStore } from '@src/stores/toast.store';

const logger = createLogger('useMcpCommunication');

export const useMcpCommunication = () => {
  const { setStatus, setError, setIsConnected, isReconnecting, status } = useConnectionStatus();
  const { setTools } = useAvailableTools();
  const { addExecution, updateExecution } = useToolExecution();
  const { config } = useServerConfig();
  const { addToast } = useToastStore.getState();

  const retryCountRef = useRef(0);
  const maxRetries = 5;
  const baseDelay = 2000;

  // Function to connect to the MCP server
  const connect = useCallback(async () => {
    if (!config.uri) {
      return;
    }

    try {
      // If we are already connected and config matches, maybe we don't need to force reconnect?
      // But for now, let's trust the logic.

      // Update client configuration if needed
      await mcpClient.updateServerConfig(config);

      // Attempt connection (or reconnection)
      // McpClient handles connection state internally, so we check status or force reconnect
      const currentStatus = await mcpClient.getCurrentConnectionStatus();

      if (currentStatus.status === 'connected') {
         setStatus('connected');
         setIsConnected(true);
         retryCountRef.current = 0;

         const tools = await mcpClient.getAvailableTools();
         setTools(tools);
      } else {
         // Force reconnect if not connected
         setStatus('connecting');
         const success = await mcpClient.forceReconnect();
         if (success) {
            setStatus('connected');
            setIsConnected(true);
            retryCountRef.current = 0;
            const tools = await mcpClient.getAvailableTools();
            setTools(tools);
         } else {
            throw new Error('Connection failed');
         }
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
      await mcpClient.updateServerConfig(newConfig);
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
    const success = await mcpClient.forceReconnect();
    return success;
  }, []);

  // Check connection status
  const forceConnectionStatusCheck = useCallback(async () => {
    const status = await mcpClient.getCurrentConnectionStatus();
    return status.isConnected;
  }, []);

  // Send message / Execute tool
  const sendMessage = useCallback(
    async (toolName: string, args: any) => {
      // Handle both (toolName, args) signature and (toolObject) signature if needed
      // The previous code used sendMessage(tool), but standard usage implies (name, args)
      // Adapting to (toolName, args) which is cleaner

      try {
        logger.debug('[useMcpCommunication] Executing tool:', toolName);

        const executionId = crypto.randomUUID();
        addExecution({
          id: executionId,
          toolName: toolName,
          status: 'pending',
          startTime: Date.now(),
          args: args,
        });

        const result = await mcpClient.callTool(toolName, args || {});

        updateExecution(executionId, {
          status: 'success',
          endTime: Date.now(),
          result: result,
        });

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('[useMcpCommunication] Tool execution error:', errorMessage);
        throw error;
      }
    },
    [addExecution, updateExecution],
  );

  // Refresh tools
  const refreshTools = useCallback(
    async (force = false) => {
      try {
        const tools = await mcpClient.getAvailableTools(force);
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
    return mcpClient.getServerConfig();
  }, []);

  // Initial connection on mount
  useEffect(() => {
    // We only trigger connect if config is available.
    // mcpClient might already be initialized by global singleton, but we sync state here.
    if (config.uri) {
        connect();
    }

    return () => {
      // Optional: mcpClient.cleanup() ?
      // Usually we don't want to kill the global client on unmount of a hook,
      // unless this hook controls the lifecycle.
      // Since Sidebar uses this, and Sidebar is persistent...
      // But if Sidebar unmounts, maybe we should?
      // For now, let's NOT cleanup global client to be safe.
    };
  }, [connect, config.uri]);

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
