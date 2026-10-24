from ..config import settings


def find_meaning(lemma: str, pos: str) -> str | None:
    """원형으로 사전 조회. TODO: 사전 API 연동 (settings.dict_api_key)."""
    _ = settings.dict_api_key
    return None
