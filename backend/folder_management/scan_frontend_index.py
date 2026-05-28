import os
import re
import sys
from typing import Any, Dict, List, Set, Tuple

# ==============================================================================
# 1. PARSING REGEX DEFINITIONS
# ==============================================================================

# Match JSDoc comments: /** ... */
JSDOC_RE = re.compile(r'/\*\*(.*?)\*/', re.DOTALL)

# Match React Component definitions (starting with an uppercase letter)
ARROW_COMPONENT_RE = re.compile(
    r'(?:export\s+)?(?:default\s+)?(?:const|let)\s+([A-Z][a-zA-Z0-9_]*)\s*(?::\s*[^=]+)?\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>',
    re.MULTILINE
)
FUNCTION_COMPONENT_RE = re.compile(
    r'(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([A-Z][a-zA-Z0-9_]*)\b',
    re.MULTILINE
)

# Match helper functions (starting with a lowercase letter)
ARROW_HELPER_RE = re.compile(
    r'(?:export\s+)?(?:const|let)\s+([a-z][a-zA-Z0-9_]*)\s*(?::\s*[^=]+)?\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>',
    re.MULTILINE
)
FUNCTION_HELPER_RE = re.compile(
    r'(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([a-z][a-zA-Z0-9_]*)\b',
    re.MULTILINE
)

# Match TypeScript Types and Interfaces
INTERFACE_RE = re.compile(r'(?:export\s+)?interface\s+([A-Za-z0-9_]+)\b', re.MULTILINE)
TYPE_RE = re.compile(r'(?:export\s+)?type\s+([A-Za-z0-9_]+)\b', re.MULTILINE)

# Match hook invocations: useState, useEffect, or custom hooks (use[A-Z][a-zA-Z0-9]*)
HOOK_RE = re.compile(r'\b(use[A-Z_][a-zA-Z0-9_]*|useState|useEffect|useContext|useReducer|useMemo|useCallback|useRef)\b')

# Match environment variable usages
ENV_VAR_RE = re.compile(r'\b(?:import\.meta\.env|process\.env)\.([A-Za-z0-9_]+)\b')

# Match import source statements
IMPORT_RE = re.compile(r'\bimport\s+.*?\s+from\s+[\'"]([^\'"]+)[\'"]', re.DOTALL)

# Match event listeners, custom events, and JSX handler props
ADD_EVENT_LISTENER_RE = re.compile(r'\baddEventListener\(\s*[\'"]([^\'"]+)[\'"]')
CUSTOM_EVENT_RE = re.compile(r'\bCustomEvent\(\s*[\'"]([^\'"]+)[\'"]')
EVENT_PROP_RE = re.compile(r'\b(on[A-Z][A-Za-z0-9_]*)\b')

# Match error classes and explicit error construction
ERROR_CLASS_RE = re.compile(r'\bclass\s+([A-Za-z0-9_]+)\s+extends\s+Error\b')
THROW_ERROR_RE = re.compile(r'\bthrow\s+new\s+([A-Za-z0-9_]*Error)\b')
NEW_ERROR_RE = re.compile(r'\bnew\s+([A-Za-z0-9_]*Error)\b')

# Match exported constants and symbols
EXPORT_CONST_RE = re.compile(r'\bexport\s+(?:const|let|var)\s+([A-Za-z0-9_]+)\b')
EXPORT_FUNCTION_RE = re.compile(r'\bexport\s+(?:default\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)\b')
EXPORT_CLASS_RE = re.compile(r'\bexport\s+class\s+([A-Za-z0-9_]+)\b')

# Match route-like path declarations
ROUTE_PATH_RE = re.compile(r'\bpath\s*=\s*[\'\"](\/[A-Za-z0-9_\-/:*]+)[\'\"]')
ROUTE_CONFIG_PATH_RE = re.compile(r'\bpath\s*:\s*[\'\"](\/[A-Za-z0-9_\-/:*]+)[\'\"]')

# ==============================================================================
# 2. UTILITY PARSERS
# ==============================================================================

