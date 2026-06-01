import os
import re
import ast
import json
import sys
from typing import Any, Dict, List, Set, Tuple

# ==============================================================================
# 1. AST BACKEND SCANNER (Derived from scan_backend_index.py)
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

def parse_docstring(docstring: str | None, return_annotation: str | None = None) -> tuple[str, str]:
    use = "No description available."
    output = "Not specified."
    if docstring:
        lines = [line.strip() for line in docstring.strip().split('\n') if line.strip()]
        if lines:
            use = lines[0]
        doc_text = docstring.strip()
        match = re.search(r'(?:Returns:|Yields:|Returns|Yields)\s*(.*)', doc_text, re.DOTALL | re.IGNORECASE)
        if match:
            ret_block = match.group(1).strip()
            ret_lines = [l.strip() for l in ret_block.split('\n') if l.strip()]
            if ret_lines:
                output = ret_lines[0]
                if ':' in output:
                    parts = output.split(':', 1)
                    type_prefix = parts[0].strip().lower()
                    if type_prefix in ('str', 'int', 'dict', 'list', 'bool', 'any', 'streamingresponse', 'generationresponse', 'asyncgenerator', 'tuple', 'float'):
                        output = parts[1].strip()
    if output == "Not specified." and return_annotation:
        output = f"Returns `{return_annotation}`."
    return use, output

def build_class_description(name: str, fields: List[Dict[str, Any]], relationships: List[Dict[str, Any]], class_doc: str | None) -> str:
    if class_doc:
        lines = [line.strip() for line in class_doc.strip().split('\n') if line.strip()]
        if lines:
            return lines[0]

    field_names = [field.get("name", "") for field in fields if field.get("name")]
    parts = [f"Data model {name}"]
    if field_names:
        preview = ", ".join(field_names[:4])
        suffix = "" if len(field_names) <= 4 else f" and {len(field_names) - 4} more fields"
        parts.append(f"with fields {preview}{suffix}")
    if relationships:
        parts.append(f"linked through {len(relationships)} relationship(s)")
    return " ".join(parts) + "."


def build_backend_description(
    name: str,
    endpoint_info: str | None,
    verb: str,
    request_schema: str | None,
    response_schema: str | None,
    query_params: List[Dict[str, Any]],
    models_referenced: Set[str],
    env_vars: Set[str],
    capability_tags: List[str],
) -> str:
    def preview(values: List[str], limit: int = 4) -> str:
        visible = values[:limit]
        if not visible:
            return ""
        suffix = f" +{len(values) - limit} more" if len(values) > limit else ""
        return f"{', '.join(visible)}{suffix}"

    if endpoint_info:
        route_bits = [f"{verb} endpoint {endpoint_info}".strip()]
    else:
        route_bits = [f"Backend helper {name}"]

    details: List[str] = []
    if request_schema:
        details.append(f"accepts {request_schema}")
    if response_schema:
        details.append(f"returns {response_schema}")
    if query_params:
        param_names = ", ".join(param.get("name", "") for param in query_params if param.get("name"))
        if param_names:
            details.append(f"uses query params {param_names}")
    if models_referenced:
        details.append(f"touches models {preview(sorted(models_referenced))}")
    if env_vars:
        details.append(f"reads env vars {preview(sorted(env_vars))}")

    capability_labels = [tag.strip("`") for tag in capability_tags]
    if capability_labels:
        details.append(f"flags {', '.join(capability_labels)}")

    if details:
        return f"{route_bits[0]} that {', '.join(details)}."
    return f"{route_bits[0]} in the backend codebase."

def count_decision_points(node: ast.AST) -> int:
    score = 0
    for child in ast.walk(node):
        if isinstance(child, (ast.If, ast.For, ast.While, ast.ExceptHandler, ast.Try)):
            score += 1
        elif isinstance(child, ast.BoolOp):
            score += len(child.values) - 1
    return score

def get_complexity_label(score: int) -> str:
    if score <= 3:
        return "Low 🟢"
    elif score <= 8:
        return "Medium 🟡"
    else:
        return "High 🔴"

