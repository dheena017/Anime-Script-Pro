import os
import ast
import re
from typing import Any

# ==============================================================================
# 1. DYNAMIC MODEL REGISTRY LOADER
# ==============================================================================
RECOGNIZED_MODELS = set()
try:
    models_init_path = os.path.join("backend", "database", "models", "__init__.py")
    if os.path.exists(models_init_path):
        init_content = open(models_init_path, "r", encoding="utf-8").read()
        init_tree = ast.parse(init_content)
        for node in ast.walk(init_tree):
            if isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name) and target.id == "__all__":
                        if isinstance(node.value, ast.List):
                            for elt in node.value.elts:
                                if isinstance(elt, ast.Constant):
                                    RECOGNIZED_MODELS.add(elt.value)
except Exception:
    pass

# Ensure standard model names exist as a fallback
if not RECOGNIZED_MODELS:
    RECOGNIZED_MODELS = {
        "User", "UserProfile", "UserBalance", "UserSettings", "Todo",
        "Project", "ProductionSession", "Episode", "Scene", "Series",
        "Script", "ScriptVersion", "Storyboard", "ProjectContent", "WorldLore",
        "CastMember", "NarrativeBeat", "ReusableCharacter", "CharacterRelationship",
        "CastManifest", "Template", "MediaAsset", "UserFavorite", "SavedPrompt",
        "PromptLibrary", "Prompt", "GrowthStrategy", "Category", "Tutorial",
        "Notification", "SEOEntry", "HelpCategory", "FAQ", "DocSection",
        "DocArticle", "ScreeningRoomEntry", "CommunityPost", "SiteConfig",
        "EngineConfig", "AITelemetry", "AIModel", "SystemLog", "GenerationLog"
    }

# ==============================================================================
# 2. UTILITY PARSERS & SECURITY AUDITORS
# ==============================================================================

def parse_docstring(docstring: str | None, return_annotation: str | None = None) -> tuple[str, str]:
    """Parse a function's docstring to extract its high-level purpose and return value.

    Args:
        docstring: The raw docstring extracted via ast.get_docstring.
        return_annotation: The source code string of the function's return type hint.

    Returns:
        tuple[str, str]: A pair of strings containing (use_description, output_description).
    """
    use = "No description available."
    output = "Not specified."

    if docstring:
        lines = [line.strip() for line in docstring.strip().split('\n') if line.strip()]
        if lines:
            use = lines[0]
        
        doc_text = docstring.strip()
        # Find "Returns:" or "Yields:" or "Returns" / "Yields" sections
        match = re.search(r'(?:Returns:|Yields:|Returns|Yields)\s*(.*)', doc_text, re.DOTALL | re.IGNORECASE)
        if match:
            ret_block = match.group(1).strip()
            ret_lines = [l.strip() for l in ret_block.split('\n') if l.strip()]
            if ret_lines:
                output = ret_lines[0]
                # Strip prefix typing declarations (e.g. "str: Actual value" -> "Actual value")
                if ':' in output:
                    parts = output.split(':', 1)
                    type_prefix = parts[0].strip().lower()
                    if type_prefix in ('str', 'int', 'dict', 'list', 'bool', 'any', 'streamingresponse', 'generationresponse', 'asyncgenerator', 'tuple', 'float', 'dict[str, str]'):
                        output = parts[1].strip()

    if output == "Not specified." and return_annotation:
        output = f"Returns `{return_annotation}`."

    return use, output


def count_decision_points(node: ast.AST) -> int:
    """Calculate the structural complexity of a block of code by counting branches and loops.

    Args:
        node: The AST node representing the code block.

    Returns:
        int: Number of control flow decision points (branches, loops, exceptions).
    """
    score = 0
    for child in ast.walk(node):
        if isinstance(child, (ast.If, ast.For, ast.While, ast.ExceptHandler, ast.Try)):
            score += 1
        elif isinstance(child, ast.BoolOp):
            score += len(child.values) - 1
    return score


def get_complexity_label(score: int) -> str:
    """Resolve a decision point score into a simple qualitative metric tag.

    Args:
        score: The calculated complexity score.

    Returns:
        str: Qualitative label (Low / Medium / High) accompanied by color indicator.
    """
    if score <= 3:
        return "Low 🟢"
    elif score <= 8:
        return "Medium 🟡"
    else:
        return "High 🔴"


