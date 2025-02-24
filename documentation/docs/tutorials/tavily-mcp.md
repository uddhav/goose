---
title: Tavily Web Search Extension
description: Add Tavily MCP Server as a Goose Extension
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import YouTubeShortEmbed from '@site/src/components/YouTubeShortEmbed';

<YouTubeShortEmbed videoUrl="https://youtube.com/embed/mxS2G9afGxE" />

This tutorial covers how to add the [Tavily Web Search MCP Server](https://github.com/RamXX/mcp-tavily) as a Goose extension to enable AI-powered web search functionality.

:::tip TLDR

**Command**
```sh
uvx mcp-tavily
```

**Environment Variable**
```
TAVILY_API_KEY: <YOUR_API_KEY>
```
:::

## Configuration

:::info
Note that you'll need [uv](https://docs.astral.sh/uv/#installation) installed on your system to run this command, as it uses `uvx`.
:::

<Tabs groupId="interface">
  <TabItem value="cli" label="Goose CLI" default>
  1. Run the `configure` command:
  ```sh
  goose configure
  ```

  2. Choose to add a `Command-line Extension`
  ```sh
    ┌   goose-configure 
    │
    ◇  What would you like to configure?
    │  Add Extension 
    │
    ◆  What type of extension would you like to add?
    │  ○ Built-in Extension 
    // highlight-start    
    │  ● Command-line Extension (Run a local command or script)
    // highlight-end    
    │  ○ Remote Extension 
    └ 
  ```

  3. Give your extension a name
  ```sh
    ┌   goose-configure 
    │
    ◇  What would you like to configure?
    │  Add Extension 
    │
    ◇  What type of extension would you like to add?
    │  Command-line Extension 
    │
    // highlight-start
    ◆  What would you like to call this extension?
    │  tavily
    // highlight-end
    └ 
  ```

  4. Enter the command
  ```sh
    ┌   goose-configure 
    │
    ◇  What would you like to configure?
    │  Add Extension 
    │
    ◇  What type of extension would you like to add?
    │  Command-line Extension 
    │
    ◇  What would you like to call this extension?
    │  tavily
    │
    // highlight-start
    ◆  What command should be run?
    │  uvx mcp-tavily
    // highlight-end
    └ 
  ```  

  5. Obtain a [Tavily API Key](https://tavily.com/) and paste it in.
  :::info
  You can get your API key by signing up at [tavily.com](https://app.tavily.com/) and navigating to your account settings.
  :::

   ```sh
    ┌   goose-configure 
    │
    ◇  What would you like to configure?
    │  Add Extension 
    │
    ◇  What type of extension would you like to add?
    │  Command-line Extension 
    │
    ◇  What would you like to call this extension?
    │  tavily
    │
    ◇  What command should be run?
    │  uvx mcp-tavily
    │
    // highlight-start
    ◆  Would you like to add environment variables?
    │  Yes 
    │
    ◇  Environment variable name:
    │  TAVILY_API_KEY
    │
    ◇  Environment variable value:
    │  ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪
    │
    ◇  Add another environment variable?
    │  No 
    // highlight-end
    └  Added tavily extension
  ```  

  </TabItem>
  <TabItem value="ui" label="Goose Desktop">
  1. Click `...` in the upper right corner
  2. Click `Settings`
  3. Under `Extensions`, click the `Add` link
  4. On the `Add Extension Manually` modal, enter the following:
        * **Type**: `Standard IO`
        * **ID**: `tavily-mcp` (_set this to whatever you want_)
        * **Name**: `Tavily` (_set this to whatever you want_)
        * **Description**: `Tavily Web Search` (_set this to whatever you want_)
        * **Command**: `uvx mcp-tavily`
        * **Environment Variables**
            * **Name**: `TAVILY_API_KEY`
            * **Value**: (_Obtain a [Tavily API Key](https://tavily.com/) and paste it in._)
            * Click `Add` button
  5. Click `Add Extension` button
  </TabItem>
</Tabs>

## Example Usage

The Tavily MCP server enables AI-powered web search functionality in your Goose interactions. When you obtain your API key, you'll have access to Tavily's advanced search capabilities including:

1. Real-time web search
2. Structured data extraction
3. Content analysis
4. Topic-specific search

### Goose Prompt

```
Search for recent news about artificial intelligence breakthroughs in medicine and summarize the key findings.
```

### Goose Output

```
I'll use the Tavily news search tool to find recent news about AI breakthroughs in medicine.

─── tavily_news_search | tavily ──────────────────────────
max_results: 5
query: ...



Let me summarize the key findings from the recent news about AI in medicine:

1. Personalized AI-Driven Healthcare:
- Development of AI systems that act as "personal doctors" that work alongside human clinicians rather than replacing them
- Focus on augmenting clinical capabilities while maintaining human oversight

2. Breakthrough in Medical Imaging:
- A significant advancement in CT scan analysis has been reported in Nature
- Development of a "Unified total-body CT image" (Uni-CT) algorithm that:
  - Automatically generates single series of total-body CT images
  - Concatenates multiple images of segmented organs using organ-specific window settings
  - Reduces diagnosis time by 35% without compromising accuracy
  - Improves efficiency in trauma cases

3. Future Trends:
- Movement toward democratized AI in healthcare, potentially reducing the gap between large and small healthcare providers
- Development of hyper-personalized medical experiences powered by AI
- Integration of AI systems that can perform human-like reasoning in medical contexts

The most concrete breakthrough appears to be in medical imaging, with the Uni-CT algorithm showing promising results in improving both the speed and accuracy of trauma diagnosis. This represents a practical application of AI that could have immediate benefits in emergency medicine.

Would you like me to search for more specific information about any of these developments or explore other areas of AI in medicine?
```

:::tip
You can adjust the [search parameters](https://github.com/RamXX/mcp-tavily?tab=readme-ov-file#prompts) for different types of queries and depths of information. The extension supports both quick searches and comprehensive research.
:::