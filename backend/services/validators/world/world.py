def validate_world_prompt(prompt: str) -> None:
    if not prompt or not isinstance(prompt, str) or len(prompt.strip()) < 20:
        raise ValueError("World prompt must be at least 20 characters long.")

def validate_content_type(content_type: str) -> None:
    if not content_type or len(content_type.strip()) < 2:
        raise ValueError("Content type must be at least 2 characters long.")