def detect_tags(node: ast.AST) -> list[str]:
    tags = []
    has_db_read, has_db_write, has_ai = False, False, False
    for child in ast.walk(node):
        if isinstance(child, ast.Attribute):
            if child.attr in ('commit', 'add', 'delete', 'flush'):
                has_db_write = True
            elif child.attr in ('execute', 'scalars', 'select'):
                has_db_read = True
        elif isinstance(child, ast.Name):
            if child.id in ('async_session', 'session', 'select', 'db'):
                has_db_read = True
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

def find_env_vars(node: ast.AST) -> set[str]:
    env_vars = set()
    for child in ast.walk(node):
        if isinstance(child, ast.Call):
            if isinstance(child.func, ast.Attribute) and child.func.attr == 'getenv':
                if isinstance(child.func.value, ast.Name) and child.func.value.id == 'os':
                    if child.args and isinstance(child.args[0], ast.Constant):
                        env_vars.add(child.args[0].value)
            elif isinstance(child.func, ast.Attribute) and child.func.attr == 'get':
                val = child.func.value
                if isinstance(val, ast.Attribute) and val.attr == 'environ':
                    if isinstance(val.value, ast.Name) and val.value.id == 'os':
                        if child.args and isinstance(child.args[0], ast.Constant):
                            env_vars.add(child.args[0].value)
        elif isinstance(child, ast.Subscript):
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
    def __init__(self, file_path: str, tree: ast.Module) -> None:
        self.file_path = file_path
        self.classes: list[dict[str, Any]] = []
        self.functions: list[dict[str, Any]] = []
        self.dependencies: set[str] = set()
        self.env_vars_referenced: set[str] = find_env_vars(tree)
        self.current_class: dict[str, Any] | None = None
        self.function_stack: list[str] = []
        self.router_prefix = ""

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
        
        relationships = []
        fields = []
        
        # Extract SQLModel fields & relationship mappings
        for body_item in node.body:
            if isinstance(body_item, ast.AnnAssign):
                field_name = body_item.target.id if isinstance(body_item.target, ast.Name) else ""
                field_type = ast.unparse(body_item.annotation)
                
                # Check for Relationship mappings
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
            "use": build_class_description(node.name, fields, relationships, class_doc),
            "relationships": relationships,
            "fields": fields,
            "methods": []
        }
        self.classes.append(class_info)
        
        prev_class = self.current_class
        self.current_class = class_info
        self.generic_visit(node)
        self.current_class = prev_class

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        self._handle_function(node, is_async=False)

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> None:
        self._handle_function(node, is_async=True)

    def _handle_function(self, node: ast.FunctionDef | ast.AsyncFunctionDef, is_async: bool) -> None:
        endpoint_info = None
        response_schema = None
        is_protected = False
        path = ""
        verb = ""

        for decorator in node.decorator_list:
            if isinstance(decorator, ast.Call):
                dec_func = decorator.func
                if isinstance(dec_func, ast.Attribute) and dec_func.attr in ('get', 'post', 'put', 'delete', 'patch', 'websocket'):
                    if isinstance(dec_func.value, ast.Name) and dec_func.value.id in ('router', 'app'):
                        verb = dec_func.attr.upper()
                        if decorator.args and isinstance(decorator.args[0], ast.Constant):
                            path = decorator.args[0].value
                        
                        # Safe joining of router_prefix and path
                        prefix = self.router_prefix.rstrip("/")
                        route_path = path.lstrip("/")
                        full_path = f"{prefix}/{route_path}" if prefix or route_path else "/"
                        if not full_path.startswith("/"):
                            full_path = "/" + full_path
                        endpoint_info = full_path

                        for kw in decorator.keywords:
                            if kw.arg == 'response_model':
                                try:
                                    response_schema = ast.unparse(kw.value)
                                except Exception:
                                    pass

        args_list = []
        request_schema = None
        query_params = []
        path_params = re.findall(r'\{([a-zA-Z0-9_]+)\}', path) if path else []

        for arg in node.args.args:
            arg_name = arg.arg
            arg_type = "Any"
            if arg.annotation:
                try:
                    arg_type = ast.unparse(arg.annotation)
                    if arg_name not in ('self', 'request', 'user_id', 'db', 'session', 'background_tasks') and re.match(r'^[A-Z][a-zA-Z0-9_]+$', arg_type):
                        request_schema = arg_type

                    if endpoint_info and arg_name not in ('self', 'request', 'user_id', 'db', 'session', 'background_tasks') and arg_name not in path_params:
                        if not any(sp in arg_type for sp in ("AsyncSession", "Request", "WebSocket", "Depends", "get_auth_user_id", "get_current_user")):
                            query_params.append({"name": arg_name, "type": arg_type})
                except Exception:
                    pass
            args_list.append(f"{arg_name}: {arg_type}")

        for arg in node.args.args:
            if arg.annotation:
                try:
                    annotation_code = ast.unparse(arg.annotation)
                    if "get_auth_user_id" in annotation_code or "get_current_user" in annotation_code:
                        is_protected = True
                except Exception:
                    pass

        ret_anno = None
        if node.returns:
            try:
                ret_anno = ast.unparse(node.returns)
            except Exception:
                pass

        doc = ast.get_docstring(node)
        use, output = parse_docstring(doc, ret_anno)

        complexity_score = count_decision_points(node)
        complexity_label = get_complexity_label(complexity_score)
        capability_tags = detect_tags(node)

        models_referenced = set()
        for child in ast.walk(node):
            if isinstance(child, ast.Name) and child.id in RECOGNIZED_MODELS:
                models_referenced.add(child.id)

        func_name = node.name
        if self.function_stack:
            func_name = f"{' ➜ '.join(self.function_stack)} ➜ {func_name}"

        func_env_vars = find_env_vars(node)
        resolved_use = build_backend_description(
            func_name,
            endpoint_info,
            verb,
            request_schema,
            response_schema,
            query_params,
            models_referenced,
            func_env_vars,
            capability_tags,
        )

        func_info = {
            "name": func_name,
            "lineno": node.lineno,
            "end_lineno": node.end_lineno,
            "is_async": is_async,
            "signature": f"({', '.join(args_list)})",
            "endpoint": endpoint_info,
            "verb": verb,
            "is_protected": is_protected,
            "request_schema": request_schema,
            "response_schema": response_schema,
            "query_params": query_params,
            "models_referenced": sorted(list(models_referenced)),
            "env_vars": sorted(list(func_env_vars)),
            "use": resolved_use,
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

        self.function_stack.append(node.name)
        self.generic_visit(node)
        self.function_stack.pop()

# ==============================================================================
# 2. JS / TS FRONTEND SCANNER (Derived from scan_frontend_index.py)
# ==============================================================================

JSDOC_RE = re.compile(r'/\*\*(.*?)\*/', re.DOTALL)
ARROW_COMPONENT_RE = re.compile(r'(?:export\s+)?(?:default\s+)?(?:const|let)\s+([A-Z][a-zA-Z0-9_]*)\s*(?::\s*[^=]+)?\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>', re.MULTILINE)
FUNCTION_COMPONENT_RE = re.compile(r'(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([A-Z][a-zA-Z0-9_]*)\b', re.MULTILINE)
ARROW_HELPER_RE = re.compile(r'(?:export\s+)?(?:const|let)\s+([a-z][a-zA-Z0-9_]*)\s*(?::\s*[^=]+)?\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>', re.MULTILINE)
FUNCTION_HELPER_RE = re.compile(r'(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([a-z][a-zA-Z0-9_]*)\b', re.MULTILINE)
INTERFACE_RE = re.compile(r'(?:export\s+)?interface\s+([A-Za-z0-9_]+)\b', re.MULTILINE)
TYPE_RE = re.compile(r'(?:export\s+)?type\s+([A-Za-z0-9_]+)\b', re.MULTILINE)
HOOK_RE = re.compile(r'\b(use[A-Z_][a-zA-Z0-9_]*|useState|useEffect|useContext|useReducer|useMemo|useCallback|useRef)\b')
FRONTEND_EVENT_RE = re.compile(r'\b(on[A-Z][a-zA-Z0-9_]*|handle[A-Z][a-zA-Z0-9_]*|addEventListener|removeEventListener|dispatchEvent|preventDefault|stopPropagation)\b')
FRONTEND_STYLE_RE = re.compile(r'\b(className|style=|styled\(|css`|sx=|tailwind|theme|variant|tw-)\b', re.IGNORECASE)
FRONTEND_ERROR_RE = re.compile(r'\b(try|catch|throw|Error|error|console\.error|setError|isError|hasError|onError)\b')
ENV_VAR_RE = re.compile(r'\b(?:import\.meta\.env|process\.env)\.([A-Za-z0-9_]+)\b')
IMPORT_RE = re.compile(r'\bimport\s+.*?\s+from\s+[\'"]([^\'"]+)[\'"]', re.DOTALL)

def parse_frontend_jsdoc(content: str, pos: int) -> Tuple[str, str]:
    use = "No description available."
    output = "Not specified."
    raw = ""
    scan_chunk = content[max(0, pos - 800):pos]
    matches = list(JSDOC_RE.finditer(scan_chunk))
    if matches:
        doc_text = matches[-1].group(1).strip()
        raw = doc_text
        lines = []
        for line in doc_text.split('\n'):
            line_clean = line.strip().lstrip('*').strip()
            if line_clean and not line_clean.startswith('@'):
                lines.append(line_clean)
        if lines:
            use = " ".join(lines)
        ret_match = re.search(r'@returns?\s+(.*)', doc_text, re.IGNORECASE)
        if ret_match:
            output = ret_match.group(1).strip()
    return use, output, raw


def build_frontend_description(
    name: str,
    kind: str,
    use: str,
    hooks: Set[str],
    props_list: List[str],
    local_states: List[str],
    contexts_used: List[str],
    api_calls: List[str],
    child_components: List[str],
) -> str:
    if use and use != "No description available.":
        return use

    parts: List[str] = []
    if kind == "Component":
        parts.append(f"UI component {name}")
    elif kind == "Helper":
        parts.append(f"Utility helper {name}")
    else:
        parts.append(f"{kind} {name}")

    capabilities: List[str] = []
    def preview(values: List[str], limit: int = 4) -> str:
        visible = values[:limit]
        if not visible:
            return ""
        suffix = f" +{len(values) - limit} more" if len(values) > limit else ""
        return f"{', '.join(visible)}{suffix}"

    if props_list:
        capabilities.append(f"accepts props {preview(props_list)}")
    if hooks:
        capabilities.append(f"uses hooks {preview(sorted(hooks))}")
    if local_states:
        capabilities.append(f"manages state {preview(local_states)}")
    if contexts_used:
        capabilities.append(f"reads contexts {preview(contexts_used)}")
    if api_calls:
        capabilities.append(f"calls APIs {preview(api_calls)}")
    if child_components:
        capabilities.append(f"composes {preview(child_components)}")

    if capabilities:
        return f"{parts[0]} that {', '.join(capabilities)}."

    return f"{parts[0]} detected in the frontend codebase."

def extract_frontend_line_range(content: str, pos: int) -> Tuple[int, int]:
    pre = content[:pos]
    start_line = pre.count('\n') + 1
    brace_start = content.find('{', pos)
    if brace_start == -1 or brace_start - pos > 200:
        return start_line, start_line
    brace_count = 1
    end_pos = brace_start + 1
    length = len(content)
    while brace_count > 0 and end_pos < length:
        c = content[end_pos]
        if c == '{':
            brace_count += 1
        elif c == '}':
            brace_count -= 1
        end_pos += 1
    post = content[:end_pos]
    end_line = post.count('\n') + 1
    return start_line, end_line

def get_frontend_complexity(line_count: int, hook_count: int) -> str:
    score = (line_count // 20) + (hook_count * 2)
    if score <= 4:
        return "Low 🟢"
    elif score <= 10:
        return "Medium 🟡"
    else:
        return "High 🔴"


def detect_frontend_tags(
    content: str,
    name: str,
    kind: str,
    hooks: Set[str],
    props_list: List[str],
    local_states: List[str],
    contexts_used: List[str],
    api_calls: List[str],
    child_components: List[str],
) -> List[str]:
    tags: List[str] = []

    def add_tag(label: str) -> None:
        if label and label not in tags:
            tags.append(label)

    add_tag(kind)
    if kind == "Component":
        add_tag("UI")

    if hooks:
        add_tag("Hooks")
    if props_list:
        add_tag("Props")
    if local_states:
        add_tag("State")
    if contexts_used:
        add_tag("Context")
    if api_calls:
        add_tag("API")
    if child_components:
        add_tag("Composition")

    search_blob = " ".join([
        content,
        name,
        kind,
        " ".join(hooks),
        " ".join(props_list),
        " ".join(local_states),
        " ".join(contexts_used),
        " ".join(api_calls),
        " ".join(child_components),
    ])

    if FRONTEND_EVENT_RE.search(search_blob):
        add_tag("Events")
    if FRONTEND_STYLE_RE.search(search_blob):
        add_tag("Styles")
    if FRONTEND_ERROR_RE.search(search_blob):
        add_tag("Errors")
    if re.search(r'\b(fetch|axios|api)\b', search_blob, re.IGNORECASE):
        add_tag("Network")

    return tags


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


def extract_frontend_events(body_block: str) -> List[str]:
    events = set()
    for m in FRONTEND_EVENT_RE.finditer(body_block):
        token = m.group(1) if m.groups() else m.group(0)
        if token:
            events.add(token)
    return sorted(list(events))


def extract_frontend_styles(body_block: str) -> List[str]:
    styles = set()
    if FRONTEND_STYLE_RE.search(body_block):
        # Collect a few common style hints
        if re.search(r'className\s*=', body_block):
            styles.add('className')
        if re.search(r'style\s*=', body_block):
            styles.add('inline-style')
        if re.search(r'styled\(', body_block):
            styles.add('styled-component')
        if re.search(r'css`', body_block):
            styles.add('css-template')
        if re.search(r'tw-|tailwind|variant|sx=', body_block, re.IGNORECASE):
            styles.add('tailwind/sx')
    return sorted(list(styles))


def extract_frontend_errors(body_block: str) -> List[str]:
    errs = set()
    for m in FRONTEND_ERROR_RE.finditer(body_block):
        token = m.group(0)
        if token:
            errs.add(token)
    return sorted(list(errs))


def extract_js_function_calls(body_block: str) -> List[str]:
    calls = set()
    for m in re.finditer(r"\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(", body_block):
        name = m.group(1)
        if name and not re.match(r'^(if|for|while|switch|return|function|class|new|console|Math|JSON|Object|Array)$', name):
            calls.add(name)
    # Filter obvious builtins
    builtins = {'require', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'}
    return sorted([c for c in calls if c not in builtins])

class FrontendModuleAnalyzer:
    def __init__(self, file_path: str) -> None:
        self.file_path = file_path
        self.components: List[Dict[str, Any]] = []
        self.helpers: List[Dict[str, Any]] = []
        self.interfaces: List[str] = []
        self.types: List[str] = []
        self.dependencies: Set[str] = set()
        self.env_vars: Set[str] = set()
        self.hooks_used: Set[str] = set()

    def analyze(self) -> None:
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception:
            return

        for m in ENV_VAR_RE.finditer(content):
            self.env_vars.add(m.group(1))
        for m in IMPORT_RE.finditer(content):
            self.dependencies.add(m.group(1))
        for m in INTERFACE_RE.finditer(content):
            self.interfaces.append(m.group(1))
        for m in TYPE_RE.finditer(content):
            self.types.append(m.group(1))

        seen = set()
        def parse_funcs(pattern: re.Pattern, target: List[Dict[str, Any]], tag: str):
            for match in pattern.finditer(content):
                name = match.group(1)
                if name in seen:
                    continue
                seen.add(name)
                start_pos = match.start()
                sl, el = extract_frontend_line_range(content, start_pos)
                lc = el - sl + 1
                use, out_desc, raw_doc = parse_frontend_jsdoc(content, start_pos)
                body = content[start_pos:content.find('}', start_pos) + 1] if '{' in content[start_pos:] else ""
                local_hooks = set(HOOK_RE.findall(body))
                self.hooks_used.update(local_hooks)
                comp = get_frontend_complexity(lc, len(local_hooks))
                
                p_list, p_type = extract_props_and_types(content, start_pos)
                local_states = extract_local_states(body)
                contexts_used = extract_contexts_used(body)
                api_calls = extract_api_calls(content)
                child_components = extract_child_components(content, name)
                resolved_use = build_frontend_description(
                    name,
                    tag,
                    use,
                    local_hooks,
                    p_list,
                    local_states,
                    contexts_used,
                    api_calls,
                    child_components,
                )
                tags = detect_frontend_tags(
                    content,
                    name,
                    tag,
                    local_hooks,
                    p_list,
                    local_states,
                    contexts_used,
                    api_calls,
                    child_components,
                )

                events = extract_frontend_events(body)
                styles = extract_frontend_styles(body)
                errors = extract_frontend_errors(body)
                js_calls = extract_js_function_calls(body)

                # dependency & env information from module-level analysis
                deps = sorted(list(self.dependencies))
                module_env = sorted(list(self.env_vars))

                # small source preview
                source_preview = body[:400] if body else ''

                # detect default export near the match
                ctx_start = max(0, start_pos - 120)
                pre_ctx = content[ctx_start:start_pos].lower()
                is_default_export = 'export default' in pre_ctx

                target.append({
                    "name": name,
                    "start_line": sl,
                    "end_line": el,
                    "use": resolved_use,
                    "output": out_desc,
                    "complexity": comp,
                    "hooks": sorted(list(local_hooks)),
                    "tag": tag,
                    "tags": tags,
                    "props_list": p_list,
                    "props_type": p_type,
                    "local_states": local_states,
                    "contexts_used": contexts_used,
                    "api_calls": api_calls,
                    "child_components": child_components,
                    "events": events,
                    "styles": styles,
                    "errors": errors,
                    "function_calls": js_calls
                    ,"dependencies": deps,
                    "env_vars": module_env,
                    "source_preview": source_preview,
                    "is_default_export": is_default_export,
                    "raw_jsdoc": raw_doc
                })

        parse_funcs(ARROW_COMPONENT_RE, self.components, "Component")
        parse_funcs(FUNCTION_COMPONENT_RE, self.components, "Component")
        parse_funcs(ARROW_HELPER_RE, self.helpers, "Helper")
        parse_funcs(FUNCTION_HELPER_RE, self.helpers, "Helper")

# ==============================================================================
# 3. CONSOLIDATED PIPELINE RUNNER
# ==============================================================================

def run_pipeline() -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]]]:
    database_models = []
    backend_endpoints = []
    frontend_catalog = []

    # A. Crawl Backend
    for root, _, files in os.walk("backend"):
        if 'venv' in root or '.git' in root or '__pycache__' in root or 'logs' in root:
            continue
        for f in files:
            if f.endswith('.py'):
                p = os.path.join(root, f)
                try:
                    content = open(p, 'r', encoding='utf-8').read()
                    tree = ast.parse(content)
                    parser = ProjectParser(p, tree)
                    parser.visit(tree)

                    for cls in parser.classes:
                        # Map Database SQLModel blueprints
                        # Only recognize a class as a database model if it is in the RECOGNIZED_MODELS registry
                        # OR if it is located in the backend/database/models/ folder to prevent regular classes
                        # like ProjectParser or FrontendModuleAnalyzer from being falsely parsed as DB entities.
                        is_schema = p.replace("\\", "/").endswith("backend/schemas.py")
                        is_db_model = (
                            cls["name"] in RECOGNIZED_MODELS or
                            p.replace("\\", "/").startswith("backend/database/models/") or
                            is_schema
                        )
                        if is_db_model:
                            database_models.append({
                                "name": cls["name"],
                                "file": p,
                                "use": cls["use"],
                                "fields": cls["fields"],
                                "relationships": cls["relationships"],
                                "is_schema": is_schema
                            })
                        
                        # Add methods inside classes
                        for m in cls["methods"]:
                            if m["endpoint"]:
                                backend_endpoints.append({**m, "file": p})

                    for func in parser.functions:
                        if func["endpoint"]:
                            backend_endpoints.append({**func, "file": p})
                        else:
                            # Map general helpers or background runners
                            backend_endpoints.append({**func, "file": p, "is_helper": True})
                except Exception as e:
                    print(f"Skipped backend file {p} due to parse error: {e}")

    # B. Crawl Frontend
    frontend_src_root = os.path.join("frontend", "src")
    if os.path.exists(frontend_src_root):
        for root, _, files in os.walk(frontend_src_root):
            for f in files:
                if f.endswith(('.ts', '.tsx')):
                    p = os.path.join(root, f)
                    try:
                        analyzer = FrontendModuleAnalyzer(p)
                        analyzer.analyze()
                        
                        for c in analyzer.components:
                            frontend_catalog.append({**c, "file": p, "type": "Component"})
                        for h in analyzer.helpers:
                            frontend_catalog.append({**h, "file": p, "type": "Helper"})
                        for i in analyzer.interfaces:
                            frontend_catalog.append({"name": i, "file": p, "type": "Interface", "use": "TypeScript Data Interface Schema."})
                        for t in analyzer.types:
                            frontend_catalog.append({"name": t, "file": p, "type": "Type Blueprint", "use": "TypeScript Data Type Blueprint."})
                    except Exception as e:
                        print(f"Skipped frontend file {p} due to parse error: {e}")

    return database_models, backend_endpoints, frontend_catalog