def parse_jsdoc(file_content: str, name_pos: int) -> Tuple[str, str]:
    """Scans backwards from a definition position to extract JSDoc description blocks.

    Args:
        file_content: The full code string of the module.
        name_pos: Index position of the component/helper name.

    Returns:
        Tuple[str, str]: (use_description, output_description)
    """
    use = "No description available."
    output = "Not specified."

    # Look backwards up to 800 characters from the definition pos for comments
    scan_chunk = file_content[max(0, name_pos - 800):name_pos]
    matches = list(JSDOC_RE.finditer(scan_chunk))
    
    if matches:
        # Grab the closest JSDoc block preceding the position
        doc_text = matches[-1].group(1).strip()
        lines = []
        for line in doc_text.split('\n'):
            line_clean = line.strip().lstrip('*').strip()
            if line_clean and not line_clean.startswith('@'):
                lines.append(line_clean)
        
        if lines:
            use = lines[0]
            if len(lines) > 1:
                use += " " + " ".join(lines[1:])
        
        # Parse returns tags
        ret_match = re.search(r'@returns?\s+(.*)', doc_text, re.IGNORECASE)
        if ret_match:
            output = ret_match.group(1).strip()

    return use, output


def extract_line_range(file_content: str, start_pos: int) -> Tuple[int, int]:
    """Determines line numbers for a definition block by parsing brace boundaries.

    Args:
        file_content: Full source code text.
        start_pos: Index location where definition begins.

    Returns:
        Tuple[int, int]: (start_line_1_indexed, end_line_1_indexed)
    """
    pre_content = file_content[:start_pos]
    start_line = pre_content.count('\n') + 1

    # Find the actual function body opening brace '{'
    # We scan forward, tracking parenthesis depth to ignore destructured parameters like ({ ... })
    brace_start = -1
    paren_count = 0
    length = len(file_content)
    
    # Scan up to 500 characters forward to find the body opening brace
    for i in range(start_pos, min(start_pos + 500, length)):
        char = file_content[i]
        if char == '(':
            paren_count += 1
        elif char == ')':
            paren_count = max(0, paren_count - 1)
        elif char == '{' and paren_count == 0:
            brace_start = i
            break

    if brace_start == -1:
        # Fallback to current line if no body brace
        return start_line, start_line

    brace_count = 1
    end_pos = brace_start + 1

    while brace_count > 0 and end_pos < length:
        char = file_content[end_pos]
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
        end_pos += 1

    post_content = file_content[:end_pos]
    end_line = post_content.count('\n') + 1
    return start_line, end_line


