---
sidebar_position: 3
title: Using Extensions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { PanelLeft, Settings } from 'lucide-react';

Extensions are add-ons that provide a way to extend the functionality of Goose by connecting with applications and tools you already use in your workflow. These extensions can be used to add new features, access data and resources, or integrate with other systems.

Extensions are based on the [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol), so you can connect
Goose to a wide ecosystem of capabilities.

:::tip Tutorials
Check out the [step-by-step tutorials](/docs/category/mcp-servers) for adding and using several Goose Extensions
:::


## Built-in Extensions
Out of the box, Goose is installed with a few extensions but with only the `Developer` extension enabled by default.

Here are the built-in extensions:

- [Developer](/docs/mcp/developer-mcp): Provides a set of general development tools that are useful for software development.
- [Computer Controller](/docs/mcp/computer-controller-mcp): Provides general computer control tools for webscraping, file caching, and automations.
- [Memory](/docs/mcp/memory-mcp): Teaches Goose to remember your preferences as you use it.
- [Tutorial](/docs/mcp/tutorial-mcp): Provides interactive tutorials for learning about Goose.


#### Toggling Built-in Extensions

<Tabs groupId="interface">
  <TabItem value="ui" label="Goose Desktop" default>
  1. Click the <PanelLeft className="inline" size={16} /> button in the top-left to open the sidebar.
  2. Click the `Extensions` button on the sidebar.
  3. Under `Extensions`, you can toggle the built-in extensions on or off.
  </TabItem>

  <TabItem value="cli" label="Goose CLI">
    
    If you know the exact name of the extension you'd like to add, run:

    ```sh
    goose mcp {name}
    ```

    To navigate through available extensions:

    1. Run the following command:
    ```sh
    goose configure
    ```
    2. Select `Add Extension` from the menu.
    3. Choose the type of extension you'd like to add:
        - `Built-In Extension`: Use an extension that comes pre-installed with Goose.
        - `Command-Line Extension`: Add a local command or script to run as an extension.
        - `Remote Extension (SSE)`: Connect to a remote system via SSE (Server-Sent Events).
        - `Remote Extension (Streaming HTTP)`: Connect to a remote system via Streaming HTTP
    4. Follow the prompts based on the type of extension you selected.

    **Example: Adding Built-in Extension**

    To select an option during configuration, hover over it and press Enter.

    ```
    ┌   goose-configure 
    │
    ◇  What would you like to configure?
    │  Add Extension 
    │
    ◇  What type of extension would you like to add?
    │  Built-in Extension 
    │
    ◆  Which built-in extension would you like to enable?
    │  ○ Developer Tools 
    │  ○ Computer Controller (controls for webscraping, file caching, and automations)
    │  ○ Google Drive 
    │  ○ Memory 
    │  ● JetBrains 
    │        
    ◇  Please set the timeout for this tool (in secs):
    │  300
    │ 
    └  Enabled jetbrains extension    
    ```
  </TabItem>
</Tabs>


:::info
All of Goose's built-in extensions are MCP servers in their own right. If you'd like
to use the MCP servers included with Goose with any other agent, you are free to do so.
:::


## Discovering Extensions

Goose provides a [central directory][extensions-directory] of extensions that you can install and use. 

