import os, re

base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "pages", "studio", "AnimeStudio"))
modules = ['Storyboard', 'SEO', 'Prompts', 'Screening']

for mod in modules:
    empty_state_file = os.path.join(base, mod, 'components', f'{mod}EmptyState.tsx')
    page_file = os.path.join(base, mod, f'{mod}Page.tsx')
    
    if os.path.exists(empty_state_file):
        with open(empty_state_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'onLoadDemo?: () => void;' not in content and 'onLoadDemo: () => void;' not in content:
            content = content.replace('  isGenerating: boolean;', '  onLoadDemo?: () => void;\n  isGenerating: boolean;')
            content = content.replace('  isGenerating\n}) => {', '  onLoadDemo,\n  isGenerating\n}) => {')
            content = content.replace('      features={features}', '      secondaryActionLabel="Load Aetheria Demo Project"\n      onSecondaryAction={onLoadDemo}\n      features={features}')
            
            with open(empty_state_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated {empty_state_file}')

    if os.path.exists(page_file):
        with open(page_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if 'loadDemoProject' not in content:
            content = re.sub(r'(const\s*{\s*[\s\S]*?)(\s*}=\s*useGeneratorDispatch\(\);)', r'\1,\n    loadDemoProject\2', content)
        
        if 'onLoadDemo={loadDemoProject}' not in content:
            content = content.replace(f'<{mod}EmptyState', f'<{mod}EmptyState\n          onLoadDemo={{loadDemoProject}}')
            
            with open(page_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated {page_file}')