def get_complexity_label(line_count: int, hook_count: int) -> str:
    """Computes qualitative complexity score based on line count and hook bindings.

    Args:
        line_count: lines of code span.
        hook_count: hooks referenced inside body block.

    Returns:
        str: Qualitative label (Low / Medium / High) with color indicators.
    """
    score = (line_count // 20) + (hook_count * 2)
    if score <= 4:
        return "Low 🟢"
    elif score <= 10:
        return "Medium 🟡"
    else:
        return "High 🔴"


def extract_props_and_types(file_content: str, start_pos: int) -> Tuple[List[str], str]:
    """Destructures parameters of a React component to find names and types of props."""
    props_list = []
    props_type = "Not specified"
    
    paren_start = file_content.find('(', start_pos)
    if paren_start != -1 and paren_start - start_pos < 150:
        paren_count = 1
        paren_end = paren_start + 1
        length = len(file_content)
        while paren_count > 0 and paren_end < length:
            c = file_content[paren_end]
            if c == '(':
                paren_count += 1
            elif c == ')':
                paren_count -= 1
            paren_end += 1
        
        paren_content = file_content[paren_start:paren_end]
        
        destruct_match = re.search(r'\{\s*([^}]+)\s*\}', paren_content)
        if destruct_match:
            raw_props = destruct_match.group(1).split(',')
            for p in raw_props:
                p_clean = p.split('=')[0].strip()
                p_clean = p_clean.split(':')[0].strip()
                if p_clean and not p_clean.startswith('/') and not p_clean.startswith('*') and not p_clean.startswith('.'):
                    props_list.append(p_clean)
        
        type_match = re.search(r'\)\s*:\s*([A-Za-z0-9_<>.]+)', paren_content)
        if not type_match:
            type_match = re.search(r'\}\s*:\s*([A-Za-z0-9_<>.]+)', paren_content)
        
        if type_match:
            props_type = type_match.group(1).strip()
            
    return props_list, props_type


def extract_local_states(body_block: str) -> List[str]:
    """Scans a block of React component code for useState states."""
    states = []
    state_matches = re.finditer(r'(?:const|let|var)\s+\[\s*([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s*\]\s*=\s*useState', body_block)
    for m in state_matches:
        states.append(m.group(1))
    return sorted(list(set(states)))


def extract_contexts_used(body_block: str) -> List[str]:
    """Identifies React contexts or custom selectors imported/used inside components."""
    contexts = []
    if 'useGeneratorState' in body_block:
        contexts.append('GeneratorStateContext')
    if 'useGeneratorDispatch' in body_block:
        contexts.append('GeneratorDispatchContext')
    
    custom_ctx = re.findall(r'\b(use[A-Za-z0-9_]*Context)\b', body_block)
    contexts.extend(custom_ctx)
    
    use_ctx_matches = re.findall(r'useContext\(\s*([A-Za-z0-9_]+)\s*\)', body_block)
    contexts.extend(use_ctx_matches)
    
    return sorted(list(set(contexts)))


def extract_api_calls(content: str) -> List[str]:
    """Finds REST API endpoints called via fetch or axios string literals."""
    api_matches = re.findall(r'[\'"](\/api\/[a-zA-Z0-9_\-\/{}*]+)[\'"]', content)
    cleaned_apis = []
    for api in api_matches:
        clean = api.strip()
        if clean and clean not in cleaned_apis:
            cleaned_apis.append(clean)
    return sorted(cleaned_apis)


def extract_child_components(content: str, parent_name: str) -> List[str]:
    """Finds child components rendered inside this TSX component."""
    tags = re.findall(r'<\s*([A-Z][a-zA-Z0-9_]*)\b', content)
    exclusions = ('Fragment', 'React', 'Link', 'Route', 'Routes', 'BrowserRouter', 'Provider', parent_name)
    filtered_tags = []
    for t in tags:
        if t not in exclusions and not t.endswith('Icon') and t not in filtered_tags:
            filtered_tags.append(t)
    return sorted(filtered_tags)

# ==============================================================================
# 3. CODEBASE SCANNING ENGINE
# ==============================================================================

class FrontendModuleAnalyzer:
    """Performs static analysis parsing for TypeScript and React files."""

    def __init__(self, file_path: str) -> None:
        self.file_path = file_path
        self.components: List[Dict[str, Any]] = []
        self.helpers: List[Dict[str, Any]] = []
        self.interfaces: List[str] = []
        self.types: List[str] = []
        self.props: List[str] = []
        self.dependencies: Set[str] = set()
        self.env_vars: Set[str] = set()
        self.hooks_used: Set[str] = set()
        self.events_used: Set[str] = set()
        self.errors_used: Set[str] = set()
        self.exports_used: Set[str] = set()
        self.route_paths: Set[str] = set()

    def analyze(self) -> None:
        """Parses the module contents using static regex and code scanning loops."""
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception:
            return

        # Extract environment variables and dependencies
        for m in ENV_VAR_RE.finditer(content):
            self.env_vars.add(m.group(1))

        for m in IMPORT_RE.finditer(content):
            dep_path = m.group(1)
            # Filter standard system modules to capture internal path links
            if dep_path.startswith(".") or dep_path.startswith("@/"):
                self.dependencies.add(dep_path)

        # Extract event names and JSX handler props
        for m in ADD_EVENT_LISTENER_RE.finditer(content):
            self.events_used.add(m.group(1))
        for m in CUSTOM_EVENT_RE.finditer(content):
            self.events_used.add(m.group(1))
        for m in EVENT_PROP_RE.finditer(content):
            self.events_used.add(m.group(1))

        # Extract error classes and explicit error constructors
        for m in ERROR_CLASS_RE.finditer(content):
            self.errors_used.add(m.group(1))
        for m in THROW_ERROR_RE.finditer(content):
            self.errors_used.add(m.group(1))
        for m in NEW_ERROR_RE.finditer(content):
            self.errors_used.add(m.group(1))

        # Extract exported constants, functions, and classes
        for m in EXPORT_CONST_RE.finditer(content):
            self.exports_used.add(m.group(1))
        for m in EXPORT_FUNCTION_RE.finditer(content):
            self.exports_used.add(m.group(1))
        for m in EXPORT_CLASS_RE.finditer(content):
            self.exports_used.add(m.group(1))

        # Extract route paths and navigation targets
        for m in ROUTE_PATH_RE.finditer(content):
            self.route_paths.add(m.group(1))
        for m in ROUTE_CONFIG_PATH_RE.finditer(content):
            self.route_paths.add(m.group(1))

        # Extract interfaces
        for m in INTERFACE_RE.finditer(content):
            name = m.group(1)
            self.interfaces.append(name)
            if "Props" in name:
                self.props.append(name)

        # Extract types
        for m in TYPE_RE.finditer(content):
            name = m.group(1)
            self.types.append(name)
            if "Props" in name:
                self.props.append(name)

        # Scan for React Components
        seen_definitions = set()

        def register_definitions(pattern: re.Pattern, target_list: List[Dict[str, Any]], tag: str) -> None:
            for match in pattern.finditer(content):
                name = match.group(1)
                if name in seen_definitions:
                    continue
                seen_definitions.add(name)

                start_pos = match.start()
                start_line, end_line = extract_line_range(content, start_pos)
                line_count = end_line - start_line + 1

                # Extract JSDoc block
                use, output = parse_jsdoc(content, start_pos)

                # Scan function body block for hook usages
                # Locate the body opening brace to scan within the body only
                brace_start = -1
                paren_count = 0
                length = len(content)
                for i in range(start_pos, min(start_pos + 500, length)):
                    char = content[i]
                    if char == '(':
                        paren_count += 1
                    elif char == ')':
                        paren_count = max(0, paren_count - 1)
                    elif char == '{' and paren_count == 0:
                        brace_start = i
                        break

                if brace_start != -1:
                    brace_count = 1
                    end_pos = brace_start + 1
                    while brace_count > 0 and end_pos < length:
                        char = content[end_pos]
                        if char == '{':
                            brace_count += 1
                        elif char == '}':
                            brace_count -= 1
                        end_pos += 1
                    body_block = content[brace_start:end_pos]
                else:
                    body_block = ""

                local_hooks = set(HOOK_RE.findall(body_block))
                self.hooks_used.update(local_hooks)

                complexity = get_complexity_label(line_count, len(local_hooks))

                # Extract advanced telemetry fields
                p_list, p_type = extract_props_and_types(content, start_pos)
                local_states = extract_local_states(body_block)
                contexts_used = extract_contexts_used(body_block)
                api_calls = extract_api_calls(content)
                child_components = extract_child_components(content, name)

                target_list.append({
                    "name": name,
                    "start_line": start_line,
                    "end_line": end_line,
                    "use": use,
                    "output": output,
                    "complexity": complexity,
                    "hooks": sorted(list(local_hooks)),
                    "tag": tag,
                    "props_list": p_list,
                    "props_type": p_type,
                    "local_states": local_states,
                    "contexts_used": contexts_used,
                    "api_calls": api_calls,
                    "child_components": child_components
                })

        # Register Components & Helpers
        register_definitions(ARROW_COMPONENT_RE, self.components, "`[React Component]` ⚛️")
        register_definitions(FUNCTION_COMPONENT_RE, self.components, "`[React Component]` ⚛️")
        register_definitions(ARROW_HELPER_RE, self.helpers, "`[Helper Function]` ⚙️")
        register_definitions(FUNCTION_HELPER_RE, self.helpers, "`[Helper Function]` ⚙️")

# ==============================================================================
# 4. REPORT GENERATION ENGINE
# ==============================================================================

def make_anchor(file_path: str) -> str:
    """Compiles a valid HTML anchor for markdown links."""
    clean = file_path.lower().replace('.', '').replace('\\', '').replace('/', '').replace(' ', '-')
    return f"#-📂-{clean}"


def scan_frontend() -> None:
    """Scans all ts/tsx files in frontend/src, parses metadata, and compiles frontend_architecture_index.md."""
    file_records = []
    
    # Dashboard counters
    total_files = 0
    total_components = 0
    total_helpers = 0
    total_interfaces = 0
    total_types = 0
    total_props = set()
    total_hook_invocations = set()
    total_env_variables = set()
    total_events = set()
    total_errors = set()
    total_exports = set()
    total_routes = set()

    frontend_src_root = os.path.join("frontend", "src")
    if not os.path.exists(frontend_src_root):
        print(f"Error: Frontend source directory '{frontend_src_root}' not found.")
        sys.exit(1)

    print("Crawl started: Scanning frontend components and libraries...")
    for root, _, files in os.walk(frontend_src_root):
        for f in files:
            if f.endswith(('.ts', '.tsx')):
                p = os.path.join(root, f)
                total_files += 1
                
                analyzer = FrontendModuleAnalyzer(p)
                analyzer.analyze()

                # Accumulate counts
                total_components += len(analyzer.components)
                total_helpers += len(analyzer.helpers)
                total_interfaces += len(analyzer.interfaces)
                total_types += len(analyzer.types)
                total_props.update(analyzer.props)
                total_hook_invocations.update(analyzer.hooks_used)
                total_env_variables.update(analyzer.env_vars)
                total_events.update(analyzer.events_used)
                total_errors.update(analyzer.errors_used)
                total_exports.update(analyzer.exports_used)
                total_routes.update(analyzer.route_paths)

                if analyzer.components or analyzer.helpers or analyzer.interfaces or analyzer.types:
                    file_records.append((p, analyzer))

    # Sort files alphabetically for readable Table of Contents
    file_records.sort(key=lambda x: x[0])

    print("Compiling frontend_architecture_index.md report...")
    # Resolve docs/ path relative to project root via __file__
    _script_dir = os.path.dirname(os.path.abspath(__file__))
    _project_root = os.path.dirname(os.path.dirname(_script_dir))  # backend/folder_management/ -> backend/ -> root
    _output_path = os.path.join(_project_root, "docs", "frontend_architecture_index.md")
    with open(_output_path, 'w', encoding='utf-8') as out:
        out.write('# 🎨 Anime Script Pro — Frontend Architectural Reference Index\n\n')
        out.write('This document is an autogenerated, living index of the frontend React and TypeScript codebase structure, components, state hooks, and design assets.\n\n')
        
        # ─── System Dashboard ───
        out.write('## 📊 Frontend System Dashboard\n\n')
        out.write('| Metric | Count | Details |\n')
        out.write('| :--- | :--- | :--- |\n')
        out.write(f'| **Total Modules (Files)** | `{total_files}` | Frontend workspace modules scanned |\n')
        out.write(f'| **Total React Components** | `{total_components}` | Visual layout and interface elements |\n')
        out.write(f'| **Total Helper Functions** | `{total_helpers}` | Custom logic modules and service runners |\n')
        out.write(f'| **Total TS Interfaces & Types** | `{total_interfaces + total_types}` | Strongly-typed interface data schemas |\n')
        props_links = ", ".join(f"`{prop}`" for prop in sorted(list(total_props)))
        out.write(f'| **Props Blueprints** | `{len(total_props)}` | {props_links} |\n')
        
        hook_links = ", ".join(f"`{h}`" for h in sorted(list(total_hook_invocations)))
        out.write(f'| **React Hooks Bound** | `{len(total_hook_invocations)}` | {hook_links} |\n')
        
        env_links = ", ".join(f"`{ev}`" for ev in sorted(list(total_env_variables)))
        out.write(f'| **Env Variables Read** | `{len(total_env_variables)}` | {env_links} |\n\n')

        event_links = ", ".join(f"`{event}`" for event in sorted(list(total_events)))
        out.write(f'| **Events & Handlers** | `{len(total_events)}` | {event_links} |\n\n')

        error_links = ", ".join(f"`{err}`" for err in sorted(list(total_errors)))
        out.write(f'| **Errors** | `{len(total_errors)}` | {error_links} |\n\n')

        export_links = ", ".join(f"`{item}`" for item in sorted(list(total_exports)))
        out.write(f'| **Exports** | `{len(total_exports)}` | {export_links} |\n\n')

        route_links = ", ".join(f"`{route}`" for route in sorted(list(total_routes)))
        out.write(f'| **Route Paths** | `{len(total_routes)}` | {route_links} |\n\n')

        # ─── Navigation Table of Contents ───
        out.write('### 📂 Navigation Table of Contents\n\n')
        for path, _ in file_records:
            anchor = make_anchor(path)
            out.write(f'- [{path}]({anchor})\n')
        out.write('\n---\n\n')

        # ─── Detailed Module Indices ───
        for path, analyzer in file_records:
            out.write(f'## 📂 {path}\n\n')
            
            # File dependencies
            if analyzer.dependencies:
                dep_links = ", ".join(f"`{dep}`" for dep in sorted(analyzer.dependencies))
                out.write(f'**Local Dependencies**: {dep_links}\n')
            
            # Referenced Env Variables
            if analyzer.env_vars:
                env_links = ", ".join(f"`{ev}`" for ev in sorted(analyzer.env_vars))
                out.write(f'**Environment Variables Referenced**: {env_links}\n')
                
            out.write('\n')

            # Render React Components
            if analyzer.components:
                out.write('### ⚛️ React Components\n')
                for c in analyzer.components:
                    hooks_badge = f" | Hooks: {', '.join(f'`{h}`' for h in c['hooks'])}" if c['hooks'] else ""
                    out.write(f'- **`{c["name"]}`** (Lines {c["start_line"]}-{c["end_line"]}) {c["tag"]}\n')
                    out.write(f'  * **Complexity**: {c["complexity"]}{hooks_badge}\n')
                    out.write(f'  * **Use**: {c["use"]}\n')
                    out.write(f'  * **Output**: {c["output"]}\n')
                out.write('\n')

            # Render Helpers
            if analyzer.helpers:
                out.write('### ⚙️ Module Functions & Helpers\n')
                for h in analyzer.helpers:
                    hooks_badge = f" | Hooks: {', '.join(f'`{h}`' for h in h['hooks'])}" if h['hooks'] else ""
                    out.write(f'- **`{h["name"]}`** (Lines {h["start_line"]}-{h["end_line"]}) {h["tag"]}\n')
                    out.write(f'  * **Complexity**: {h["complexity"]}{hooks_badge}\n')
                    out.write(f'  * **Use**: {h["use"]}\n')
                    out.write(f'  * **Output**: {h["output"]}\n')
                out.write('\n')

            # Render Events / Handlers
            if analyzer.events_used:
                out.write('### 🎛️ Events & Handlers\n')
                for event_name in sorted(analyzer.events_used):
                    out.write(f'- `{event_name}`\n')
                out.write('\n')

            if analyzer.props:
                out.write('### 🧩 Props Blueprints\n')
                for prop_name in sorted(set(analyzer.props)):
                    out.write(f'- `{prop_name}`\n')
                out.write('\n')

            if analyzer.errors_used:
                out.write('### ⚠️ Errors\n')
                for error_name in sorted(analyzer.errors_used):
                    out.write(f'- `{error_name}`\n')
                out.write('\n')

            if analyzer.exports_used:
                out.write('### 📦 Exports\n')
                for export_name in sorted(analyzer.exports_used):
                    out.write(f'- `{export_name}`\n')
                out.write('\n')

            if analyzer.route_paths:
                out.write('### 🧭 Route Paths\n')
                for route_path in sorted(analyzer.route_paths):
                    out.write(f'- `{route_path}`\n')
                out.write('\n')

            # Render TS Blueprints (Interfaces / Types)
            if analyzer.interfaces or analyzer.types:
                out.write('### 🏗️ TypeScript Type Blueprints\n')
                for i in analyzer.interfaces:
                    out.write(f'- `interface {i}`\n')
                for t in analyzer.types:
                    out.write(f'- `type {t}`\n')
                out.write('\n')

            out.write('---\n\n')

    print("Success! frontend_architecture_index.md generated successfully.")

if __name__ == "__main__":
    scan_frontend()
