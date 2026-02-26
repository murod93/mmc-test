import { useEffect, useState } from "react";
import "./App.css";

declare global {
  interface Window {
    Telegram?: any;
  }
}

function App() {
  const [tg, setTg] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If already loaded
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      webApp.expand();
      setTg(webApp);
      setIsReady(true);
      return;
    }

    // Load Telegram script dynamically
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;

    script.onload = () => {
      if (window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;
        webApp.ready();
        webApp.expand();
        setTg(webApp);
        setIsReady(true);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!window.Telegram?.WebApp) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Please open this Mini App inside Telegram</h2>
      </div>
    );
  }

  if (!isReady) {
    return <div style={{ padding: 20 }}>Loading Telegram...</div>;
  }

  const user = tg?.initDataUnsafe?.user;

  return (
    <div style={{ padding: 20 }}>
      <h1>MM Test App 🚀</h1>

      {user && (
        <div>
          <p><strong>Name:</strong> {user.first_name}</p>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {user.username}</p>
        </div>
      )}

      <button
        style={{
          marginTop: 20,
          padding: "10px 16px",
          borderRadius: 8,
          cursor: "pointer",
        }}
        onClick={() => {
          tg.sendData(
            JSON.stringify({
              action: "button_clicked",
              userId: user?.id,
            })
          );
        }}
      >
        Send Data to Bot
      </button>
    </div>
  );
}

export default App;
