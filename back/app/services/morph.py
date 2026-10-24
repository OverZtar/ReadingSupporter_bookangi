from functools import lru_cache


@lru_cache(maxsize=1)
def _kiwi():
    from kiwipiepy import Kiwi

    return Kiwi()


def to_lemma(surface: str) -> tuple[str, str]:
    """활용형 -> (원형, 품사). 용언은 어간+'다'로 복원. 분석기는 이 파일 안에서만 교체."""
    tokens = _kiwi().tokenize(surface)
    if not tokens:
        return surface, "UNK"
    head = tokens[0]
    lemma = head.form + "다" if head.tag.startswith(("V", "XSV", "XSA")) else head.form
    return lemma, head.tag
