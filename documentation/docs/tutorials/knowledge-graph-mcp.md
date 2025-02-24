---
title: Knowledge Graph Memory Extension
description: Add Knowledge Graph Memory MCP Server as a Goose Extension
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import YouTubeShortEmbed from '@site/src/components/YouTubeShortEmbed';

<YouTubeShortEmbed videoUrl="https://www.youtube.com/embed/PF6hpDaI9Mc" />


This tutorial covers how to add the [Knowledge Graph Memory MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) as a Goose extension. This enables Goose to analyze relationships, detect patterns, and gain a deeper understanding of your data. The knowledge graph builds on the [memory extension](/docs/tutorials/memory-mcp) by mapping complex relationships between concepts and providing persistent memory across Goose sessions.

:::tip TLDR

**Command**
```sh
npx -y @modelcontextprotocol/server-memory
```
:::

## Configuration

:::info
Note that you'll need [Node.js](https://nodejs.org/) installed on your system to run this command, as it uses `npx`.
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
    │  knowledge graph memory
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
    │  knowledge graph memory
    │
    // highlight-start
    ◆  What command should be run?
    │  npx -y @modelcontextprotocol/server-memory
    // highlight-end
    └ 
  ```  

  5. Add Extension

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
    │  knowledge graph memory
    │
    ◇  What command should be run?
    │  npx -y @modelcontextprotocol/server-memory
    // highlight-start
    ◆  Would you like to add environment variables?
    │  No 
    │
    // highlight-end
    └  Added knowledge graph memory extension
  ```  

  </TabItem>
  <TabItem value="ui" label="Goose Desktop">
  1. Click `...` in the upper right corner
  2. Click `Settings`
  3. Under `Extensions`, click the `Add` link
  4. On the `Add Extension Manually` modal, enter the following:
        * **Type**: `Standard IO`
        * **ID**: `knowledge-graph-mcp` (_set this to whatever you want_)
        * **Name**: `knowledge graph memory` (_set this to whatever you want_)
        * **Description**: `knowledge graph memory MCP Server` (_set this to whatever you want_)
        * **Command**: `npx -y @modelcontextprotocol/server-memory`
  5. Click `Add Extension` button
  </TabItem>
</Tabs>

## Example Usage

In this example, I'll show you how Goose can become an intelligent security reviewer by using connected knowledge patterns to detect and analyze vulnerabilities. Goose will be able to understand the relationship between security issues, their impacts, and mitigations.

This means Goose doesn't just spot issues - it understands how vulnerabilities connect to real world impacts and can suggest comprehensive solutions.

### Step 1: Teach Goose About Security Patterns
    #### Goose Prompt #1
    ```
    goose, learn these security vulnerability patterns and their relationships:

    1. SQL Injection relates to:

        - Unvalidated database inputs
        - Data theft risks
        - Parameterized query solutions
        
    2. XSS Vulnerabilities connect to:

        - Unescaped user output
        - Session hijacking risks
        - Content sanitization fixes
    
    3.Authentication Weaknesses link to:

        - Session management
        - Account compromise
        - JWT-based solutions
    ```

    #### Goose Output

    ```
    I'll store this security knowledge in the Knowledge Graph Memory with proper entities and relationships

    [.... Create Entities .....]

    Now, let's create the relationships between these security concepts:

    [.... Create Relations .....]

    Let me verify what's been stored:

    [... Read Graph ...]

    I've now stored your security knowledge in the graph with:

    1. Vulnerability Entities:

        - SQL Injection (with observations about unvalidated inputs and data theft)
        - XSS Vulnerabilities (with observations about unescaped output and session risks)
        - Authentication Weaknesses (with observations about session management)
    
    2. Solution Entities:

        - Parameterized Queries
        - Content Sanitization
        - JWT Authentication
        
    3. Connected Relationships:

        - Vulnerabilities → their potential impacts
        - Solutions → the vulnerabilities they mitigate
    
    The knowledge is now structured in a way that I can:

        - Trace vulnerability impact chains
        - Identify appropriate solutions for each vulnerability
        - Understand how different security issues are related
    ```
### Step 2:  Use Connected Knowledge for Code Review
    #### Goose Prompt # 2

    ```
    Review this API endpoint for security issues:
    ```
    ```js
    app.post('/api/login', (req, res) => {
        const { username, password } = req.body;
        const query = `SELECT * FROM users WHERE username = '${username}'`;
        db.query(query, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
            res.cookie('user', username);
            res.json({ success: true });
            }
        });
    });
    ```
    #### Goose Output
    ```
    I'll analyze this code using our connected knowledge graph to trace security vulnerabilities and their implications:

    [.... Search Nodes ... Open Nodes ...]

    Based on our knowledge graph analysis, I've found multiple critical security issues:

    1. SQL Injection Vulnerability:
        - Issue: Using string concatenation in query WHERE username = '${username}'
        - Impact Chain: SQL Injection → Data Theft
        - Risk Level: Critical
        - Solution (from parameterized_queries): Use parameterized queries instead
    
    2. Authentication Weakness:
        - Issue: Using basic cookie-based session res.cookie('user', username)
        - Impact Chain: Auth Weakness → Account Compromise
        - Risk Level: High
        - Solution (from jwt_auth): Implement JWT with proper expiration
    
    ```

    ```js
    Here's the secure implementation based on our stored patterns:

    app.post('/api/login', async (req, res) => {
        try {
            // Input validation
            if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                success: false,
                error: 'Username and password required'
            });
            }

            // Parameterized query (prevents SQL injection)
            const query = 'SELECT * FROM users WHERE username = ?';
            const result = await db.query(query, [req.body.username]);

            if (!result.length) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
            }

            // Password verification would go here
            // const validPassword = await bcrypt.compare(req.body.password, result[0].password);

            // JWT-based session management (prevents session hijacking)
            const token = jwt.sign(
            { userId: result[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
            );

            res.json({
            success: true,
            token: token
            });

        } catch (error) {
            res.status(500).json({
            success: false,
            error: 'Internal server error'
            });
        }
    });
   ```
   ```
    The fixes address the vulnerability chains our knowledge graph identified:

        1. SQL Injection → Data Theft: Mitigated by parameterized queries
        2. Auth Weakness → Account Compromise: Mitigated by JWT implementation
    
    Additional security improvements based on connected patterns:

        - Added input validation
        - Proper error handling
        - No exposure of internal errors
        - Token-based instead of cookie-based auth
        - Expiration time on authentication
    
    Would you like me to:

        1. Explain any of these security relationships in more detail?
        2. Show how to implement additional security patterns?
        3. Analyze another endpoint?
    ```