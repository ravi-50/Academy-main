import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient: Client | null = null;

export interface EffortActivity {
  id: number;
  cohortCode: string;
  trainerMentorName: string;
  effortHours: number;
  timestamp: string;
  type: 'EFFORT_SUBMITTED' | 'WEEKLY_SUMMARY';
}

export const connectSocket = (onActivityReceived: (activity: EffortActivity) => void) => {
  try {
    const socket = new SockJS('/ws');
    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('WebSocket:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame);

      // Subscribe to effort submissions
      stompClient?.subscribe('/topic/efforts', (message) => {
        try {
          const activity: EffortActivity = JSON.parse(message.body);
          onActivityReceived(activity);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      // Subscribe to weekly summaries
      stompClient?.subscribe('/topic/weekly-summary', (message) => {
        try {
          const activity: EffortActivity = JSON.parse(message.body);
          onActivityReceived(activity);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('WebSocket STOMP error:', frame);
    };

    stompClient.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
    };

    stompClient.onWebSocketClose = (event) => {
      console.log('WebSocket closed:', event);
    };

    stompClient.activate();
  } catch (error) {
    console.error('Failed to initialize WebSocket connection:', error);
  }
};

export const disconnectSocket = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
    stompClient = null;
    console.log('Disconnected from WebSocket');
  }
};

export const isConnected = () => {
  return stompClient?.connected || false;
};
