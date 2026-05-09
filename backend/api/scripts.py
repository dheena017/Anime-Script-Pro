from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from typing import List, Optional
from loguru import logger
from backend.database.models import Script, Storyboard, ScriptVersion, ScreeningRoomEntry, NarrativeBeat, Project
from backend.database import async_session, async_engine
from backend.utils.deps import get_auth_user_id

router = APIRouter(prefix="/api", tags=["Scripts"])

@router.get("/scripts", response_model=List[Script])
async def get_scripts(user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        # Filter scripts by projects owned by the user
        statement = select(Script).join(Project).where(Project.user_id == user_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/scripts", response_model=Script)
async def create_script(script: Script, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        # Verify project ownership if project_id is provided
        if script.project_id:
            project = await session.get(Project, script.project_id)
            if not project or project.user_id != user_id:
                raise HTTPException(status_code=403, detail="Not authorized for this project")
                
        session.add(script)
        await session.commit()
        await session.refresh(script)
        logger.info(f"[SCRIPT] Initialized: {script.title}")
        return script

@router.get("/scripts/{script_id}", response_model=Script)
async def get_script(script_id: int, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        script = await session.get(Script, script_id)
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")
        
        # Verify ownership via project
        if script.project_id:
            project = await session.get(Project, script.project_id)
            if not project or project.user_id != user_id:
                raise HTTPException(status_code=403, detail="Not authorized")
                
        return script

@router.put("/scripts/{script_id}", response_model=Script)
async def update_script(script_id: int, script: Script, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        db_script = await session.get(Script, script_id)
        if not db_script:
            raise HTTPException(status_code=404, detail="Script not found")
        
        # Verify project ownership
        if db_script.project_id:
            project = await session.get(Project, db_script.project_id)
            if not project or project.user_id != user_id:
                raise HTTPException(status_code=403, detail="Not authorized")

        db_script.title = script.title
        db_script.content = script.content
        session.add(db_script)
        await session.commit()
        await session.refresh(db_script)
        return db_script

@router.delete("/scripts/{script_id}")
async def delete_script(script_id: int, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        script = await session.get(Script, script_id)
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")
            
        # Verify ownership
        if script.project_id:
            project = await session.get(Project, script.project_id)
            if not project or project.user_id != user_id:
                raise HTTPException(status_code=403, detail="Not authorized")

        await session.delete(script)
        await session.commit()
        return {"ok": True}

@router.get("/storyboards", response_model=List[Storyboard])
async def get_storyboards(script_id: Optional[int] = Query(None), user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        statement = select(Storyboard).join(Script).join(Project).where(Project.user_id == user_id)
        if script_id:
            statement = statement.where(Storyboard.script_id == script_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/storyboards", response_model=Storyboard)
async def create_storyboard(storyboard: Storyboard, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        # Verify script ownership
        script = await session.get(Script, storyboard.script_id)
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")
        
        if script.project_id:
            project = await session.get(Project, script.project_id)
            if not project or project.user_id != user_id:
                raise HTTPException(status_code=403, detail="Not authorized")
                
        session.add(storyboard)
        await session.commit()
        await session.refresh(storyboard)
        return storyboard

@router.get("/storyboards/{storyboard_id}", response_model=Storyboard)
async def get_storyboard(storyboard_id: int, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        storyboard = await session.get(Storyboard, storyboard_id)
        if not storyboard:
            raise HTTPException(status_code=404, detail="Storyboard not found")
            
        # Verify via script/project
        script = await session.get(Script, storyboard.script_id)
        if script and script.project_id:
            project = await session.get(Project, script.project_id)
            if not project or project.user_id != user_id:
                raise HTTPException(status_code=403, detail="Not authorized")
                
        return storyboard

# Screening Room Aliases
@router.get("/screening_room_entries", response_model=List[ScreeningRoomEntry])
async def get_screeningroom_entries(script_id: Optional[int] = Query(None), user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        statement = select(ScreeningRoomEntry).join(Script).join(Project).where(Project.user_id == user_id)
        if script_id:
            statement = statement.where(ScreeningRoomEntry.script_id == script_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/screening_room_entries", response_model=ScreeningRoomEntry)
async def create_screeningroom_entry(entry: ScreeningRoomEntry, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        # Verify script ownership
        script = await session.get(Script, entry.script_id)
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")
            
        if script.project_id:
            project = await session.get(Project, script.project_id)
            if not project or project.user_id != user_id:
                raise HTTPException(status_code=403, detail="Not authorized")

        session.add(entry)
        await session.commit()
        await session.refresh(entry)
        logger.info(f"[SCREENING] New entry synced for script {entry.script_id}")
        return entry

@router.get("/scripts/{script_id}/versions", response_model=List[ScriptVersion])
async def get_script_versions(script_id: int):
    async with async_session() as session:
        statement = select(ScriptVersion).where(ScriptVersion.script_id == script_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/scripts/{script_id}/versions", response_model=ScriptVersion)
async def create_script_version(script_id: int, version: ScriptVersion):
    async with async_session() as session:
        version.script_id = script_id
        session.add(version)
        await session.commit()
        await session.refresh(version)
        return version

@router.get("/scripts/{script_id}/narrativebeats", response_model=List[NarrativeBeat])
async def get_narrativebeats_for_script(script_id: int):
    async with async_session() as session:
        statement = select(NarrativeBeat).where(NarrativeBeat.script_id == script_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/methods")
async def create_production_method(payload: dict):
    # Stub for production methods
    logger.info(f"[METHOD] Production strategy initialized: {payload.get('name')}")
    return {"status": "ok", "method": payload.get("name")}