def detect_tags(node: ast.AST) -> list[str]:
    """Inspect the AST block of a function to identify functional capabilities (AI, database ops, etc.).

    Args:
        node: The AST node of the function body.

    Returns:
        list[str]: Tags describing capabilities detected in the function.
    """
    tags = []
    has_db_read = False
    has_db_write = False
    has_ai = False

    for child in ast.walk(node):
        # Database operations
        if isinstance(child, ast.Attribute):
            if child.attr in ('commit', 'add', 'delete', 'flush'):
                has_db_write = True
            elif child.attr in ('execute', 'scalars', 'scalars().first', 'scalars().all', 'select'):
                has_db_read = True
        elif isinstance(child, ast.Name):
            if child.id in ('async_session', 'session', 'select', 'db'):
                has_db_read = True
            # AI Inference calls
            if child.id in ('generate_ai_text', 'stream_ai_text', 'generate_text', 'stream_text', 'generate_image', 'generate_stability_image', 'generate_agent'):
                has_ai = True
        elif isinstance(child, ast.Call):
            if isinstance(child.func, ast.Name) and child.func.id == 'select':
                has_db_read = True

    if has_db_write:
        tags.append("`[Database Write]`")
    elif has_db_read:
        tags.append("`[Database Read]`")
    if has_ai:
        tags.append("`[AI Inference]`")

    return tags


def audit_hardcoded_secrets(node: ast.AST) -> bool:
    """Walks the AST body to check if literal strings are assigned to potential credential variables.

    Args:
        node: The AST node representing the block.

    Returns:
        bool: True if a potential hardcoded credential assignment is found.
    """
    for child in ast.walk(node):
        if isinstance(child, ast.Assign):
            for target in child.targets:
                if isinstance(target, ast.Name):
                    name_lower = target.id.lower()
                    # Check for variable name markers
                    if any(word in name_lower for word in ("key", "secret", "password", "token")):
                        # Verify the assigned value is a non-empty string constant (literal)
                        if isinstance(child.value, ast.Constant) and isinstance(child.value.value, str):
                            val = child.value.value.strip()
                            # Filter out placeholders, dummy credentials, or short strings
                            if len(val) > 8 and not any(ph in val.lower() for ph in ("placeholder", "dummy", "missing", "env", "todo", "secret_key")):
                                return True
    return False


def find_env_vars(node: ast.AST) -> set[str]:
    """Parse a code block to extract environment variable keys read via os.getenv/os.environ.

    Args:
        node: The AST node representing the block.

    Returns:
        set[str]: Set of environment variable name strings.
    """
    env_vars = set()
    for child in ast.walk(node):
        if isinstance(child, ast.Call):
            # Case 1: os.getenv("KEY")
            if isinstance(child.func, ast.Attribute) and child.func.attr == 'getenv':
                if isinstance(child.func.value, ast.Name) and child.func.value.id == 'os':
                    if child.args and isinstance(child.args[0], ast.Constant):
                        env_vars.add(child.args[0].value)
            # Case 2: os.environ.get("KEY")
            elif isinstance(child.func, ast.Attribute) and child.func.attr == 'get':
                val = child.func.value
                if isinstance(val, ast.Attribute) and val.attr == 'environ':
                    if isinstance(val.value, ast.Name) and val.value.id == 'os':
                        if child.args and isinstance(child.args[0], ast.Constant):
                            env_vars.add(child.args[0].value)
        elif isinstance(child, ast.Subscript):
            # Case 3: os.environ["KEY"]
            val = child.value
            if isinstance(val, ast.Attribute) and val.attr == 'environ':
                if isinstance(val.value, ast.Name) and val.value.id == 'os':
                    if isinstance(child.slice, ast.Constant):
                        env_vars.add(child.slice.value)
    return env_vars

