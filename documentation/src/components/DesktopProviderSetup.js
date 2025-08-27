import React from "react";

export const DesktopProviderSetup = () => {
  return (
    <>
      <p>On the welcome screen, choose how to configure a provider:</p>
      <ul>
        <li><strong>Tetrate Agent Router</strong> - One-click OAuth authentication provides instant access to multiple AI models, starting credits, and built-in rate limiting.</li>
        <li><strong>OpenRouter</strong> - One-click OAuth authentication provides instant access to multiple AI models with built-in rate limiting.</li>
        <li><strong>Other Providers</strong> - Choose from <a href="/goose/docs/getting-started/providers">~20 supported providers</a> including OpenAI, Anthropic, Google Gemini, and others through manual configuration. Be ready to provide your API key.</li>
      </ul>
    </>
  );
};
