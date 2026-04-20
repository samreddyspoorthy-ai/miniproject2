from app.config import CATEGORY_DESCRIPTIONS
from app.schemas import ResultInsight


CLASS_SUGGESTIONS = {
    "plastic": ResultInsight(
        title="Plastic recovery",
        description="Empty, rinse, and dry the plastic item before placing it in the recyclable bin.",
    ),
    "glass": ResultInsight(
        title="Glass recovery",
        description="Rinse the glass item, remove obvious residue, and place it in the glass or mixed recycling stream.",
    ),
    "food": ResultInsight(
        title="Organic composting",
        description="Move food waste into a compost or wet-waste bin to reduce landfill methane emissions.",
    ),
    "paper": ResultInsight(
        title="Paper recycling",
        description="Keep paper dry and clean; recycle only if it is not food-soiled or laminated.",
    ),
    "metal": ResultInsight(
        title="Metal recycling",
        description="Crush lightly if safe, rinse if needed, and send the metal item to the dry recycling stream.",
    ),
    "textile": ResultInsight(
        title="Textile diversion",
        description="Reuse or donate if possible; otherwise keep contaminated fabric out of recycling bins.",
    ),
    "battery": ResultInsight(
        title="Battery safety",
        description="Store batteries in a separate container and drop them at an authorized hazardous waste point.",
    ),
    "e-waste": ResultInsight(
        title="E-waste handling",
        description="Take electronic parts to an approved e-waste center and never mix them with normal recyclables.",
    ),
    "medical": ResultInsight(
        title="Medical disposal",
        description="Seal medical waste safely and follow local hazardous or biomedical disposal rules.",
    ),
    "mixed waste": ResultInsight(
        title="Residual waste",
        description="Place mixed or contaminated waste in the general bin and reduce future mixed-material purchases.",
    ),
}

CLASS_AWARENESS = {
    "Recyclable": ResultInsight(
        title="Why this matters",
        description="Clean recyclable sorting reduces contamination and helps materials re-enter the circular economy.",
    ),
    "Non-recyclable": ResultInsight(
        title="Awareness tip",
        description="Avoid mixing soft plastics, dirty packaging, and composite materials into recycling bins.",
    ),
    "Organic": ResultInsight(
        title="Climate impact",
        description="Separating food waste helps cities reduce methane emissions and improve compost production.",
    ),
    "Hazardous": ResultInsight(
        title="Safety first",
        description="Hazardous waste needs dedicated handling because leaks, toxins, or fire risk can harm people and equipment.",
    ),
}


def get_recycling_suggestion(label: str, category: str) -> ResultInsight:
    return CLASS_SUGGESTIONS.get(label) or ResultInsight(
        title=f"{category} guidance",
        description=CATEGORY_DESCRIPTIONS[category],
    )


def get_awareness_tip(category: str) -> ResultInsight:
    return CLASS_AWARENESS[category]