def find_logging_statements(node: ast.AST) -> list[dict[str, str]]:
    """Walks the AST body to find any logger calls or prints representing logging telemetry."""
    logs = []
    for child in ast.walk(node):
        if isinstance(child, ast.Call):
            if isinstance(child.func, ast.Attribute) and isinstance(child.func.value, ast.Name) and child.func.value.id == 'logger':
                log_level = child.func.attr
                log_msg = ""
                if child.args:
                    try:
                        log_msg = ast.unparse(child.args[0])
                        if isinstance(child.args[0], ast.Constant) and isinstance(child.args[0].value, str):
                            log_msg = child.args[0].value
                    except Exception:
                        pass
                logs.append({"level": log_level, "message": log_msg})
            elif isinstance(child.func, ast.Name) and child.func.id == 'print':
                log_msg = ""
                if child.args:
                    try:
                        log_msg = ast.unparse(child.args[0])
                        if isinstance(child.args[0], ast.Constant) and isinstance(child.args[0].value, str):
                            log_msg = child.args[0].value
                    except Exception:
                        pass
                logs.append({"level": "print", "message": log_msg})
    return logs


def find_function_calls(node: ast.AST) -> list[str]:
    """Walks the AST to find all custom or internal utility function calls."""
    calls = set()
    for child in ast.walk(node):
        if isinstance(child, ast.Call):
            if isinstance(child.func, ast.Name):
                calls.add(child.func.id)
            elif isinstance(child.func, ast.Attribute):
                calls.add(child.func.attr)
    
    interesting_calls = []
    for c in calls:
        if c.islower() or c.startswith('_'):
            if c not in ('print', 'str', 'int', 'dict', 'list', 'set', 'len', 'range', 'isinstance', 'getattr', 'setattr', 'hasattr', 'any', 'all', 'sum', 'min', 'max', 'open', 'close', 'read', 'write', 'join', 'exists', 'replace', 'startswith', 'endswith', 'lower', 'upper', 'split', 'strip', 'append', 'extend', 'add', 'get', 'post', 'put', 'delete', 'commit', 'scalars', 'execute'):
                interesting_calls.append(c)
    return sorted(interesting_calls)


