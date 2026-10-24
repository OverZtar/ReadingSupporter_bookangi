from pydantic import BaseModel


class LookupRequest(BaseModel):
    surface: str
    context: str | None = None


class LookupResponse(BaseModel):
    surface: str
    lemma: str
    pos: str
    meaning: str | None = None
    explanation: str | None = None
    examples: list[str] = []
