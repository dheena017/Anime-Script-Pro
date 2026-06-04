import os
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src"))

replacements = {
    "CastLayout": "CharactersLayout",
    "CastTab": "CharacterTab",
    "CastContext": "CharacterPageContext",
    "CastTabActionsContext": "CharacterTabActionsContext",
    "CastHeader": "CharacterHeader",
    "CastEmptyState": "CharacterEmptyState",
    "CastToolbar": "CharacterToolbar",
    "CastTabs": "CharacterTabs",
    "castStyles": "characterStyles",
    "CastLoadingPage": "CharactersLoadingPage",
    "CastCard": "CharacterCard",
    "CastView": "CharacterView",
    "/anime/cast": "/anime/characters",
    "AnimeStudio/Cast": "AnimeStudio/Characters",
    "studio-generate-cast": "studio-generate-characters",
    "isAnalyzingCast": "isAnalyzingCharacters",
    "setCastList": "setCharacterList",
    "setCastData": "setCharacterData",
    "setCastProfiles": "setCharacterProfiles",
    "setCastDNA": "setCharacterDNA",
    "setCastDynamics": "setCharacterDynamics",
    "setCastIntegrity": "setCharacterIntegrity",
    "setIsAnalyzingCast": "setIsAnalyzingCharacters",
    "castList": "characterList",
    "castData": "characterData",
    "castProfiles": "characterProfiles",
    "castDNA": "characterDNA",
    "castDynamics": "characterDynamics",
    "castIntegrity": "characterIntegrity"
}

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".ts") or file.endswith(".tsx"):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                new_content = content
                for old, new in replacements.items():
                    new_content = new_content.replace(old, new)
                
                if new_content != content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Updated {file_path}")
            except Exception as e:
                print(f"Error processing {file_path}: {e}")

print("Replacement complete.")
