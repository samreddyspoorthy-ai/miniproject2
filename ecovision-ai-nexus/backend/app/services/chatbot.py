from __future__ import annotations

from app.schemas import ChatResponse


FAQ = {
    "batteries": (
        "Batteries should never go in regular household bins. Keep them in a sealed dry container and use an authorized hazardous or e-waste drop-off point."
    ),
    "thermocol": (
        "Thermocol or expanded polystyrene is usually difficult to recycle in municipal systems. Treat it as non-recyclable unless your local recycler explicitly accepts it."
    ),
    "plastic": (
        "Clean rigid plastic like bottles and some containers can often be recycled, but soft multilayer plastics and food-contaminated plastics usually need separate handling."
    ),
    "organic": (
        "Organic waste such as food scraps should move to compost or wet-waste collection quickly to reduce odor and methane risk."
    ),
}


def answer_question(message: str, context_category: str | None = None) -> ChatResponse:
    normalized = message.strip().lower()
    answer = (
        "Sort the item by material first, keep hazardous items separate, and prefer local recycling guidance when available. "
        "If you share the item type, I can give a more specific disposal suggestion."
    )

    for keyword, response in FAQ.items():
        if keyword in normalized:
            answer = response
            break

    if context_category and context_category in {"hazardous", "organic", "recyclable", "non-recyclable"}:
        answer += f" Based on the current detection context, this item is trending toward the {context_category} stream."

    return ChatResponse(
        answer=answer,
        suggested_questions=[
            "How to dispose batteries safely?",
            "Is thermocol recyclable?",
            "What can I compost at home?",
        ],
    )