class ProjectParser(ast.NodeVisitor):
    """AST visitor that walks all statements in a module recursively to map classes, functions, and nested closures."""

    def __init__(self, file_path: str, tree: ast.Module) -> None:
        self.file_path = file_path
        self.classes: list[dict[str, Any]] = []
        self.functions: list[dict[str, Any]] = []
        self.dependencies: set[str] = set()
        self.env_vars_referenced: set[str] = find_env_vars(tree)
        self.current_class: dict[str, Any] | None = None
        self.function_stack: list[str] = []
        self.router_prefix = ""

        # Scan module body to find any APIRouter prefix assignments
        for node in tree.body:
            if isinstance(node, ast.Assign):
                is_router_target = False
                for target in node.targets:
                    if isinstance(target, ast.Name) and target.id == 'router':
                        is_router_target = True
                if is_router_target and isinstance(node.value, ast.Call):
                    if isinstance(node.value.func, ast.Name) and node.value.func.id == 'APIRouter':
                        for kw in node.value.keywords:
                            if kw.arg == 'prefix':
                                if isinstance(kw.value, ast.Constant):
                                    self.router_prefix = kw.value.value

    def visit_Import(self, node: ast.Import) -> None:
        for alias in node.names:
            if alias.name.startswith("backend.") or alias.name == "backend":
                self.dependencies.add(alias.name)
        self.generic_visit(node)

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        if node.module and (node.module.startswith("backend") or node.module == "backend"):
            self.dependencies.add(node.module)
        self.generic_visit(node)

    def visit_ClassDef(self, node: ast.ClassDef) -> None:
        class_doc = ast.get_docstring(node)
        class_use = class_doc.strip().split('\n')[0].strip() if class_doc else "No class description available."
        
        # Extract SQLModel relationship mappings & standard fields
        relationships = []
        fields = []
        for body_item in node.body:
            if isinstance(body_item, ast.AnnAssign):
                field_name = body_item.target.id if isinstance(body_item.target, ast.Name) else ""
                field_type = ast.unparse(body_item.annotation)
                
                is_relationship = False
                if body_item.value and isinstance(body_item.value, ast.Call):
                    if isinstance(body_item.value.func, ast.Name) and body_item.value.func.id == 'Relationship':
                        rel_type = field_type
                        relationships.append({"field": field_name, "type": rel_type})
                        is_relationship = True
                
                # Check for standard Fields
                field_default = None
                primary_key = False
                index = False
                unique = False
                nullable = True
                foreign_key = None
                
                if body_item.value and isinstance(body_item.value, ast.Call) and not is_relationship:
                    if isinstance(body_item.value.func, ast.Name) and body_item.value.func.id == 'Field':
                        for kw in body_item.value.keywords:
                            if kw.arg == 'default':
                                field_default = ast.unparse(kw.value)
                            elif kw.arg == 'default_factory':
                                field_default = f"factory({ast.unparse(kw.value)})"
                            elif kw.arg == 'primary_key':
                                if isinstance(kw.value, ast.Constant):
                                    primary_key = bool(kw.value.value)
                            elif kw.arg == 'index':
                                if isinstance(kw.value, ast.Constant):
                                    index = bool(kw.value.value)
                            elif kw.arg == 'unique':
                                if isinstance(kw.value, ast.Constant):
                                    unique = bool(kw.value.value)
                            elif kw.arg == 'nullable':
                                if isinstance(kw.value, ast.Constant):
                                    nullable = bool(kw.value.value)
                            elif kw.arg == 'foreign_key':
                                foreign_key = ast.unparse(kw.value)
                
                if field_name and not is_relationship:
                    fields.append({
                        "name": field_name,
                        "type": field_type,
                        "default": field_default,
                        "primary_key": primary_key,
                        "index": index,
                        "unique": unique,
                        "nullable": nullable,
                        "foreign_key": foreign_key
                    })

        class_info = {
            "name": node.name,
            "lineno": node.lineno,
            "end_lineno": node.end_lineno,
            "use": class_use,
            "relationships": relationships,
            "fields": fields,
            "methods": []
        }
        self.classes.append(class_info)
        
        # Traverse class statement body block to parse methods and inner definitions
        prev_class = self.current_class
        self.current_class = class_info
        self.generic_visit(node)
        self.current_class = prev_class

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        self._handle_function(node, is_async=False)

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> None:
        self._handle_function(node, is_async=True)

    def _handle_function(self, node: ast.FunctionDef | ast.AsyncFunctionDef, is_async: bool) -> None:
        # Check for API route decorators, path variables, and response schemas
        endpoint_info = None
        response_schema = None
        is_protected = False
        path = ""

        for decorator in node.decorator_list:
            if isinstance(decorator, ast.Call):
                dec_func = decorator.func
                # Identify router / app FastAPI decorator calls
                if isinstance(dec_func, ast.Attribute) and dec_func.attr in ('get', 'post', 'put', 'delete', 'patch', 'websocket'):
                    if isinstance(dec_func.value, ast.Name) and dec_func.value.id in ('router', 'app'):
                        verb = dec_func.attr.upper()
                        if decorator.args and isinstance(decorator.args[0], ast.Constant):
                            path = decorator.args[0].value
                        
                        # Prepend the router prefix if available to show full routing path
                        # Safe joining of router_prefix and path
                        prefix = self.router_prefix.rstrip("/")
                        route_path = path.lstrip("/")
                        full_path = f"{prefix}/{route_path}" if prefix or route_path else "/"
                        if not full_path.startswith("/"):
                            full_path = "/" + full_path
                        endpoint_info = f"**{verb} `{full_path}`**" if full_path else f"**{verb}**"

                        # Extract response_model schema
                        for kw in decorator.keywords:
                            if kw.arg == 'response_model':
                                try:
                                    response_schema = ast.unparse(kw.value)
                                except Exception:
                                    pass

        # Construct argument signature string, extract Query params & Request payloads
        args_list = []
        request_schema = None
        query_params = []
        path_params = re.findall(r'\{([a-zA-Z0-9_]+)\}', path) if path else []

        for arg in node.args.args:
            arg_str = arg.arg
            if arg.annotation:
                try:
                    anno_str = ast.unparse(arg.annotation)
                    arg_str += f": {anno_str}"
                    
                    # Match parameter camel-case names as potential Pydantic schemas (excluding defaults)
                    if arg.arg not in ('self', 'request', 'user_id', 'db', 'session', 'background_tasks') and re.match(r'^[A-Z][a-zA-Z0-9_]+$', anno_str):
                        request_schema = anno_str

                    # Check if query parameter (not in path, not special injection dependencies)
                    if endpoint_info and arg.arg not in ('self', 'request', 'user_id', 'db', 'session', 'background_tasks') and arg.arg not in path_params:
                        if not any(sp in anno_str for sp in ("AsyncSession", "Request", "WebSocket", "Depends", "get_auth_user_id", "get_current_user")):
                            query_params.append(f"`{arg.arg}` ({anno_str})")
                except Exception:
                    pass
            args_list.append(arg_str)
        
        # Parse vararg (*args)
        if node.args.vararg:
            vararg_str = f"*{node.args.vararg.arg}"
            if node.args.vararg.annotation:
                try:
                    vararg_str += f": {ast.unparse(node.args.vararg.annotation)}"
                except Exception:
                    pass
            args_list.append(vararg_str)

        # Parse kwarg (**kwargs)
        if node.args.kwarg:
            kwarg_str = f"**{node.args.kwarg.arg}"
            if node.args.kwarg.annotation:
                try:
                    kwarg_str += f": {ast.unparse(node.args.kwarg.annotation)}"
                except Exception:
                    pass
            args_list.append(kwarg_str)

        sig = f"({', '.join(args_list)})"

        # Check if auth dependency is in parameters
        for arg in node.args.args:
            if arg.annotation:
                try:
                    annotation_code = ast.unparse(arg.annotation)
                    if "get_auth_user_id" in annotation_code or "get_current_user" in annotation_code:
                        is_protected = True
                except Exception:
                    pass

        # Add auth tag to endpoints
        access_badge = ""
        if endpoint_info:
            access_badge = " `[Protected] 🔒`" if is_protected else " `[Public] 🔓`"

        ret_anno = None
        if node.returns:
            try:
                ret_anno = ast.unparse(node.returns)
            except Exception:
                pass

        doc = ast.get_docstring(node)
        use, output = parse_docstring(doc, ret_anno)

        # Calculate structural complexity & parse capability tags
        complexity_score = count_decision_points(node)
        complexity_label = get_complexity_label(complexity_score)
        capability_tags = detect_tags(node)

        # Add security warning if hardcoded credentials are found
        if audit_hardcoded_secrets(node):
            capability_tags.append("`[Security Alert: Hardcoded Secret!] ⚠️`")

        # Discover which SQLModels are referenced inside function body
        models_referenced = set()
        for child in ast.walk(node):
            if isinstance(child, ast.Name) and child.id in RECOGNIZED_MODELS:
                models_referenced.add(child.id)

        # Build fully qualified name representing nested hierarchies
        func_name = node.name
        if self.function_stack:
            func_name = f"{' ➜ '.join(self.function_stack)} ➜ {func_name}"

        # Find env variables read inside this function
        func_env_vars = find_env_vars(node)

        func_info = {
            "name": func_name,
            "lineno": node.lineno,
            "end_lineno": node.end_lineno,
            "is_async": is_async,
            "signature": sig,
            "endpoint": endpoint_info,
            "access_badge": access_badge,
            "request_schema": request_schema,
            "response_schema": response_schema,
            "query_params": query_params,
            "models_referenced": sorted(list(models_referenced)),
            "env_vars": sorted(list(func_env_vars)),
            "use": use,
            "output": output,
            "complexity": complexity_label,
            "tags": capability_tags,
            "logging_calls": find_logging_statements(node),
            "function_calls": find_function_calls(node)
        }

        if self.current_class:
            self.current_class["methods"].append(func_info)
        else:
            self.functions.append(func_info)

        # Recurse inside the function definition block to parse nested helper functions / closures
        self.function_stack.append(node.name)
        self.generic_visit(node)
        self.function_stack.pop()

