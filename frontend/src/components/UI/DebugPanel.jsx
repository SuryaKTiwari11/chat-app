import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { axiosInstance } from "../../lib/axios";

// This component is for debugging only - it helps test authentication and socket functionality
const DebugPanel = ({ isVisible = false }) => {
  const [authStatus, setAuthStatus] = useState(null);
  const [socketStatus, setSocketStatus] = useState(null);
  const [error, setError] = useState(null);
  const [showPanel, setShowPanel] = useState(isVisible);
  const { authUser, socket } = useAuthStore();

  const checkAuthStatus = async () => {
    try {
      setError(null);
      const response = await axiosInstance.get("/debug/auth-status");
      setAuthStatus(response.data);
    } catch (err) {
      setError("Auth status check failed: " + (err.message || "Unknown error"));
      setAuthStatus({ isAuthenticated: false });
    }
  };

  const checkSocketStatus = async () => {
    try {
      setError(null);
      const response = await axiosInstance.get("/debug/socket-status");
      setSocketStatus(response.data);
    } catch (err) {
      setError(
        "Socket status check failed: " + (err.message || "Unknown error")
      );
      setSocketStatus({ socketConnected: false });
    }
  };

  const sendTestMessage = async () => {
    try {
      setError(null);
      const response = await axiosInstance.post("/debug/test-socket");
      alert(response.data.message || "Test message sent");
    } catch (err) {
      setError("Test message failed: " + (err.message || "Unknown error"));
    }
  };

  const togglePanel = () => setShowPanel(!showPanel);

  useEffect(() => {
    if (showPanel) {
      checkAuthStatus();
      checkSocketStatus();
    }
  }, [showPanel]);

  if (!showPanel) {
    return (
      <button
        onClick={togglePanel}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-md"
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">Debug Panel</h3>
        <button
          onClick={togglePanel}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4 text-sm">
        {/* Authentication Status */}
        <div>
          <h4 className="font-semibold mb-1">Authentication Status:</h4>
          <div className="bg-gray-700 p-2 rounded-md">
            {authUser ? (
              <p className="text-green-400">
                Authenticated as: {authUser.fullname} ({authUser.email})
              </p>
            ) : (
              <p className="text-red-400">Not authenticated</p>
            )}
          </div>
          <button
            onClick={checkAuthStatus}
            className="mt-1 bg-indigo-700 px-2 py-1 rounded text-xs"
          >
            Check Server Auth
          </button>

          {authStatus && (
            <div className="mt-1 bg-gray-700 p-2 rounded-md">
              <p>
                Server says:{" "}
                {authStatus.isAuthenticated
                  ? "✓ Authenticated"
                  : "✗ Not authenticated"}
              </p>
            </div>
          )}
        </div>

        {/* Socket Status */}
        <div>
          <h4 className="font-semibold mb-1">Socket Status:</h4>
          <div className="bg-gray-700 p-2 rounded-md">
            {socket ? (
              <p className="text-green-400">
                Socket ID: {socket.id}
                <br />
                Connected: {socket.connected ? "Yes ✓" : "No ✗"}
              </p>
            ) : (
              <p className="text-red-400">Socket not initialized</p>
            )}
          </div>
          <button
            onClick={checkSocketStatus}
            className="mt-1 bg-indigo-700 px-2 py-1 rounded text-xs"
          >
            Check Server Socket
          </button>

          {socketStatus && (
            <div className="mt-1 bg-gray-700 p-2 rounded-md">
              <p>
                Server socket:{" "}
                {socketStatus.socketConnected
                  ? "✓ Connected"
                  : "✗ Not connected"}
              </p>
              <p>Server socket ID: {socketStatus.socketId || "None"}</p>
              <p>Active connections: {socketStatus.activeConnections || 0}</p>
            </div>
          )}

          <button
            onClick={sendTestMessage}
            className="mt-2 bg-green-700 px-2 py-1 rounded text-xs"
            disabled={!socket?.connected}
          >
            Send Test Message
          </button>
        </div>

        {error && (
          <div className="bg-red-900 p-2 rounded-md text-xs">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="border-t border-gray-600 pt-2">
          <button
            onClick={() => {
              useAuthStore.getState().connectSocket();
              setTimeout(() => {
                checkSocketStatus();
              }, 1000);
            }}
            className="bg-blue-700 px-2 py-1 rounded text-xs mr-2"
          >
            Reconnect Socket
          </button>

          <button
            onClick={() => {
              useAuthStore.getState().disconnectSocket();
              setTimeout(() => {
                checkSocketStatus();
              }, 1000);
            }}
            className="bg-orange-700 px-2 py-1 rounded text-xs"
          >
            Disconnect Socket
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
