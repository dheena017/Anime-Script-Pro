import asyncio
from sqlalchemy import Session, select
from backend.database import engine
from backend.database.models.assets import GrowthStrategy

async def seed_growth_strategies():
    strategies = [
        # TRACK 1: EDUCATIONAL
        {
            "name": "Educational Series Architect",
            "track": "Educational",
            "icon": "Play",
            "description": "Comprehensive blueprint for creating, equipment planning, and scheduling educational video series.",
            "prompt": """Act as an expert social media manager for small business, services, or products.
1. Create a Series of Educational Videos: Compose a list of topics or themes. Consider areas of expertise, FAQs, and emerging trends.
2. Equipment & Software: List needed cameras, microphones, lighting, and editing tools for professional content.
3. Content Elements: Itemize key elements including clear explanations, visuals, demos, and CTAs.
4. Schedule & Promotion: Plan a release schedule and a strategy for promoting on social media, newsletters, and websites.
5. Scripting: Draft an outline and a sample script/storyboard for one episode."""
        },
        # TRACK 2: INFLUENCER
        {
            "name": "Influencer Nexus Strategy",
            "track": "Influencer",
            "icon": "Users",
            "description": "Identifying influencers, drafting pitches, and managing collaboration agreements.",
            "prompt": """Act as an expert social media manager for small business, services, or products.
1. Influencer Identification: List YouTube influencers who align with the target audience.
2. Benefits & Collaboration: Itemize benefits and types of collaboration (sponsored videos, giveaways, guest appearances).
3. Pitching & Agreements: Plan a strategy for personalized pitching and draft a collaboration agreement template.
4. ROI & Tracking: Process for tracking effectiveness (views, subscribers, sales) and calculating ROI."""
        },
        # TRACK 3: LIVE EVENTS
        {
            "name": "Live Stream Command",
            "track": "Live",
            "icon": "Zap",
            "description": "Planning, technical setup, and audience engagement for live streaming events.",
            "prompt": """Act as an expert social media manager for small business, services, or products.
1. Event Concepts: List potential live stream ideas (tutorials, panels, behind-the-scenes).
2. Technical Setup: Itemize necessary equipment (cameras, mics, streaming software).
3. Engagement Tactics: Devise a plan for real-time engagement (responding to comments, polls, Q&A).
4. Monetization & Repurposing: List ways to monetize and repurpose the recorded stream content."""
        },
        # TRACK 4: ENGAGEMENT
        {
            "name": "Community Architect Hub",
            "track": "Engagement",
            "icon": "MessageSquare",
            "description": "Building a loyal community through comment management and subscriber interaction.",
            "prompt": """Act as an expert social media manager for small business, services, or products.
1. Comment Management: Guidelines for responding with empathy and handling constructive criticism.
2. Community Features: Plan for leveraging YouTube's community tab, Stories, and polls.
3. Audience Collaboration: Strategy for viewer-generated content and featuring fan submissions.
4. Loyalty Growth: Estimate potential increase in brand loyalty and customer conversion through active engagement."""
        },
        # TRACK 5: REPURPOSE
        {
            "name": "Repurpose Matrix",
            "track": "Repurpose",
            "icon": "Repeat",
            "description": "Converting long-form scripts and videos into multi-platform content (Shorts, Reels, TikToks).",
            "prompt": """Act as an expert social media manager for small business, services, or products.
1. Content Identification: Identify high-engagement blog posts, webinars, or videos to repurpose.
2. Adaptation Strategy: Steps to adapt content for YouTube, including scripting, visuals, and SEO optimization.
3. Distribution: Schedule for releasing repurposed content and promoting across other channels.
4. Metrics: Calculate potential increase in reach and website traffic from repurposed content."""
        }
    ]

    with Session(engine) as session:
        for strat_data in strategies:
            # Check if exists
            statement = select(GrowthStrategy).where(GrowthStrategy.name == strat_data["name"])
            existing = session.exec(statement).first()
            if not existing:
                strat = GrowthStrategy(**strat_data)
                session.add(strat)
        
        session.commit()
        print("Growth strategies seeded successfully.")

if __name__ == "__main__":
    asyncio.run(seed_growth_strategies())
