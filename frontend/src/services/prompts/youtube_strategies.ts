/**
 * Specialized YouTube Growth & Marketing Prompts
 * Derived from expert social media management strategies.
 * 
 * Includes error handling, validation, and detailed AI prompts for:
 * - Educational content series planning
 * - Influencer collaboration strategies
 * - Live streaming events
 * - Community engagement blueprints
 * - Content repurposing matrices
 * - SEO optimization strategies
 * - Analytics-driven content planning
 */

// ==================== ERROR HANDLING & VALIDATION ====================

/**
 * Validates that input script is not empty and meets minimum requirements
 * @param script - The source script to validate
 * @throws {Error} If script is invalid
 */
function validateScript(script: string): void {
  if (!script) {
    throw new Error('Script cannot be empty. Please provide a valid anime script.');
  }
  if (typeof script !== 'string') {
    throw new Error('Script must be a string.');
  }
  if (script.trim().length < 50) {
    throw new Error('Script must be at least 50 characters long for meaningful analysis.');
  }
}

/**
 * Safely wraps prompt generation with error handling
 * @param script - The source script
 * @param promptGenerator - Function that generates the prompt
 * @returns The generated prompt or error message
 */
function safePromptGeneration(
  script: string,
  promptGenerator: (script: string) => string
): string {
  try {
    validateScript(script);
    return promptGenerator(script);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Prompt generation failed: ${errorMessage}`);
    throw new Error(`Failed to generate prompt: ${errorMessage}`);
  }
}

// ==================== ENHANCED PROMPTS ====================

/**
 * Generates a comprehensive educational series planning prompt
 * @param script - The anime script to base the series on
 * @returns Detailed prompt for AI content planning
 */
export const EDUCATIONAL_SERIES_PROMPT = (script: string) => safePromptGeneration(script, (s) => `
Act as an expert social media manager and content strategist.
TASK: Create a Comprehensive Educational Video Series based on this anime script.

DETAILED INSTRUCTIONS:

## 1. Series Architecture
- Identify 5-7 core learning modules from the script's themes and mechanics
- For each module, determine: prerequisites, learning objectives, target audience level
- Define series tone, pacing, and educational methodology (case studies, animations, live action)
- Suggest episodic format: intro episode + 8-12 core episodes + special features

## 2. Production Requirements
- **Equipment**: List specific cameras (specs), microphones (XLR/USB), lighting rigs, teleprompters
- **Software**: Video editing (DaVinci, Adobe Premiere Pro), motion graphics (After Effects), VFX tools
- **Studio Setup**: Space requirements, acoustic treatment, backdrop design, lighting positions
- **Post-Production**: Color grading, sound design, subtitle generation, accessibility overlays

## 3. Content Elements Framework
- **Visual Design**: Animated diagrams, infographics, screen recordings, real-world B-roll
- **Narrative Flow**: Hook (first 5 seconds), exposition, deep-dive, application, CTA
- **Pacing**: Scene duration, transition types, music beats, silence placement
- **Engagement Hooks**: Story arcs, unexpected revelations, expert insights, audience participation

## 4. Strategic Release & Promotion
- **Release Schedule**: Optimal upload times, frequency (weekly/bi-weekly), seasonal planning
- **Cross-Channel Strategy**: YouTube (long-form), YouTube Shorts (15-60 sec), TikTok, Instagram Reels, LinkedIn
- **Email Marketing**: Newsletter angles, segmentation strategy, conversion funnels
- **SEO Optimization**: Keywords, meta descriptions, tags, chapters, timestamps
- **Social Promotion**: Teaser clips, behind-the-scenes, community polls, countdown posts

## 5. Episode Breakdown Structure
- **Intro Episode**: Series overview, host introduction, episode roadmap, community building
- **Mid-Series**: Deep-dive modules with guest experts, interactive elements, mini-challenges
- **Finale**: Synthesis, community highlights, future content roadmap, exclusive preview

## 6. Visual Storyboard (Episode 1)
- **Scene 1** (0-10s): Animated logo + hook question that creates curiosity
- **Scene 2** (10-45s): Problem statement with visual examples from script
- **Scene 3** (45-2:00): Solution framework with on-screen graphics
- **Scene 4** (2:00-3:30): Detailed explanation with animated diagrams
- **Scene 5** (3:30-4:00): Call-to-action, next episode preview, engagement request

## 7. Audience Analytics Framework
- Expected demographics, psychographics, and viewing behaviors
- Retention metrics to track (average view duration, completion rate, re-engagement)
- Comment sentiment analysis strategy
- Community building milestones and rewards

SOURCE SCRIPT:
${s}
`);

/**
 * Generates an influencer collaboration strategy prompt
 * @param script - The anime script to base collaborations on
 * @returns Detailed prompt for influencer partnership planning
 */
export const INFLUENCER_COLLAB_PROMPT = (script: string) => safePromptGeneration(script, (s) => `
Act as an expert influencer marketing strategist and brand partnership manager.
TASK: Develop a Comprehensive Influencer Collaboration & Sponsorship Strategy.

DETAILED INSTRUCTIONS:

## 1. Influencer Mapping & Identification
- Identify 8-12 YouTube influencer niches aligned with anime content (anime critique, gaming, narrative analysis)
- Categorize by tier: Mega (1M+), Macro (500K-1M), Micro (100K-500K), Nano (10K-100K)
- For each tier, specify: typical engagement rates, audience demographics, partnership costs
- Identify 20+ specific creators matching target audience psychographics and content themes
- Include estimated subscriber counts, engagement metrics, and audience overlap

## 2. Collaboration Frameworks
- **Sponsored Videos**: Product placement integration, disclosure guidelines (FTC compliance)
- **Guest Appearances**: Co-hosted episodes, reaction videos, expert commentary segments
- **Takeovers**: Influencer-hosted content on main channel, behind-the-scenes access
- **Affiliate Programs**: Commission structures, unique discount codes, tracking mechanisms
- **Limited Editions**: Exclusive merch collabs, early access programs, limited-time bundles
- **Event Partnerships**: Convention appearances, charity streams, collaborative live events

## 3. Personalized Outreach Strategy
- **Discovery Phase**: Analyze existing partnerships, engagement patterns, audience alignment
- **Pitch Template**: Subject line hook, value proposition, collaboration benefits, media kit
- **Media Kit**: Channel analytics, audience demographics, case studies, testimonials, past sponsorships
- **Negotiation**: Rate cards, deliverable specifics, exclusivity clauses, performance bonuses
- **Relationship Building**: Long-term partnership roadmap, repeat collaboration opportunities

## 4. Collaboration Agreement Essentials
- **Compensation**: Fixed fees, performance bonuses, revenue sharing, barter arrangements
- **Deliverables**: Video length, upload deadlines, revision rounds, posting schedule
- **Content Guidelines**: Brand voice alignment, messaging points, prohibited content, disclosure requirements
- **Usage Rights**: Repurposing clips, archive permissions, social media usage, duration limits
- **Exclusivity**: Competitive clause duration, territorial restrictions, category exclusivity
- **Performance Metrics**: Engagement targets, click-through rates, conversion goals, bonus triggers

## 5. ROI & Impact Measurement
- **Vanity Metrics**: Views, likes, comments, shares, subscriber growth
- **Engagement Quality**: Watch time, retention curve, comment sentiment, shareability score
- **Conversion Metrics**: Click-throughs, discount code usage, affiliate link conversions, lead generation
- **Brand Sentiment**: Sentiment analysis tools, brand mention tracking, reputation impact assessment
- **Attribution Modeling**: Multi-touch attribution, customer journey mapping, lifetime value calculation
- **Reporting Dashboard**: Monthly performance summaries, stakeholder presentations, trend analysis

## 6. Contingency & Risk Management
- Escalation protocols for off-brand content or community backlash
- Contract termination conditions and dispute resolution processes
- Reputation monitoring systems and crisis response procedures

SOURCE SCRIPT:
${s}
`);

/**
 * Generates a live streaming event planning prompt
 * @param script - The anime script to base events on
 * @returns Detailed prompt for live stream strategy
 */
export const LIVE_STREAM_PROMPT = (script: string) => safePromptGeneration(script, (s) => `
Act as an expert live streaming strategist and digital event producer.
TASK: Plan a Comprehensive Live Stream Event Series Strategy.

DETAILED INSTRUCTIONS:

## 1. Event Concept Development
- **Format Options**:
  - Narrative Breakdown: Scene-by-scene analysis with voice acting, sound design, music placement
  - Creator Round-Tables: Panel discussions with directors, writers, voice actors, composers
  - Behind-the-Scenes Documentaries: Production process, storyboarding, animation, post-production workflows
  - Interactive Tutorials: Character design, animation techniques, scriptwriting masterclasses
  - Product Launches: Merchandise reveals, season announcements, exclusive content premieres
  - Fan Celebration Events: Community milestones, fan art showcases, costume contests
  - Expert Interviews: Industry legends, rising talents, technical specialists

## 2. Technical Infrastructure Requirements
- **Streaming Platform**: YouTube Live, Twitch, or multi-platform (using OBS Studio)
- **Hardware**: 
  - Cameras: Primary (4K capable), B-roll (gimbal/drone), crowd camera
  - Audio: Multiple lavalier mics, background mic, headphone monitoring system
  - Lighting: Key lights (2x 1200W), fill lights, backlighting rigs, LED panels for color
  - Networking: Redundant internet connections (primary 100+ Mbps, backup 50+ Mbps), bonded connections
- **Software**: 
  - Streaming: OBS Studio (advanced setup), vMix, Streamlabs
  - Graphics: Chroma key, lower thirds, overlays, real-time polls, chat integration
  - Encoding: Hardware encoding (NVIDIA/AMD), adaptive bitrate streaming
- **Backup Systems**: Hardware failover, internet redundancy, recording locally + cloud backup
- **Latency Optimization**: CDN selection, viewer buffering strategies, platform-specific settings

## 3. Audience Engagement Tactics
- **Interactive Elements**:
  - Real-time Polls: Voting on story decisions, character actions, plot directions (30-60 sec intervals)
  - Live Q&A: Community questions about production, characters, behind-the-scenes trivia
  - Chat Integration: Moderated discussions, emote reactions, chat reactions, animated messages
  - Gamification: Points system, badges, leaderboards, exclusive rewards for engagement
  - Surprises: Unexpected guest appearances, exclusive announcements, community shout-outs
  - Call-to-Action: Subscribe prompts, merchandise links, community challenges, next event teasers

## 4. Promotional Strategy for Maximum Viewership
- **Pre-Stream Promotion** (2-3 weeks before):
  - Announcement trailer (15-30 sec) across all channels with event hook
  - Social media countdown posts, daily behind-the-scenes content, teaser clips
  - Email campaigns: Segmented by audience (loyal fans, new viewers, past attendees)
  - Influencer partnerships: Cross-promotion with partner channels
  - Sponsored content: Reddit, Discord communities, anime forums, fan wikis
- **Stream Day Activation**:
  - Reminder notifications (12 hours, 1 hour before)
  - Live stream alerts to subscribers and followers
  - Strategic start time: Peak audience hours (evening for target timezone, rotating for global audience)
  - Pre-stream chat: 15-30 minutes early for community building and technical checks
- **Real-Time Engagement**:
  - Chat moderation and community management
  - Shoutouts for new subscribers and high-value community members
  - Trending topic participation and trending hashtag usage
  
## 5. Monetization Strategies
- **Direct Revenue**:
  - YouTube Super Chat: Tiered donation amounts, feature in chat, alerts
  - Channel Memberships: Tier-based access, exclusive member-only streams, custom badges
  - Merchandise Sales: Stream-exclusive items, limited-time merch drops, affiliate links
- **Sponsorship Deals**:
  - Pre-roll ads: Brand integrations at stream start
  - Mid-roll sponsorships: Natural product placements during breaks
  - Sponsored segments: Partner brand challenges or exclusive content
- **Affiliate Programs**: VPN services, streaming equipment, anime merchandise, gaming products

## 6. Post-Stream Analytics & Optimization
- **Performance Metrics**:
  - Peak concurrent viewers, average view duration, drop-off points
  - Engagement rate: Chat messages, poll participation, Super Chat volume
  - Conversion metrics: Subscriber gains, membership sign-ups, merchandise sales
  - Audience retention: Where viewers leave, re-engagement opportunities
- **Content Optimization**:
  - Edit VOD with chapters, highlights, timestamps
  - Create 3-5 YouTube Shorts from best moments
  - Publish audio version on podcast platforms
  - Extract key segments for TikTok/Instagram Reels compilation

SOURCE SCRIPT:
${s}
`);

/**
 * Generates a community engagement blueprint prompt
 * @param script - The anime script to base community engagement on
 * @returns Detailed prompt for community building strategy
 */
export const COMMUNITY_ENGAGEMENT_PROMPT = (script: string) => safePromptGeneration(script, (s) => `
Act as an expert community manager and engagement strategist.
TASK: Design a Comprehensive Community Engagement Blueprint.

DETAILED INSTRUCTIONS:

## 1. Comment Response Strategy
- **Tone Guidelines**: Authentic, warm, appreciative, maintaining brand voice
- **Response Categories**:
  - **Praise/Appreciation**: Thank sincerely, acknowledge specific feedback, encourage sharing
  - **Questions**: Detailed answers, cite sources, provide additional resources, encourage discussion
  - **Constructive Criticism**: Acknowledge validity, explain perspective, invite further dialogue
  - **Off-Topic/Spam**: Gentle redirection, clear community guidelines, supportive tone
  - **Toxic Comments**: Firm but respectful boundaries, explain violations, offer alternative engagement
- **Response Timing**: Within 24 hours for high-engagement comments, prioritize recent uploads
- **Escalation Process**: Flag serious issues for moderation team, establish reporting procedures

## 2. Community Tab Optimization
- **Content Types**:
  - Polls: Weekly decision-making polls (story direction, character preferences, episode rankings)
  - Quizzes: Test character knowledge, lore comprehension, prediction challenges
  - Behind-the-Scenes: WIP animations, voice acting sessions, production updates
  - Announcements: Schedule changes, new project reveals, community milestones
  - Discussions: Lore theories, character analysis threads, fan creations
  - Voting: Help decide on community features, special events, future content direction
- **Posting Schedule**: 2-3 times weekly, varied content types, optimal engagement times
- **Moderation**: Clear guidelines, active monitoring, community moderator program

## 3. User-Generated Content (UGC) Strategy
- **Encouragement Methods**:
  - Dedicated hashtags: #[ChannelName]CreatorSpotlight, #[ChannelName]FanArt, #[ChannelName]Cosplay
  - Monthly contests: Fan art competitions, cosplay showcases, creative writing challenges
  - Featured playlists: Community compilations, best reactions, creative remixes
  - Shout-outs: Weekly UGC highlights in videos and live streams with creator credit
  - Incentives: Prizes for top creators, exclusive merchandise, profile features
- **Curation Process**:
  - Scout content across platforms (YouTube comments, social tags, subreddits, Discord)
  - Request permission for featured content, provide attribution and links
  - Create compilation videos showcasing best community creations
  - Share creator profiles and cross-promote quality content

## 4. Interactive Video Elements
- **YouTube Cards**: 
  - Linked to related videos (suggested next episodes, deep-dives)
  - Polls at critical moments (audience predictions, character judgments)
  - Subscribe CTAs at strategic engagement points
- **End Screens**: 
  - Subscribe button, channel promotion
  - Video recommendations (related content, series progression)
  - Playlist links (full series, related topics)
- **Polls & Quizzes**:
  - Story decision polls (3-5 options, major plot branches)
  - Knowledge quizzes (lore facts, character details)
  - Prediction contests (engagement booster, community speculation)
  - Preference votes (animation style, music choice, voice acting preference)
- **Chapters/Timestamps**:
  - Detailed chapter markers for easy navigation
  - Section descriptions in video cards
  - Timestamp-based recommendations

## 5. Community Growth Roadmap
- **Milestones & Celebrations**:
  - 100K: Special thank-you video with community montage
  - 250K: Exclusive behind-the-scenes content, community Q&A session
  - 500K: Merchandise launch, special guest live stream
  - 1M: Production scale-up announcement, expanded content plans
- **Member Tiers**:
  - Tier 1: Custom badge, member-only chat, early access to regular videos
  - Tier 2: Above + monthly exclusive video, priority comment feature
  - Tier 3: Above + live chat with creators, custom emotes, featured in community updates

## 6. Crisis Management Protocol
- **Monitoring**: Set up alerts for negative sentiment, monitor trending discussions
- **Response Protocol**: Assess severity, craft empathetic response, escalate if necessary
- **Communication**: Transparent updates, acknowledge community concerns, action plans
- **Prevention**: Clear community guidelines, proactive moderation, regular reminder posts

SOURCE SCRIPT:
${s}
`);

/**
 * Generates a content repurposing matrix prompt
 * @param script - The anime script to repurpose across platforms
 * @returns Detailed prompt for multi-platform content strategy
 */
export const REPURPOSE_MATRIX_PROMPT = (script: string) => safePromptGeneration(script, (s) => `
Act as an expert content strategist and multi-platform digital marketer.
TASK: Create a Comprehensive Content Repurposing Matrix & Distribution Strategy.

DETAILED INSTRUCTIONS:

## 1. High-Value Content Extraction
- **YouTube Shorts (15-60 sec)**:
  - Extract 5-8 key moments: Climactic scenes, surprising revelations, emotional peaks, comedic beats
  - Identify hook-worthy openings (first 1-2 seconds are critical)
  - Vertical format optimization: Padding, text overlays, captions, trending audio
  - Hook formula: Create curiosity gap in first frame
  - CTAs: Link to full video, subscribe prompts, comment engagement
- **TikTok Reels (15-60 sec)**:
  - Trending audio integration: Match scenes to trending sounds, trending effects
  - Transition techniques: Jump cuts, speed ramps, effect reveals
  - Caption strategy: Text overlays, trending sounds, lip-sync opportunities
  - Hook variations: Question-based, shocking revelation, trending format participation
  - Hashtag strategy: Mix trending (#FYP, #ForYou) + niche (#Anime, genre, specific series)
- **Instagram Reels (15-90 sec)**:
  - Audio strategy: Trending sounds, original music, voiceover hooks
  - Engagement hooks: Ask questions, create cliffhangers, tag relevant accounts
  - Captions: Witty, story-driven, call-to-action focused
  - Cross-promotion: Link to full video, suggest following main channel
- **LinkedIn Posts (text + visual)**:
  - Angle: Industry insights, creative process, storytelling lessons, team behind-the-scenes
  - Format: Carousel posts with process breakdowns, text updates, video clips
  - Engagement: Encourage professional community discussion, industry commentary
  
## 2. Platform-Specific Adaptations
- **Mobile-First Optimization**:
  - Vertical vs. horizontal aspect ratios (9:16 for Shorts/TikTok, 1:1 for Instagram)
  - Text readability: Large fonts, high contrast, on-screen placement
  - Attention spans: Hook in first 1-3 seconds, keep editing dynamic
  - Audio: Captions critical (90% watch without sound), trending sounds prioritized
- **Audio Strategy**:
  - YouTube: Original music + voiceover commentary
  - TikTok: Trending sounds, trending effects, original audio combinations
  - Instagram: Music-first approach, trending tracks, licensed audio
  - LinkedIn: Voiceover with subtle background audio
- **Visual Branding**:
  - Consistent intro/outro across platforms (channels, watermarks, logos)
  - Color grading consistency (apply same grade to repurposed content)
  - Typography: Use channel branding fonts and colors
  - Overlays: Platform-specific optimization (text safe zones, format requirements)

## 3. Cross-Channel Distribution Calendar
- **Weekly Distribution Pattern**:
  - Monday: YouTube video release (full-length analysis/episode)
  - Tuesday-Thursday: YouTube Shorts rollout (3-5 extracts from Monday's video)
  - Wednesday: TikTok/Instagram Reels posting (alternative angles, trending format)
  - Friday: Community engagement (polls, comments, behind-the-scenes)
  - Weekend: Bonus content (fan features, trending audio challenges, guest appearances)
- **Content Recycling**: Evergreen content (tutorials, lore explanations) reposted quarterly
- **Seasonal Strategies**: Holiday specials, season premieres, anniversary callbacks

## 4. Title & Thumbnail Optimization
- **YouTube Titles**:
  - Formula: [Hook] + [Core Topic] + [Benefit/Emotion] + [Curiosity Gap]
  - Example: "SHOCKING Twist | [Character] Reveal Explained | You Missed This!"
  - Keywords: Primary (first 3 words), secondary (natural integration), searchability
  - Length: 50-60 characters for optimal display
- **YouTube Thumbnails**:
  - Formula: High contrast + minimal text + emotional expression + brand consistency
  - Design: Bold colors, large readable text (max 3 words), character expression
  - A/B testing: Create variants, measure CTR, optimize top performers
  - Consistency: Logo placement, color scheme, font choices
- **Shorts/Reels Titles**:
  - Hook-based: Question format, trending terminology, curiosity gap
  - Keywords: First 5 words critical, include main topic
  - Hashtag integration: Trending #FYP, #ForYou, niche hashtags
- **Thumbnail Best Practices**:
  - Shorts: First frame optimization (must be compelling without play button)
  - Reels: Text overlay in first frame (hook text visible before clicking)

## 5. Analytics & Performance Tracking
- **Metrics by Platform**:
  - YouTube: Watch time, click-through rate (CTR), average view duration, subscriber growth
  - TikTok: Completion rate, shares, comments, profile views, follower growth
  - Instagram: Engagement rate, saves, shares, profile clicks, follower growth
  - Overall: Cross-platform traffic (link clicks), audience overlap, conversion funnels
- **Reporting Cadence**: Weekly performance review, monthly trend analysis, quarterly strategy adjustment
- **Optimization**: Double down on high-performing content formats, A/B test underperformers

## 6. SEO Metadata Strategy
- **YouTube SEO**:
  - Video title: Primary keyword in first 60 characters
  - Description: Detailed summary (150+ chars), timestamps, keywords, CTAs, links
  - Tags: 5-10 relevant tags (primary, secondary, long-tail keywords)
  - Captions/Subtitles: Full transcript for searchability and accessibility
  - Playlists: Organize by series, topic, difficulty level
- **Community Tab**: Use for keyword-rich descriptions, link building, engagement
- **Hashtag Strategy**: Research volume vs. competition, mix popular + niche tags

SOURCE SCRIPT:
${s}
`);

