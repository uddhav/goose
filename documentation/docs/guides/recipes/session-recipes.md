---
sidebar_position: 1
title: Shareable Recipes
description: "Share a Goose session setup (including tools, goals, and instructions) as a reusable recipe that others can launch with a single click"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { PanelLeft, Bot } from 'lucide-react';

Sometimes you finish a task in Goose and realize, "Hey, this setup could be useful again." Maybe you have curated a great combination of tools, defined a clear goal, and want to preserve that flow. Or maybe you're trying to help someone else replicate what you just did without walking them through it step by step. 

You can turn your current Goose session into a reusable recipe that includes the tools, goals, and setup you're using right now and package it into a new Agent that others (or future you) can launch with a single click.

## Create Recipe

<Tabs groupId="interface">
  <TabItem value="ui" label="Goose Desktop" default>

  Create a recipe from the current session or from a template.

  <Tabs>
    <TabItem value="session" label="Current Session" default>
      1. While in the session you want to save as a recipe, click the <Bot className="inline" size={16} /> button at the bottom of the app
      2. Click `Create a recipe from this session`
      3. A dialog opens with automatically generated instructions and activities:
         - Provide a **title** and **description** for the recipe
         - Review the **instructions** and edit them as needed
         - Provide an optional **initial prompt** to display in the chat box
         - Add or remove optional **activities** to display as buttons
      4. When you're finished, you can:
         - Copy the recipe link to share the recipe with others or [open it from the link](#use-recipe)
         - Click `Save Recipe` to [save the recipe](/docs/guides/recipes/storing-recipes) locally
         - Click `Create Schedule` to [schedule the recipe](#schedule-recipe)
    </TabItem>
    <TabItem value="new" label="Template">
      1. Click the <PanelLeft className="inline" size={16} /> button in the top-left to open the sidebar
      2. Click the `Recipes` button in the sidebar
      3. Click `Create Recipe`
      4. A dialog opens with placeholder content:
         - Provide a **title** and **description** for the recipe
         - Edit the **instructions** as needed
         - Provide an optional **initial prompt** to display in the chat box
         - Add or remove optional **activities** to display as buttons
         - Provide a **recipe name**
         - Choose to [save the recipe](/docs/guides/recipes/storing-recipes) with **global** or **directory** availability
      5. Click `Create Recipe`
    </TabItem>
  </Tabs>

   :::warning
   You cannot create a recipe from an existing recipe session, but you can view or [edit the recipe](#edit-recipe).
   :::

  </TabItem>

  <TabItem value="cli" label="Goose CLI">
   Recipe files can be either JSON (.json) or YAML (.yaml) files. While in a [session](/docs/guides/managing-goose-sessions#start-session), run this command to generate a recipe.yaml file in your current directory:

   ```sh
   /recipe
   ```

   If you want to specify a different name, you can provide it as an argument:

   ```sh
   /recipe my-custom-recipe.yaml
   ```

   <details>
   <summary>recipe file structure</summary>

   ```yaml
   # Required fields
   version: 1.0.0
   title: $title
   description: $description
   instructions: $instructions    # Define the model's behavior

   # Optional fields
   prompt: $prompt                # Initial message to start with
   extensions:                    # Tools the recipe needs
   - $extensions
   activities:                    # Example prompts to display in the Desktop app
   - $activities
   settings:                      # Additional settings
     goose_provider: $provider    # Provider to use for this recipe
     goose_model: $model          # Specific model to use for this recipe
     temperature: $temperature    # Model temperature setting for this recipe (0.0 to 1.0)
   retry:                         # Automated retry logic with success validation
     max_retries: $max_retries    # Maximum number of retry attempts
     checks:                      # Success validation checks
     - type: shell
       command: $validation_command
     on_failure: $cleanup_command # Optional cleanup command on failure
   ```
   </details>

    For detailed descriptions and example configurations of all recipe fields, see the [Recipe Reference Guide](/docs/guides/recipes/recipe-reference).

   :::warning
   You cannot create a recipe from an existing recipe session - the `/recipe` command will not work.
   :::

   :::tip Validate Your Recipe
   You should [validate your recipe](#validate-recipe) to verify that it's complete and properly formatted.
   :::

   #### Optional Parameters

   You may add parameters to a recipe, which will require users to fill in data when running the recipe. Parameters can be added to any part of the recipe (instructions, prompt, activities, etc).

   To use parameters:
   1. Add template variables using `{{ variable_name }}` syntax in your recipe content
   2. Define each parameter in the `parameters` section of your YAML file

   <details>
   <summary>Example recipe with parameters</summary>

   ```yaml
   version: 1.0.0
   title: "{{ project_name }} Code Review" # Wrap the value in quotes if it starts with template syntax to avoid YAML parsing errors
   description: Automated code review for {{ project_name }} with {{ language }} focus
   instructions: You are a code reviewer specialized in {{ language }} development.
   prompt: |
      Apply the following standards:
      - Complexity threshold: {{ complexity_threshold }}
      - Required test coverage: {{ test_coverage }}%
      - Style guide: {{ style_guide }}
   activities:
   - "Review {{ language }} code for complexity"
   - "Check test coverage against {{ test_coverage }}% requirement"
   - "Verify {{ style_guide }} compliance"
   settings:                     
     goose_provider: "anthropic"   
     goose_model: "claude-3-7-sonnet-latest"          
     temperature: 0.7 
   parameters:
   - key: project_name
     input_type: string
     requirement: required # could be required, optional or user_prompt
     description: name of the project
   - key: language
     input_type: string
     requirement: required
     description: language of the code
   - key: complexity_threshold
     input_type: number
     requirement: optional
     default: 20 # default is required for optional parameters
     description: a threshold that defines the maximum allowed complexity
   - key: test_coverage
     input_type: number
     requirement: optional
     default: 80
     description: the minimum test coverage threshold in percentage
   - key: style_guide
     input_type: string
     description: style guide name
     requirement: user_prompt
     # If style_guide param value is not specified in the command, user will be prompted to provide a value, even in non-interactive mode
   ```
   </details>

   See the [Recipe Reference Guide](/docs/guides/recipes/recipe-reference) for more information about recipe fields. 

   </TabItem> 


  <TabItem value="generator" label="Recipe Generator">
    Use the online [Recipe Generator](https://block.github.io/goose/recipe-generator) tool to create a recipe. First choose your preferred format:

    - **URL Format**: Generates a shareable link that opens a session in the Goose Desktop app
    - **YAML Format**: Generates YAML content that you can save to file and then run in the Goose CLI app

    Then fill out the recipe form by providing:
      - A **title** for the recipe
      - A **description**
      - A set of **instructions** for the recipe.
      - An optional initial **prompt**:
        - In the Desktop app, the prompt displays in the chat box.
        - In the CLI app, the prompt provides the initial message to run. Note that a prompt is required to run the recipe in headless (non-interactive) mode.
      - A set of optional **activities** to display in the Desktop app.
      - YAML format only: Optional **author** contact information and **extensions** the recipe uses.

  </TabItem>
</Tabs>

## Edit Recipe
<Tabs groupId="interface">
  <TabItem value="ui" label="Goose Desktop" default>

   1. While in the session that's using the recipe, click the <Bot className="inline" size={16} /> button at the bottom of the app 
   2. Click `View/Edit Recipe` 
   3. Edit any of the following:
      - Title
      - Description
      - Instructions
      - Initial prompt
      - Activities
  4. When you're finished, you can:
      - Copy the recipe link to share the recipe with others
      - Click `Save Recipe` to [save the recipe](/docs/guides/recipes/storing-recipes) locally
      - Click `Create Schedule` to [schedule the recipe](#schedule-recipe)

  </TabItem>

  <TabItem value="cli" label="Goose CLI">
  Once the recipe file is created, you can open it with your preferred text editor and modify the value of any field.

</TabItem> 
</Tabs>

## Use Recipe

<Tabs groupId="interface">
  <TabItem value="ui" label="Goose Desktop" default>

  1. Open the recipe using a direct link or manual URL entry, or from your Recipe library:

     **Direct Link:**

         1. Click a recipe link shared with you

     **Manual URL Entry:**

         1. Paste a recipe link into your browser's address bar 
         2. Press `Enter` and click the `Open Goose.app` prompt
       
     **Recipe Library:**

         1. Click the <PanelLeft className="inline" size={16} /> button in the top-left to open the sidebar
         2. Click `Recipes` in the sidebar
         3. Find your recipe in the Recipe Library
         4. Click `Use` next to the recipe you want to open

  2. If the recipe contains parameters, enter your values in the `Recipe Parameters` dialog and click `Start Recipe`.
  
     Parameters are dynamic values used in the recipe:

     - **Required parameters** are marked with red asterisks (*)
     - **Optional parameters** show default values that can be changed

  3. To run the recipe, click an activity bubble or send the prompt.

  :::info Parameter Creation In Goose CLI Only
  You can enter parameter values to use in a recipe, but you cannot add parameters to a recipe in Goose Desktop. Parameters can only be defined in recipes created via the CLI.
  :::

  :::info Privacy & Isolation
  - Each person gets their own private session
  - No data is shared between users
  - Your session won't affect the original recipe creator's session
  :::
  </TabItem>

  <TabItem value="cli" label="Goose CLI">

  Using a recipe with the Goose CLI might involve the following tasks:
  - [Configuring your recipe location](#configure-recipe-location)
  - [Running a recipe](#run-a-recipe)
  - [Scheduling a recipe](#schedule-recipe)

   #### Configure Recipe Location

  Recipes can be stored locally on your device or in a GitHub repository. Configure your recipe repository using either the `goose configure` command or [config file](/docs/guides/config-file#global-settings).

  :::tip Repository Structure
  - Each recipe should be in its own directory
  - Directory name matches the recipe name you use in commands
  - Recipe file can be either recipe.yaml or recipe.json
  :::

   <Tabs>
     <TabItem value="configure" label="Using goose configure" default>

       Run the configure command:
       ```sh
       goose configure
       ```

       You'll see the following prompts:

       ```sh
       ┌  goose-configure 
       │
       ◆  What would you like to configure?
       │  ○ Configure Providers 
       │  ○ Add Extension 
       │  ○ Toggle Extensions 
       │  ○ Remove Extension 
       // highlight-start
       │  ● Goose Settings (Set the Goose Mode, Tool Output, Tool Permissions, Experiment, Goose recipe github repo and more)
       // highlight-end
       │
       ◇  What would you like to configure?
       │  Goose Settings 
       │
       ◆  What setting would you like to configure?
       │  ○ Goose Mode 
       │  ○ Tool Permission 
       │  ○ Tool Output 
       │  ○ Toggle Experiment 
       // highlight-start
       │  ● Goose recipe github repo (Goose will pull recipes from this repo if not found locally.)
       // highlight-end
       └  
       ┌  goose-configure 
       │
       ◇  What would you like to configure?
       │  Goose Settings 
       │
       ◇  What setting would you like to configure?
       │  Goose recipe github repo 
       │
       ◆  Enter your Goose Recipe GitHub repo (owner/repo): eg: my_org/goose-recipes
       // highlight-start
       │  squareup/goose-recipes (default)
       // highlight-end
       └  
       ```

     </TabItem>

     <TabItem value="config" label="Using config file">

       Add to your config file:
       ```yaml title="~/.config/goose/config.yaml"
       GOOSE_RECIPE_GITHUB_REPO: "owner/repo"
       ```

     </TabItem>
   </Tabs>

   #### Run a Recipe

   <Tabs groupId="interface">
     <TabItem value="local" label="Local Recipe" default>

       **Basic Usage** - Run once and exit (see [run options](/docs/guides/goose-cli-commands#run-options) and [recipe commands](/docs/guides/goose-cli-commands#recipe) for more):
       ```sh
       # Using recipe file in current directory or `GOOSE_RECIPE_PATH` directories
       goose run --recipe recipe.yaml

       # Using full path
       goose run --recipe ./recipes/my-recipe.yaml
       ```

       **Preview Recipe** - Use the [`explain`](/docs/guides/goose-cli-commands#run-options) command to view details before running:
 
       **Interactive Mode** - Start an interactive session:
       ```sh
       goose run --recipe recipe.yaml --interactive
       ```
       The interactive mode will prompt for required values:
       ```sh
       ◆ Enter value for required parameter 'language':
       │ Python
       │
       ◆ Enter value for required parameter 'style_guide':
       │ PEP8
       ```

       **With Parameters** - Supply parameter values when running recipes. See the [`run` command documentation](/docs/guides/goose-cli-commands#run-options) for detailed examples and options.

       Basic example:
       ```sh
       goose run --recipe recipe.yaml --params language=Python
       ```

     </TabItem>

     <TabItem value="github" label="GitHub Recipe">

       Once you've configured your GitHub repository, you can run recipes by name:

       **Basic Usage** - Run recipes from your configured repo using the recipe name that matches its directory (see [run options](/docs/guides/goose-cli-commands#run-options) and [recipe commands](/docs/guides/goose-cli-commands#recipe) for more):

       ```sh
       goose run --recipe recipe-name
       ```

       For example, if your repository structure is:
       ```
       my-repo/
       ├── code-review/
       │   └── recipe.yaml
       └── setup-project/
           └── recipe.yaml
       ```
       
       You would run the following command to run the code review recipe:
       ```sh
       goose run --recipe code-review
       ```

      **Preview Recipe** - Use the [`explain`](/docs/guides/goose-cli-commands#run-options) command to view details before running:

       **Interactive Mode** - With parameter prompts:
       ```sh
       goose run --recipe code-review --interactive
       ```
       The interactive mode will prompt for required values:
       ```sh
       ◆ Enter value for required parameter 'project_name':
       │ MyProject
       │
       ◆ Enter value for required parameter 'language':
       │ Python
       ```

       **With Parameters** - Supply parameter values when running recipes. See the [`run` command documentation](/docs/guides/goose-cli-commands#run-options) for detailed examples and options.

     </TabItem>
   </Tabs>
  :::info Privacy, Isolation, & Secrets
  - Each person gets their own private session
  - No data is shared between users
  - Your session won't affect the original recipe creator's session
  - The CLI can prompt users for required [extension secrets](/docs/guides/recipes/recipe-reference#extension-secrets)
  :::

   </TabItem>
</Tabs>

## Validate Recipe

<Tabs groupId="interface">
  <TabItem value="ui" label="Goose Desktop" default>
    Recipe validation is only available through the CLI.
  </TabItem>
  <TabItem value="cli" label="Goose CLI">
    Validate your recipe file to ensure it's properly configured. Validation verifies that:
    - All required fields are present
    - Parameters are properly formatted
    - Referenced extensions exist and are valid
    - The YAML/JSON syntax is correct

   ```sh
   goose recipe validate recipe.yaml
   ```

   :::info
   If you want to validate a recipe you just created, you need to [exit the session](/docs/guides/managing-goose-sessions#exit-session) before running the [`validate` subcommand](/docs/guides/goose-cli-commands#recipe).
   :::

   Recipe validation can be useful for:
    - Troubleshooting recipes that aren't working as expected
    - Verifying recipes after manual edits
    - Automated testing in CI/CD pipelines

  </TabItem>
</Tabs>

## Share Recipe

<Tabs groupId="interface">
  <TabItem value="ui" label="Goose Desktop" default>
    Share your recipe with Desktop users by copying the recipe link:

    1. Click the <PanelLeft className="inline" size={16} /> button in the top-left to open the sidebar
    2. Click `Recipes` in the sidebar
    3. Find your recipe in the Recipe Library
    4. Click `Preview` next to the recipe you want to share
    5. Under `Deeplink`, click `Copy` and then share the link with others

    When someone clicks the link, it will open Goose Desktop with your recipe configuration. They can also use your recipe link to [import a recipe](/docs/guides/recipes/storing-recipes#storing-recipes) into their Recipe Library for future use.

  </TabItem>
  <TabItem value="cli" label="Goose CLI">
    Share your recipe with CLI users by directly sending them the recipe file or converting it to a shareable [deep link](/docs/guides/goose-cli-commands#recipe) for Desktop users:

    ```sh
    goose recipe deeplink recipe.yaml
    ```

  </TabItem>
</Tabs>

:::info Privacy & Isolation
Each recipient gets their own private session when using your shared recipe. No data is shared between users, and your original session and recipe remain unaffected.
:::

## Schedule Recipe
<Tabs groupId="interface">
  <TabItem value="ui" label="Goose Desktop" default>
Automate Goose recipes by running them on a schedule.

   1. Click the <PanelLeft className="inline" size={16} /> button in the top-left to open the sidebar
   2. Click `Scheduler` 
   3. Click `Create Schedule`
   3. In the dialog that appears:
      - Provide a **name** for the schedule
      - Select the **source** of your recipe. This can be either a `yaml` file or link generated by Goose Desktop.
      - Select whether you want your recipe to run in the background or foreground **execution mode**. Recipes run in the background don't open a window, but the session results are saved. Recipes run in the foreground will open a window if the Goose Desktop app is running. Otherwise, the recipe runs in the background.
      - Choose the **frequency** and **time** to run your recipe. Your selected frequency (e.g. every 20 minutes, weekly at 10 AM on Friday) is converted into a [cron expression](https://en.wikipedia.org/wiki/Cron#Cron_expression) used by Goose.
      - Click `Create Schedule`

  Your new scheduled recipe is listed in the `Scheduler` page. Click on the schedule to view details, see when it was last run, and perform actions with the scheduled recipe:
    - `Run Schedule Now` to trigger the recipe manually
    - `Edit Schedule` to change the scheduled frequency
    - `Pause Schedule` to stop the recipe from running automatically. 

  At the bottom of the `Schedule Details` page you can view the list of sessions created by the scheduled recipe and open or restore each session.

  </TabItem>
  <TabItem value="cli" label="Goose CLI">
  Automate Goose recipes by scheduling them to run with a [cron expression](https://en.wikipedia.org/wiki/Cron#Cron_expression).

  ```bash
  # Add a new scheduled recipe which runs every day at 9 AM
  goose schedule add --id daily-report --cron "0 0 9 * * *" --recipe-source ./recipes/daily-report.yaml
  ```
  You can use either a 5, 6, or 7-digit cron expression for full scheduling precision, following the format "seconds minutes hours day-of-month month day-of-week year".

  See the [`schedule` command documentation](/docs/guides/goose-cli-commands.md#schedule) for detailed examples and options.

When scheduling Goose recipes with the CLI, you can use Goose's built-in cron scheduler (default), or the [Temporal scheduler](https://docs.temporal.io/evaluate/development-production-features/schedules) (requires the Temporal CLI). Switch from the default legacy scheduler by setting the `GOOSE_SCHEDULER_TYPE` [environment variable](/docs/guides/environment-variables.md#session-management):

  ```bash
  export GOOSE_SCHEDULER_TYPE=temporal
  ```
  Use Temporal scheduling if you want an advanced workflow engine with monitoring features. The scheduling engines do not share schedules, so schedules created with the legacy Goose scheduler cannot be run with the Temporal scheduler, and vice-versa. 
</TabItem>
</Tabs>

## Core Components

 A recipe needs these core components:

   - **Instructions**: Define the agent's behavior and capabilities
      - Acts as the agent's mission statement
      - Makes the agent ready for any relevant task
      - Required if no prompt is provided

   - **Prompt** (Optional): Starts the conversation automatically
      - Without a prompt, the agent waits for user input
      - Useful for specific, immediate tasks
      - Required if no instructions are provided

   - **Activities**: Example tasks that appear as clickable bubbles
      - Help users understand what the recipe can do
      - Make it easy to get started

## Advanced Features

### Automated Retry Logic

Recipes can include retry logic to automatically attempt task completion multiple times until success criteria are met. This is particularly useful for:

- **Automation workflows** that need to ensure successful completion
- **Development tasks** like running tests that may need multiple attempts  
- **System operations** that require validation and cleanup

**Basic retry configuration:**
```yaml
retry:
  max_retries: 3
  checks:
    - type: shell
      command: "test -f output.txt"  # Check if output file exists
  on_failure: "rm -f temp_files*"   # Cleanup on failure
```

**How it works:**
1. Recipe executes normally with provided instructions
2. After completion, success checks validate the results
3. If validation fails and retries remain:
   - Optional cleanup command runs
   - Agent state resets to initial conditions
   - Recipe execution starts over
4. Process continues until either success or max retries reached

See the [Recipe Reference Guide](/docs/guides/recipes/recipe-reference#automated-retry-with-success-validation) for complete retry configuration options and examples.

### Structured Output for Automation

Recipes can enforce [structured JSON output](/docs/guides/recipes/recipe-reference#structured-output-with-response), making them ideal for automation workflows that need to parse and process agent responses reliably. Key benefits include:

- **Reliable parsing**: Consistent JSON format for scripts, automation, and CI/CD pipelines
- **Built-in validation**: Ensures output matches your requirements  
- **Easy extraction**: Final output appears as a single line for simple parsing

Structured output is particularly useful for: 
- **Development workflows**: Code analysis reports, test results with pass/fail counts, and build status with deployment readiness
- **Data processing**: Results with counts and validation status, content analysis with structured findings  
- **Documentation generation**: Consistent metadata and structured project reports for further processing

**Example structured output configuration:**
```yaml
response:
  json_schema:
    type: object
    properties:
      build_status:
        type: string
        enum: ["success", "failed", "warning"]
        description: "Overall build result"
      tests_passed:
        type: number
        description: "Number of tests that passed"
      tests_failed:
        type: number
        description: "Number of tests that failed"
      artifacts:
        type: array
        items:
          type: string
        description: "Generated build artifacts"
      deployment_ready:
        type: boolean
        description: "Whether the build is ready for deployment"
    required:
      - build_status
      - tests_passed
      - tests_failed
      - deployment_ready
```

**How it works:**
1. Recipe runs normally with provided instructions
2. Goose calls a `final_output` tool with JSON matching your schema
3. Output is validated against the JSON schema
4. If validation fails, Goose receives error details and must correct the output
5. Final validated JSON appears as the last line of output for easy extraction

**Example automation usage:**
```bash
# Run recipe and extract JSON output
goose run --recipe analysis.yaml --params project_path=./src > output.log
RESULT=$(tail -n 1 output.log)
echo "Analysis Status: $(echo $RESULT | jq -r '.build_status')"
echo "Issues Found: $(echo $RESULT | jq -r '.tests_failed')"
```

:::info
Structured output is supported in recipes run in both the Goose CLI and Goose Desktop. However, creating and editing the `json_schema` configuration must be done manually in the recipe file.
:::

## What's Included

A recipe captures:

- AI instructions (goal/purpose)  
- Suggested activities (examples for the user to click)  
- Enabled extensions and their configurations  
- Project folder or file context  
- Initial setup (but not full conversation history)
- The model and provider to use when running the recipe (optional)
- Retry logic and success validation configuration (if configured)


To protect your privacy and system integrity, Goose excludes:

- Global and local memory  
- API keys and personal credentials  
- System-level Goose settings  


This means others may need to supply their own credentials or memory context if the recipe depends on those elements.

## CLI and Desktop Formats

The Goose CLI supports both CLI and Desktop recipe formats:

- **CLI Format**: Recipe fields are at the root level. This format is used when recipes are created via the CLI `/recipe` command and Recipe Generator YAML option.
- **Desktop Format**: Recipe fields are nested under a `recipe` key. This format is used when recipes are saved in Goose Desktop.

Both formats work seamlessly with `goose run --recipe <file>` and `goose recipe` CLI commands - you don't need to convert between them. For more details, see [CLI and Desktop Formats](/docs/guides/recipes/recipe-reference#cli-and-desktop-formats).

## Learn More
Check out the [Goose Recipes](/docs/guides/recipes) guide for more docs, tools, and resources to help you master Goose recipes.