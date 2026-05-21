import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Declaración de tipos para la API de Electron
declare global {
  interface Window {
    electronAPI: {
      andriller: {
        start: (config: any) => Promise<any>;
        cancel: () => Promise<any>;
        onOutput: (callback: (data: string) => void) => void;
        onError: (callback: (data: string) => void) => void;
      };
      aleapp: {
        start: (config: any) => Promise<any>;
        cancel: () => Promise<any>;
        onOutput: (callback: (data: string) => void) => void;
        onError: (callback: (data: string) => void) => void;
      };
      dialog: {
        selectFolder: () => Promise<any>;
        selectFile: (filters?: any) => Promise<any>;
      };
      file: {
        writeJson: (filePath: string, data: any) => Promise<any>;
        readJson: (filePath: string) => Promise<any>;
      };
      hash: {
        calculate: (filePath: string, algorithm?: string) => Promise<any>;
      };
      db: {
        getCasos: (userId: number) => Promise<any>;
        addCaso: (caso: any) => Promise<any>;
        saveState: (userId: number, state: string) => Promise<any>;
        loadState: (userId: number) => Promise<any>;
      };
      auth: {
        login: (credentials: any) => Promise<any>;
        validate: (token: string) => Promise<any>;
        logout: (token: string) => Promise<any>;
        changePassword: (userId: number, newPassword: string) => Promise<any>;
      };
      platform: string;
    };
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