# ==============================================================================
# 4. REPORT COMPILER & WRITER
# ==============================================================================

def make_anchor(file_path: str) -> str:
    """Generate a valid HTML anchor suffix based on the file path.

    Args:
        file_path: The file path to convert.

    Returns:
        str: Anchor identifier for markdown indexing.
    """
    clean = file_path.lower().replace('.', '').replace('\\', '').replace('/', '').replace(' ', '-')
    return f"#-📂-{clean}"


def extract_functions() -> None:
    """Scan the workspace, parse all Python files recursively, and generate a documented reference index."""
    file_records = []
    
    # ─── Statistics Counters ───
    total_files = 0
    total_endpoints = 0
    total_classes = 0
    total_functions = 0
    endpoint_verbs = {"GET": 0, "POST": 0, "PUT": 0, "DELETE": 0, "WEBSOCKET": 0}

    # 1. Walk repository and build file metadata in memory
    for r, d, fs in os.walk('.'):
        if 'venv' in r or '.git' in r or '__pycache__' in r or 'logs' in r:
            continue
        for f in fs:
            if f.endswith('.py'):
                p = os.path.join(r, f)
                total_files += 1
                try:
                    content = open(p, 'r', encoding='utf-8').read()
                    tree = ast.parse(content)
                    
                    parser = ProjectParser(p, tree)
                    parser.visit(tree)
                    
                    if parser.classes or parser.functions:
                        file_records.append((p, parser))
                        total_classes += len(parser.classes)
                        
                        # Accumulate function stats
                        for func in parser.functions:
                            total_functions += 1
                            if func["endpoint"]:
                                total_endpoints += 1
                                # Match standard HTTP verb prefixes in endpoint info
                                for verb in endpoint_verbs.keys():
                                    if verb in func["endpoint"]:
                                        endpoint_verbs[verb] += 1
                        
                        # Accumulate method stats
                        for cls in parser.classes:
                            total_functions += len(cls["methods"])

                except Exception as e:
                    file_records.append((p, e))

    # 2. Write Markdown Output — resolve docs/ path relative to project root
    _script_dir = os.path.dirname(os.path.abspath(__file__))
    _project_root = os.path.dirname(os.path.dirname(_script_dir))  # backend/folder_management/ -> backend/ -> root
    _output_path = os.path.join(_project_root, "docs", "backend_architecture_index.md")
    with open(_output_path, 'w', encoding='utf-8') as out:
        out.write('# 🧠 Anime Script Pro — Backend Architectural Reference Index\n\n')
        out.write('This document is an autogenerated, living index of the codebase structural design, classes, routes, complexity metrics, and capability mappings.\n\n')
        
        # ─── Architectural Dashboard ───
        out.write('## 📊 System Overview Dashboard\n\n')
        out.write('| Metric | Count | Details |\n')
        out.write('| :--- | :--- | :--- |\n')
        out.write(f'| **Total Modules (Files)** | `{total_files}` | Python codebase files processed |\n')
        out.write(f'| **Total Classes** | `{total_classes}` | Object blueprints defined |\n')
        out.write(f'| **Total Endpoints** | `{total_endpoints}` | Integrated FastAPI API routes |\n')
        out.write(f'| **Total Methods & Functions** | `{total_functions}` | Execution closures parsed |\n')
        
        verbs_breakdown = ", ".join(f"`{k}: {v}`" for k, v in endpoint_verbs.items())
        out.write(f'| **API Verb Breakdown** | - | {verbs_breakdown} |\n\n')

        # ─── Navigation Table of Contents ───
        out.write('### 📂 Navigation Table of Contents\n\n')
        for rec in file_records:
            path = rec[0]
            anchor = make_anchor(path)
            out.write(f'- [{path}]({anchor})\n')
        out.write('\n---\n\n')

        # 3. Generate detailed logs for each parsed file
        for rec in file_records:
            p = rec[0]
            parser = rec[1]
            
            if isinstance(parser, Exception):
                out.write(f'## 📂 {p}\n')
                out.write(f'- ⚠️ *Error parsing file: {parser}*\n\n---\n\n')
                continue
                
            out.write(f'## 📂 {p}\n\n')
            
            # Show file dependencies
            if parser.dependencies:
                dep_links = ", ".join(f"`{dep}`" for dep in sorted(parser.dependencies))
                out.write(f'**Local Dependencies**: {dep_links}\n')
            
            # Show environment variables referenced in this file
            if parser.env_vars_referenced:
                env_links = ", ".join(f"`{env}`" for env in sorted(parser.env_vars_referenced))
                out.write(f'**Environment Variables**: {env_links}\n')
                
            out.write('\n')

            # Write API Endpoints
            endpoints = [func for func in parser.functions if func["endpoint"]]
            if endpoints:
                out.write('### 🌐 Endpoints\n')
                for ep in endpoints:
                    async_tag = " `[Async]`" if ep["is_async"] else ""
                    tag_list = " " + " ".join(ep["tags"]) if ep["tags"] else ""
                    out.write(f'- {ep["endpoint"]} ➜ `{ep["name"]}`{async_tag}{ep["access_badge"]} (Lines {ep["lineno"]}-{ep["end_lineno"]}){tag_list}\n')
                    out.write(f'  * **Signature**: `{ep["signature"]}`\n')
                    out.write(f'  * **Complexity**: {ep["complexity"]}\n')
                    
                    # Query Parameter details
                    if ep["query_params"]:
                        q_params_str = ", ".join(ep["query_params"])
                        out.write(f'  * **Query Parameters**: {q_params_str}\n')
                    
                    # Schema details
                    if ep["request_schema"]:
                        out.write(f'  * **Request Payload**: `{ep["request_schema"]}`\n')
                    if ep["response_schema"]:
                        out.write(f'  * **Response Model**: `{ep["response_schema"]}`\n')
                        
                    # SQLModels details
                    if ep["models_referenced"]:
                        models_str = ", ".join(f"`{m}`" for m in ep["models_referenced"])
                        out.write(f'  * **Database Models Touched**: {models_str}\n')
                        
                    # Environmental configuration reads in this route
                    if ep["env_vars"]:
                        env_str = ", ".join(f"`{e}`" for e in ep["env_vars"])
                        out.write(f'  * **Env Variables Read**: {env_str}\n')
                        
                    out.write(f'  * **Use**: {ep["use"]}\n')
                    out.write(f'  * **Output**: {ep["output"]}\n')
                out.write('\n')

            # Write Helper/Module Functions
            module_funcs = [func for func in parser.functions if not func["endpoint"]]
            if module_funcs:
                out.write('### ⚙️ Module Functions & Helpers\n')
                for mf in module_funcs:
                    async_tag = " `[Async]`" if mf["is_async"] else ""
                    tag_list = " " + " ".join(mf["tags"]) if mf["tags"] else ""
                    out.write(f'- `{mf["name"]}`{async_tag} (Lines {mf["lineno"]}-{mf["end_lineno"]}){tag_list}\n')
                    out.write(f'  * **Signature**: `{mf["signature"]}`\n')
                    out.write(f'  * **Complexity**: {mf["complexity"]}\n')
                    
                    if mf["models_referenced"]:
                        models_str = ", ".join(f"`{m}`" for m in mf["models_referenced"])
                        out.write(f'  * **Database Models Touched**: {models_str}\n')
                        
                    if mf["env_vars"]:
                        env_str = ", ".join(f"`{e}`" for e in mf["env_vars"])
                        out.write(f'  * **Env Variables Read**: {env_str}\n')
                        
                    out.write(f'  * **Use**: {mf["use"]}\n')
                    out.write(f'  * **Output**: {mf["output"]}\n')
                out.write('\n')

            # Write Classes
            if parser.classes:
                out.write('### 🏗️ Classes\n')
                for cls in parser.classes:
                    out.write(f'#### `class {cls["name"]}` (Lines {cls["lineno"]}-{cls["end_lineno"]})\n')
                    out.write(f'> *{cls["use"]}*\n\n')
                    
                    if cls["relationships"]:
                        rel_str = ", ".join(cls["relationships"])
                        out.write(f'* **SQLModel Relationships**: {rel_str}\n\n')
                        
                    if cls["methods"]:
                        for m in cls["methods"]:
                            async_tag = " `[Async]`" if m["is_async"] else ""
                            tag_list = " " + " ".join(m["tags"]) if m["tags"] else ""
                            out.write(f'  - `{m["name"]}`{async_tag} (Lines {m["lineno"]}-{m["end_lineno"]}){tag_list}\n')
                            out.write(f'    * **Signature**: `{m["signature"]}`\n')
                            out.write(f'    * **Complexity**: {m["complexity"]}\n')
                            
                            if m["models_referenced"]:
                                models_str = ", ".join(f"`{m}`" for m in m["models_referenced"])
                                out.write(f'    * **Database Models Touched**: {models_str}\n')
                                
                            if m["env_vars"]:
                                env_str = ", ".join(f"`{e}`" for e in m["env_vars"])
                                out.write(f'    * **Env Variables Read**: {env_str}\n')
                                
                            out.write(f'    * **Use**: {m["use"]}\n')
                            out.write(f'    * **Output**: {m["output"]}\n')
                    out.write('\n')

            out.write('---\n\n')

if __name__ == "__main__":
    extract_functions()
