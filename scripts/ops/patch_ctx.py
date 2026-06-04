import os

ctx_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "contexts", "GeneratorContext.tsx"))
with open(ctx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
old_imports = """import { 
  MOCK_STORY_BIBLE, 
  MOCK_WORLD_DATA, 
  MOCK_CAST_DATA, 
  MOCK_SERIES_PLAN, 
  MOCK_SCRIPT 
} from '../services/generators/mockData';"""

new_imports = """import { 
  MOCK_STORY_BIBLE, 
  MOCK_WORLD_DATA, 
  MOCK_CAST_DATA, 
  MOCK_SERIES_PLAN, 
  MOCK_SCRIPT,
  MOCK_SEO_METADATA,
  MOCK_SEO_DESCRIPTION,
  MOCK_SEO_ALT_TEXT,
  MOCK_SEO_DISTRIBUTION,
  MOCK_SEO_GROWTH,
  MOCK_IMAGE_PROMPTS,
  MOCK_VIDEO_PROMPTS
} from '../services/generators/mockData';"""

content = content.replace(old_imports, new_imports)

# 2. Add to loadDemoProject dependencies and set them
load_demo_body_end = """    // Phase 6: Production Matrix Materialization
    const demoSequence = generateProductionSequences(1, 3, 3);
    setProductionSequence(demoSequence);"""

load_demo_body_end_new = """    // Phase 6: Production Matrix Materialization
    const demoSequence = generateProductionSequences(1, 3, 3);
    setProductionSequence(demoSequence);

    // Additional Phase 7: Assets & SEO Demo Data
    setGeneratedImagePrompts(MOCK_IMAGE_PROMPTS);
    setVideoData(MOCK_VIDEO_PROMPTS);
    setGeneratedMetadata(MOCK_SEO_METADATA);
    setGeneratedDescription(MOCK_SEO_DESCRIPTION);
    setGeneratedAltText(MOCK_SEO_ALT_TEXT);
    setGeneratedDistributionPlan(MOCK_SEO_DISTRIBUTION);
    setGeneratedGrowthStrategy(MOCK_SEO_GROWTH);
"""

content = content.replace(load_demo_body_end, load_demo_body_end_new)

# 3. Add to loadDemoProject dependency array
old_deps = """    setTemperature,
    setMaxTokens,
    setTopP,
    setTopK,
    setContentType,
    addLog,
    showNotification
  ]);"""

new_deps = """    setTemperature,
    setMaxTokens,
    setTopP,
    setTopK,
    setContentType,
    addLog,
    showNotification,
    setGeneratedImagePrompts,
    setVideoData,
    setGeneratedMetadata,
    setGeneratedDescription,
    setGeneratedAltText,
    setGeneratedDistributionPlan,
    setGeneratedGrowthStrategy
  ]);"""

content = content.replace(old_deps, new_deps)

with open(ctx_file, 'w', encoding='utf-8') as f:
    f.write(content)
