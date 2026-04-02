import type { ITransportPlugin, TransportType } from './plugin.js';

export interface ClientEvents {
  'client:initialized': { config: any };
  'client:connecting': { uri: string; type: TransportType };
  'client:connected': { uri: string; type: TransportType };
  'client:disconnecting': { type: TransportType };
  'client:disconnected': { type: TransportType };
  'client:error': { error: Error; context?: string };
  'client:plugin-switched': { from: TransportType | null; to: TransportType };
}

export interface RegistryEvents {
  'registry:plugin-registered': { plugin: ITransportPlugin };
  'registry:plugin-unregistered': { type: TransportType };
  'registry:plugins-loaded': { count: number };
}

export interface ConnectionEvents {
  'connection:status-changed': {
    isConnected: boolean;
    type: TransportType | null;
    error?: string;
  };
  'connection:health-check': {
    healthy: boolean;
    type: TransportType;
    timestamp: number;
  };
  'connection:reconnecting': {
    attempt: number;
    maxAttempts: number;
    type: TransportType;
  };
}

export interface ToolEvents {
  'tool:call-started': { toolName: string; args: any };
  'tool:call-completed': { toolName: string; result: any; duration: number };
  'tool:call-failed': { toolName: string; error: Error; duration: number };
  'tools:list-updated': { tools: any[]; type: TransportType };
}

export interface ResourceEvents {
  'resources:list-updated': { resources: any[]; type: TransportType };
  'resource:read-started': { uri: string };
  'resource:read-completed': { uri: string; result: any };
  'resource:read-failed': { uri: string; error: Error };
}

export interface PromptEvents {
  'prompts:list-updated': { prompts: any[]; type: TransportType };
  'prompt:get-started': { name: string; args?: any };
  'prompt:get-completed': { name: string; result: any };
  'prompt:get-failed': { name: string; error: Error };
}

export interface SamplingEvents {
  'sampling:request-received': { request: any; respond: (result: any) => void };
}

export type AllEvents = ClientEvents &
  RegistryEvents &
  ConnectionEvents &
  ToolEvents &
  ResourceEvents &
  PromptEvents &
  SamplingEvents;
