from app.schemas import OrganizationItem


ORGANIZATIONS = [
    OrganizationItem(
        name="Plastic Circularity Hub",
        kind="Recycling Center",
        address="12 Road No. 36, Jubilee Hills",
        city="Hyderabad",
        contact="+91 90000 11111",
        accepted_categories=["Recyclable"],
        accepted_materials=["plastic"],
    ),
    OrganizationItem(
        name="Glass Recovery Station",
        kind="Government Recycling Center",
        address="88 IDA Nacharam Industrial Estate",
        city="Hyderabad",
        contact="+91 90000 11112",
        accepted_categories=["Recyclable"],
        accepted_materials=["glass"],
    ),
    OrganizationItem(
        name="Paper Reuse Cooperative",
        kind="NGO Recycling Partner",
        address="24 Tarnaka Main Road",
        city="Hyderabad",
        contact="+91 90000 11113",
        accepted_categories=["Recyclable"],
        accepted_materials=["paper"],
    ),
    OrganizationItem(
        name="Metal Recovery Yard",
        kind="Government Scrap Collection Point",
        address="77 Sanath Nagar Industrial Area",
        city="Hyderabad",
        contact="+91 90000 11114",
        accepted_categories=["Recyclable"],
        accepted_materials=["metal"],
    ),
    OrganizationItem(
        name="Urban Compost Collective",
        kind="Organic Waste NGO",
        address="48 Karkhana Road",
        city="Hyderabad",
        contact="+91 90000 22222",
        accepted_categories=["Organic"],
        accepted_materials=["food"],
    ),
    OrganizationItem(
        name="City Wet Waste Biomass Unit",
        kind="Government Organic Processing Unit",
        address="5 Jawahar Nagar Transfer Station",
        city="Hyderabad",
        contact="+91 90000 22223",
        accepted_categories=["Organic"],
        accepted_materials=["food"],
    ),
    OrganizationItem(
        name="SafeTech Recovery Point",
        kind="Hazardous Waste Collector",
        address="7 Hitec City Phase 2",
        city="Hyderabad",
        contact="+91 90000 33333",
        accepted_categories=["Hazardous"],
        accepted_materials=["battery", "e-waste", "medical"],
    ),
    OrganizationItem(
        name="State E-Waste Mission Cell",
        kind="Government Hazardous Waste Center",
        address="16 Uppal Industrial Development Area",
        city="Hyderabad",
        contact="+91 90000 33334",
        accepted_categories=["Hazardous"],
        accepted_materials=["battery", "e-waste", "medical"],
    ),
    OrganizationItem(
        name="Material Recovery Facility South",
        kind="Government Resource Recovery Center",
        address="101 Falaknuma Resource Recovery Zone",
        city="Hyderabad",
        contact="+91 90000 44444",
        accepted_categories=["Non-recyclable"],
        accepted_materials=["mixed waste", "textile"],
    ),
    OrganizationItem(
        name="Community Reuse Exchange",
        kind="NGO Reuse Network",
        address="33 Begumpet Community Reuse Lane",
        city="Hyderabad",
        contact="+91 90000 44445",
        accepted_categories=["Non-recyclable"],
        accepted_materials=["textile"],
    ),
]


def list_organizations(category: str | None = None, material: str | None = None) -> list[OrganizationItem]:
    if not category and not material:
        return ORGANIZATIONS

    if material:
        exact_material = [item for item in ORGANIZATIONS if material in item.accepted_materials]
        if category:
            exact_material = [item for item in exact_material if category in item.accepted_categories]
        if exact_material:
            return exact_material[:4]

    scored: list[tuple[int, OrganizationItem]] = []
    for item in ORGANIZATIONS:
        score = 0

        if category and category in item.accepted_categories:
            score += 2
        if material and material in item.accepted_materials:
            score += 4
        if material and material not in item.accepted_materials:
            score -= 1
        if category and category not in item.accepted_categories:
            score -= 1

        if score > 0:
            scored.append((score, item))

    scored.sort(key=lambda row: row[0], reverse=True)
    results = [item for _, item in scored]

    if results:
        return results[:4]

    if category:
        category_only = [item for item in ORGANIZATIONS if category in item.accepted_categories]
        if category_only:
            return category_only[:4]

    return []