You can also add any other [MCP Server](#mcp-servers) as a Goose extension, even if it's not listed in our directory.


## Adding Extensions

Extensions can be installed directly via the [extensions directory][extensions-directory], CLI, or UI.

:::warning Airgapped Environments
If you're in a corporate or airgapped environment and extensions fail to activate, see [Airgapped/Offline Environments](/docs/troubleshooting#airgappedoffline-environment-issues) for workarounds.
:::

### MCP Servers

You can install any MCP server as a Goose extension. 

:::tip MCP Server Directory
See available servers in the **[MCP Server Directory](https://www.pulsemcp.com/servers)**.
:::

<Tabs groupId="interface">
  <TabItem value="ui" label="Goose Desktop" default>
 
  1. Click the <PanelLeft className="inline" size={16} /> button in the top-left to open the sidebar.
  2. Click the `Extensions` button on the sidebar.
  3. Under `Extensions`, click `Add custom extension`.
  4. On the `Add custom extension` modal, enter the necessary details
     - If adding an environment variable, click `Add` button to the right of the variable
     - The `Timeout` field lets you set how long Goose should wait for a tool call from this extension to complete
  5. Click `Add` button
  
  #### Example of adding the [Knowledge Graph Memory MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory):
    * **Type**: `Standard IO`
    * **ID**: `kgm-mcp` (_set this to whatever you want_)
    * **Name**: `Knowledge Graph Memory` (_set this to whatever you want_)
    * **Description**: `maps and stores complex relationships between concepts` (_set this to whatever you want_)
    * **Command**: `npx -y @modelcontextprotocol/server-memory`
  </TabItem>

  <TabItem value="cli" label="Goose CLI">
  
  1. Run the following command: 

    ```sh
    goose configure
    ```

  2. Select `Add Extension` from the menu.

  3. Choose the type of extension you'd like to add:
      - `Built-In Extension`: Use an extension that comes pre-installed with Goose.
      - `Command-Line Extension`: Add a local command or script to run as an extension.
      - `Remote Extension (SSE)`: Connect to a remote system via SSE (Server-Sent Events).
      - `Remote Extension (Streaming HTTP)`: Connect to a remote system via Streaming HTTP

  4. Follow the prompts based on the type of extension you selected.

  #### Example of adding the [Knowledge Graph Memory MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory):

<Tabs groupId="extensions">
   <TabItem value="node" label="Node">
  ```
 ┌   goose-configure 
 │
 ◇  What would you like to configure?
 │  Add Extension 
 │
 ◇  What type of extension would you like to add?
 │  Command-line Extension 
 │
 ◇  What would you like to call this extension?
 │  Knowledge Graph Memory
 │
 ◇  What command should be run?
 │  npx -y @modelcontextprotocol/server-memory
 │
 ◇  Please set the timeout for this tool (in secs):
 │  300
 │
 ◆  Would you like to add environment variables?
 │  No 
 │
 └  Added Knowledge Graph Memory extension
 ```

   </TabItem>
   <TabItem value="python" label="Python">

  ```
 ┌   goose-configure
 │
 ◇  What would you like to configure?
 │  Add Extension
 │
 ◇  What type of extension would you like to add?
 │  Command-line Extension
 │
 ◇  What would you like to call this extension?
 │  Wikipedia Reader
 │
 ◇  What command should be run?
 │  uvx mcp-wiki
 │
 ◇  Please set the timeout for this tool (in secs):
 │  300
 │
 ◆  Would you like to add environment variables?
 │  No
 │
 └  Added Wikipedia Reader extension
 ```

   </TabItem>
   <TabItem value="java" label="Java">

Note: Java and Kotlin extensions are only support on Linux and macOS

  ```
 ┌   goose-configure
 │
 ◇  What would you like to configure?
 │  Add Extension
 │
 ◇  What type of extension would you like to add?
 │  Command-line Extension
 │
 ◇  What would you like to call this extension?
 │  Spring Data Explorer
 │
 ◇  What command should be run?
 │  jbang -Dspring.profiles.active=dev org.example:spring-data-mcp:1.0.0
 │
 ◇  Please set the timeout for this tool (in secs):
 │  300
 │
 ◆  Would you like to add environment variables?
 │  Yes
 │
 ◇  Environment variable name:
 │  SPRING_DATASOURCE_URL
 │
 ◇  Environment variable value:
 │  jdbc:postgresql://localhost:5432/mydb
 │
 ◇  Add another environment variable?
 │  No
 │
 └  Added Spring Data Explorer extension
 ```

   </TabItem>
  </Tabs>

  </TabItem>
</Tabs>


### Deeplinks

Extensions can be installed using Goose's deep link protocol. The URL format varies based on the extension type:

<Tabs groupId="interface">
  <TabItem value="stdio" label="StandardIO" default>
```
goose://extension?cmd=<command>&arg=<argument>&id=<id>&name=<name>&description=<description>
```

Required parameters:
- `cmd`: The base command to run, one of `jbang`, `npx`, `uvx`, `goosed`, or `docker`
- `arg`: (cmd only) Command arguments (can be repeated for multiple arguments: `&arg=...&arg=...`)
- `timeout`: Maximum time (in seconds) to wait for extension responses
- `id`: Unique identifier for the extension
- `name`: Display name for the extension
- `description`: Brief description of the extension's functionality

A command like `npx -y @modelcontextprotocol/server-github` would be represented as:

```
goose://extension?cmd=npx&arg=-y&arg=%40modelcontextprotocol/server-github&timeout=<timeout>&id=<id>&name=<name>&description=<description>
```

Note that each parameter to the `npx` command is passed as a separate `arg` parameter in the deeplink.
  </TabItem>
  <TabItem value="sse" label="Server-Sent Events">
```
goose://extension?url=<remote-sse-url>&id=<id>&name=<name>&description=<description>
```

Parameters:
- `url`: The URL of the remote SSE server
- `timeout`: Maximum time (in seconds) to wait for extension responses
- `id`: Unique identifier for the extension
- `name`: Display name for the extension
- `description`: Brief description of the extension's functionality

For example, a deeplink for a URL like `http://localhost:8080/sse` would look like this when URL-encoded:

```
goose://extension?url=http%3A%2F%2Flocalhost%3A8080%2Fsse&timeout=<timeout>&id=<id>&name=<name>&description=<description>>
```

  </TabItem>
  <TabItem value="streamable_http" label="Streaming HTTP">
```
goose://extension?url=<remote-streamable-http-url>&type=streamable_http&id=<id>&name=<n>&description=<description>
```

Parameters:
- `url`: The URL of the remote Streaming HTTP server
- `type`: Must be set to `streamable_http` to specify the protocol type
- `timeout`: Maximum time (in seconds) to wait for extension responses
- `id`: Unique identifier for the extension
- `name`: Display name for the extension
- `description`: Brief description of the extension's functionality

For example, a deeplink for a URL like `https://example.com/streamable` would look like this when URL-encoded:

```
goose://extension?url=https%3A%2F%2Fexample.com%2Fstreamable&type=streamable_http&timeout=<timeout>&id=<id>&name=<n>&description=<description>
```

  </TabItem>
</Tabs>

:::note
All parameters in the deeplink must be URL-encoded. For example, spaces should be replaced with `%20`, and `@` should be replaced with `%40`.
:::


### Config Entry
For advanced users, you can also directly edit the config file (`~/.config/goose/config.yaml`) to add, remove, or update an extension:

```yaml
extensions:
  github:
    name: GitHub
    cmd: npx
    args: [-y @modelcontextprotocol/server-github]
    enabled: true
    envs: { "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>" }
    type: stdio
    timeout: 300
```
    

## Enabling/Disabling Extensions

You can enable or disable installed extensions based on your workflow needs.

<Tabs groupId="interface">
  <TabItem value="ui" label="Goose Desktop" default>
  1. Click the <PanelLeft className="inline" size={16} /> button in the top-left to open the sidebar.
  2. Click the `Extensions` button on the sidebar.
  2. Use the toggle switch next to each extension to enable or disable it.

  </TabItem>

  <TabItem value="cli" label="Goose CLI">
    1. Run the following command to open up Goose's configurations:
    ```sh
    goose configure
    ```
    2. Select `Toggle Extensions` from the menu.
    3. A list of already installed extensions will populate.
    4. Press the `space bar` to toggle the extension. Solid means enabled. 

    **Example:**

    ```
    ┌   goose-configure 
    │
    ◇  What would you like to configure?
    │  Toggle Extensions 
    │
    ◆  enable extensions: (use "space" to toggle and "enter" to submit)
    │  ◼ developer 
    │  ◻ fetch 
    └   
    ```
  </TabItem>
</Tabs>

## Automatically Enabled Extensions

The Smart Extension Recommendation system in Goose automatically identifies and suggests relevant extensions based on your tasks and needs. This section explains how to use this feature effectively and understand its capabilities and limitations.

When you request a task, Goose checks its enabled extensions and their tools to determine if it can fulfill the request. If not, it suggests or enables additional extensions as needed. You can also request specific extensions by name.


:::warning
Any extensions enabled dynamically are only enabled for the current session. To keep extensions enabled between sessions, see [Enabling/Disabling Extensions](#enablingdisabling-extensions).
:::

### Automatic Detection

Goose automatically detects when an extension is needed based on your task requirements. Here's an example of how Goose identifies and enables a needed extension during a conversation:

<Tabs groupId="interface">
<TabItem value="ui" label="Goose Desktop" default>

#### Goose Prompt
```plaintext
Find all orders with pending status from our production database
```

#### Goose Output

```plaintext
I'll help you search for available extensions that might help us interact with PostgreSQL databases.

🔍 Search Available Extensions
└─ Output ▼

 I see there's a PostgreSQL extension available. Let me enable it so we can query your database.

🔧 Manage Extensions
└─ action           enable
   extension_name   postgresql

The extension 'postgresql' has been installed successfully

Great! Now I can help you query the database...
```

</TabItem>
<TabItem value="cli" label="Goose CLI">

#### Goose Prompt
```plaintext
Find all orders with pending status from our production database
```

#### Goose Output

```sh
I apologize, but I notice that I don't currently have access to your database. Let me search if there are any database-related extensions available.
─── search_available_extensions | platform ──────────────────────────

I see that there is a "postgresql" extension available. Let me enable it so I can help you query your database.
─── enable_extension | platform ──────────────────────────
extension_name: postgresql


■  Goose would like to enable the following extension, do you approve?
// highlight-start
| ● Yes, for this session 
// highlight-end
| ○ No
```

</TabItem>
</Tabs>

### Direct Request

Goose responds to explicit requests for extensions, allowing users to manually enable specific tools they need. Here's an example of how Goose handles a direct request to enable an extension:

<Tabs groupId="interface">
<TabItem value="ui" label="Goose Desktop" default>

#### Goose Prompt

```plaintext
Use PostgreSQL extension
```

#### Goose Output

```plaintext
I'll help enable the PostgreSQL extension for you.

🔧 Manage Extensions
└─ action           enable
   extension_name   postgresql

The extension 'postgresql' has been installed successfully

The PostgreSQL extension is now ready to use. What would you like to do with it?
```

</TabItem>
<TabItem value="cli" label="Goose CLI">

#### Goose Prompt

```sh
Use the PostgreSQL extension
```

#### Goose Output

```sh
I'll help enable the PostgreSQL extension for you.
─── enable_extension | platform ──────────────────────────
extension_name: postgresql


■  Goose would like to enable the following extension, do you approve?
// highlight-start
| ● Yes, for this session 
// highlight-end
| ○ No
```

</TabItem>
</Tabs>

## Updating Extension Properties

Goose relies on extension properties to determine how to handle an extension. You can edit these properties if you want to change the extension's display settings and behavior, such as the name, timeout, or environment variables.

<Tabs groupId="interface">
  <TabItem value="ui" label="Goose Desktop" default>

  1. Click the <PanelLeft className="inline" size={16} /> button in the top-left to open the sidebar.
  2. Click the `Extensions` button on the sidebar.
  3. Under `Extensions`, click the <Settings className="inline" size={16} /> button on the extension you'd like to edit.
  4. In the dialog that appears, edit the extension's properties as needed.
  5. Click `Save Changes`.

  </TabItem>

  <TabItem value="cli" label="Config file">
  
  1. Navigate to the Goose [configuration file](/docs/guides/config-file). For example, navigate to `~/.config/goose/config.yaml` on macOS.
  2. Edit the extension properties as needed and save your changes.

  </TabItem>
</Tabs>

## Removing Extensions

You can remove installed extensions. 

<Tabs groupId="interface">
  <TabItem value="ui" label="Goose Desktop" default>

  1. Click the <PanelLeft className="inline" size={16} /> button in the top-left to open the sidebar.
  2. Click the `Extensions` button on the sidebar.
  3. Under `Extensions`,  click the <Settings className="inline" size={16} /> button on the extension you'd like to remove.
  4. In the dialog that appears, click `Remove Extension`.

  </TabItem>

  <TabItem value="cli" label="Config file">
  :::info
  To remove an extension, you must [disable](#enablingdisabling-extensions) it first.
  :::

    1. Run the following command to open up Goose's configurations:
    ```sh
    goose configure
    ```
    2. Select `Remove` from the menu. Disabled extensions will be listed.
    3. Arrow down to the extension you want to remove.
    4. Press the `space bar` to select the extension. Solid means selected. 
    ```
    ┌   goose-configure 
    │
    ◇  What would you like to configure?
    │  Remove Extension 
    │
    ◆  Select extensions to remove (note: you can only remove disabled extensions - use "space" to toggle and "enter" to submit)
    │  ◼ fetch 
    └  
    ```
    5. Press Enter to save
  </TabItem>
</Tabs>


## Starting Session with Extensions

You can start a tailored Goose session with specific extensions directly from the CLI. 

:::info Notes
* The extension will not be installed. It will only be enabled for the current session.
* There's no need to do this if you already have the extensions enabled.
:::

### Built-in Extensions

To enable a built-in extension while starting a session, run the following command:

```bash
goose session --with-builtin "{extension_id}"
```

For example, to enable the Developer and Computer Controller extensions and start a session, you'd run:

```bash
goose session --with-builtin "developer,computercontroller"
```

Or alternatively:

```bash
goose session --with-builtin developer --with-builtin computercontroller
```


### External Extensions

To enable an extension while starting a session, run the following command:

```bash
goose session --with-extension "{extension command}" --with-extension "{another extension command}"
```

For example, to start a session with the [Fetch extension](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch), you'd run:

```bash
goose session --with-extension "uvx mcp-server-fetch"
```


#### Environment Variables

Some extensions require environment variables. You can include these in your command:

```bash
goose session --with-extension "VAR=value command arg1 arg2"
```

For example, to start a session with the [GitHub extension](https://github.com/modelcontextprotocol/servers/tree/main/src/github), you'd run:

```bash
goose session --with-extension "GITHUB_PERSONAL_ACCESS_TOKEN=<YOUR_TOKEN> npx -y @modelcontextprotocol/server-github"
```

:::info
Note that you'll need [Node.js](https://nodejs.org/) installed on your system to run this command, as it uses `npx`.
:::


### Remote Extensions over SSE

To enable a remote extension over SSE while starting a session, run the following command:

```bash
goose session --with-remote-extension "{extension URL}" --with-remote-extension "{another extension URL}"
```

For example, to start a session with a remote extension over SSE running on localhost on port 8080, you'd run:

```bash
goose session --with-remote-extension "http://localhost:8080/sse"
```

### Remote Extensions over Streaming HTTP

To enable a remote extension over Streaming HTTP while starting a session, run the following command:

```bash
goose session --with-streamable-http-extension "{extension URL}" --with-streamable-http-extension "{another extension URL}"
```

For example, to start a session with a Streaming HTTP extension, you'd run:

```bash
goose session --with-streamable-http-extension "https://example.com/streamable"
```

## Developing Extensions

Goose extensions are implemented with MCP, a standard protocol that allows AI models and agents to securely connect with local or remote resources. Learn how to build your own [extension as an MCP server](https://modelcontextprotocol.io/quickstart/server).

[extensions-directory]: https://block.github.io/goose/v1/extensions
