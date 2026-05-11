import google.generativeai as genai
import subprocess
import os

# 1. Initialize the Kernel (Ensure your API key is in your environment variables)
# In your terminal, run: export GEMINI_API_KEY="your_api_key_here"
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("FATAL: GEMINI_API_KEY environment variable not found.")
    exit(1)

genai.configure(api_key=api_key)

# 2. Define the Agent's "Hands" (Tools)
def run_terminal_command(command: str) -> str:
    """Executes a terminal command and returns the output. Use this to read files, list directories, or run scripts."""
    print(f"\n[KERNEL ACTION]: Executing -> {command}")
    try:
        # Security note: In a production OS, you would sandbox this. 
        # For local development, this gives the AI full power.
        result = subprocess.run(command, shell=True, text=True, capture_output=True, timeout=15)
        output = result.stdout if result.stdout else result.stderr
        return output[:2000] # Truncate output to prevent overloading context
    except Exception as e:
        return f"Command Failed: {str(e)}"

# 3. Architect the Agent's Personality and Capabilities
model = genai.GenerativeModel(
    model_name='gemini-2.5-flash', # Fast and highly capable for coding
    tools=[run_terminal_command],
    system_instruction=(
        "You are the Autonomous Kernel Agent for Anime Script Pro. "
        "You are running directly in the Lead Architect's terminal. "
        "You have the ability to run terminal commands to read files, list directories, "
        "and check system status. If the Architect asks you to look at a file or fix a bug, "
        "use the run_terminal_command tool to `cat` or `ls` the files, analyze the code, "
        "and provide the exact patch."
    )
)

# 4. Start the OS Loop
print("==================================================")
print("  META-OS KERNEL v1.0 ONLINE")
print("  Type 'exit' to shutdown.")
print("==================================================")

# enable_automatic_function_calling allows the AI to run the tool and read the result automatically
chat = model.start_chat(enable_automatic_function_calling=True)

while True:
    try:
        user_input = input("\nArchitect > ")
        if user_input.lower() in ['exit', 'quit']:
            print("Shutting down Kernel...")
            break
        if not user_input.strip():
            continue
            
        response = chat.send_message(user_input)
        print(f"\nKernel > {response.text}")
        
    except KeyboardInterrupt:
        print("\nForce quitting Kernel...")
        break
    except Exception as e:
        print(f"\n[SYSTEM FAULT]: {str(e)}")