"""
Anime Script Pro — Model Resolution Test Script

This script verifies that user model names and custom provider key references resolve correctly
to their mapped backend engine IDs.

Sections (in order):
  1. Standard Library Imports
  2. Local Path Resolution Context
  3. Local Imports
  4. Core Test Routines
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
import os
import sys

# ==============================================================================
# 2. LOCAL PATH RESOLUTION CONTEXT
# ==============================================================================
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# ==============================================================================
# 3. LOCAL IMPORTS
# ==============================================================================
from backend.ai_engine import AIEngine, resolve_engine_model
from backend.lib.defaults import DEFAULT_SCRIPT_MODEL, MODEL_MAP, STABLE_MODELS

# ==============================================================================
# 4. CORE TEST ROUTINES
# ==============================================================================

def test_resolution() -> None:
    """Runs a series of tests to verify model mapping, defaults, and engine initialization."""
    print("--- TESTING DEFAULTS ---")
    print(f"DEFAULT_SCRIPT_MODEL: {DEFAULT_SCRIPT_MODEL}")
    print(f"MODEL_MAP count: {len(MODEL_MAP)}")
    print(f"STABLE_MODELS count: {len(STABLE_MODELS)}")
    
    print("\n--- TESTING MODEL RESOLUTION ---")
    tests = [
        ("gemini-3.5-flash", "gemini-2.0-flash"),
        ("gemini-3.5-pro", "gemini-2.0-pro"),
        ("nano-banana", "gemini-2.5-flash"),
        ("nvidia-llama", "nvidia/llama-3.1-nemotron-70b-instruct"),
        ("llama-3-70b", "llama3-70b-8192"),
    ]
    
    all_passed = True
    for input_model, expected_output in tests:
        resolved = resolve_engine_model(input_model)
        status = "PASSED" if resolved == expected_output else "FAILED"
        print(f"Input: {input_model:20} | Expected: {expected_output:38} | Resolved: {resolved:38} | Status: {status}")
        if resolved != expected_output:
            all_passed = False
            
    print("\n--- TESTING ENGINE INITIALIZATION ---")
    engine = AIEngine("gemini-3.5-flash")
    print(f"Initial model name: gemini-3.5-flash")
    print(f"Resolved engine model name: {engine.model_name}")
    if engine.model_name == "gemini-2.0-flash":
        print("Engine resolution: PASSED")
    else:
        print("Engine resolution: FAILED")
        all_passed = False
        
    if all_passed:
        print("\n[SUCCESS] All verification tests passed.")
    else:
        print("\n[FAILURE] Verification tests failed.")
        sys.exit(1)


if __name__ == "__main__":
    test_resolution()