# ==============================================================================
# 4. PREMIUM SINGLE PAGE APPLICATION COMPILER
# ==============================================================================

# HTML_TEMPLATE has been moved to a separate file (architecture_dashboard.html) to keep build_architecture_dashboard.py clean and maintainable.

def compile_dashboard() -> None:
    print("Dashboard Pipeline Triggered: Initiating codebase crawling...")
    db_models, backend_eps, frontend_catalog = run_pipeline()
    
    print(f"Loaded {len(db_models)} DB Blueprints, {len(backend_eps)} Backend Nodes, and {len(frontend_catalog)} Frontend Nodes.")
    
    # Locate template file relative to the script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    db_json = json.dumps(db_models, ensure_ascii=False)
    backend_json = json.dumps(backend_eps, ensure_ascii=False)
    frontend_json = json.dumps(frontend_catalog, ensure_ascii=False)
    
    # 1. Compile Main Dashboard
    template_path = os.path.join(script_dir, "architecture_dashboard.html")
    if not os.path.exists(template_path):
        template_path = "architecture_dashboard.html"
        
    if os.path.exists(template_path):
        with open(template_path, "r", encoding="utf-8") as f:
            html_template = f.read()
        
        if "{database_models_json}" in html_template:
            html_template = html_template.replace("{database_models_json}", db_json)
        else:
            html_template = re.sub(r'const DATABASE_SCHEMAS\s*=\s*.*', lambda m: f'const DATABASE_SCHEMAS = {db_json};', html_template)

        if "{backend_endpoints_json}" in html_template:
            html_template = html_template.replace("{backend_endpoints_json}", backend_json)
        else:
            html_template = re.sub(r'const BACKEND_ENDPOINTS\s*=\s*.*', lambda m: f'const BACKEND_ENDPOINTS = {backend_json};', html_template)

        if "{frontend_catalog_json}" in html_template:
            html_template = html_template.replace("{frontend_catalog_json}", frontend_json)
        else:
            html_template = re.sub(r'const FRONTEND_CATALOG\s*=\s*.*', lambda m: f'const FRONTEND_CATALOG = {frontend_json};', html_template)
        
        with open(template_path, 'w', encoding='utf-8') as f:
            f.write(html_template)
        print(f"Success! Codebase Dashboard Visualizer saved at: {os.path.abspath(template_path)}")
    else:
        print(f"Warning: Main template file not found at: {template_path}")

    # 2. Compile Standalone Folder Management Map
    flow_path = os.path.join(script_dir, "Flow.html")
    if not os.path.exists(flow_path):
        flow_path = "Flow.html"
        
    if os.path.exists(flow_path):
        with open(flow_path, "r", encoding="utf-8") as f:
            flow_template = f.read()
            
        flow_template = re.sub(r'const DATABASE_SCHEMAS\s*=\s*.*', lambda m: f'const DATABASE_SCHEMAS = {db_json};', flow_template)
        flow_template = re.sub(r'const BACKEND_ENDPOINTS\s*=\s*.*', lambda m: f'const BACKEND_ENDPOINTS = {backend_json};', flow_template)
        flow_template = re.sub(r'const FRONTEND_CATALOG\s*=\s*.*', lambda m: f'const FRONTEND_CATALOG = {frontend_json};', flow_template)
        
        with open(flow_path, 'w', encoding='utf-8') as f:
            f.write(flow_template)
        print(f"Success! Standalone Neural Flow Map saved at: {os.path.abspath(flow_path)}")
    else:
        print(f"Warning: Standalone Neural Flow template file not found at: {flow_path}")

if __name__ == "__main__":
    compile_dashboard()
