from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from backend.database import async_session, async_engine
from loguru import logger
from backend.database.models import ProductionSession, Project
from backend.utils.deps import get_auth_user_id

router = APIRouter(prefix="/api", tags=["Sessions"])


@router.post("/sessions")
async def batch_create_sessions(payload: dict, user_id: str = Depends(get_auth_user_id)):
    project_id = payload.get("project_id")
    if not project_id:
        raise HTTPException(status_code=400, detail="project_id is required")

    try:
        project_pk = int(project_id)
    except Exception:
        raise HTTPException(status_code=400, detail="project_id must be an integer")

    async with async_session() as session:
        # Verify project ownership
        project = await session.get(Project, project_pk)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=401, detail="Project access denied")

        sessions_data = payload.get("sessions", [])
        created = []
        for s in sessions_data:
            db_session = ProductionSession(
                project_id=project_pk,
                session_number=s.get("session_number"),
                title=s.get("title"),
                summary=s.get("summary"),
                prod_metadata=s.get("prod_metadata", {})
            )
            session.add(db_session)
            created.append(db_session)

        await session.commit()
        # refresh to populate ids
        for ses in created:
            await session.refresh(ses)

        sessions_out = []
        for ses in created:
            sessions_out.append({
                "id": ses.id,
                "session_id": ses.id,
                "session_number": ses.session_number,
                "title": ses.title,
            })

        logger.info(f"[SESSIONS] Batch generated for project {project_pk}")
        return sessions_out


@router.get("/sessions")
async def get_sessions(project_id: int, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        # Verify project ownership
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=401, detail="Project access denied")

        statement = select(ProductionSession).where(ProductionSession.project_id == project_id)
        return result.scalars().all()
        return result.scalars().all()
