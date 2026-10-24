from fastapi import APIRouter

from ..schemas import LookupRequest, LookupResponse
from ..services import dictionary

router = APIRouter()


@router.post("/lookup", response_model=LookupResponse)
def lookup(req: LookupRequest) -> LookupResponse:
    # TODO: 형태소 분석(원형 복원)은 팀원 구현. 지금은 표면형 그대로 조회.
    meaning = dictionary.find_meaning(req.surface, "")
    return LookupResponse(surface=req.surface, lemma=req.surface, pos="", meaning=meaning)
