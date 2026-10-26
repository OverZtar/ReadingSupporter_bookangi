# from fastapi import APIRouter

# from ..schemas import LookupRequest, LookupResponse
# from ..services import dictionary

# router = APIRouter()


# @router.post("/lookup", response_model=LookupResponse)
# def lookup(req: LookupRequest) -> LookupResponse:
#     # TODO: 형태소 분석(원형 복원)은 팀원 구현. 지금은 표면형 그대로 조회.
#     meaning = dictionary.find_meaning(req.surface, "")
#     return LookupResponse(surface=req.surface, lemma=req.surface, pos="", meaning=meaning)

from fastapi import APIRouter, HTTPException
from app.schemas import LookupRequest
from app.services.morph import to_lemma
from app.services.dictionary import fetch_dictionary_meaning

router = APIRouter(prefix="/lookup", tags=["lookup"])

@router.post("")
async def lookup_word(req: LookupRequest):
    if not req.surface:
        raise HTTPException(status_code=400, detail="단어가 입력되지 않았습니다.")

    # 1. 형태소 분석하여 원형(lemma)과 품사 태그 추출
    lemma, tag = to_lemma(req.surface)
    
    # 2. 우리말샘 사전 API 조회
    dict_result = await fetch_dictionary_meaning(lemma)
    
    return {
        "status": "success",
        "original": req.surface,
        "lemma": lemma,
        "tag": tag,
        "result": dict_result
    }