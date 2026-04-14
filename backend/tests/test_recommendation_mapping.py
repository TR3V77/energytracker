from app.services.recommendation_mapping import TRIGGER_TO_RECOMMENDATION_IDS
from app.services.recommendations_catalog import RECOMMENDATIONS_CATALOG


def test_each_trigger_maps_to_two_to_four_recommendations():
    for recommendation_ids in TRIGGER_TO_RECOMMENDATION_IDS.values():
        assert 2 <= len(recommendation_ids) <= 4


def test_trigger_mapping_ids_exist_in_catalog():
    for recommendation_ids in TRIGGER_TO_RECOMMENDATION_IDS.values():
        for recommendation_id in recommendation_ids:
            assert recommendation_id in RECOMMENDATIONS_CATALOG


def test_each_trigger_mapping_has_no_duplicates():
    for recommendation_ids in TRIGGER_TO_RECOMMENDATION_IDS.values():
        assert len(recommendation_ids) == len(set(recommendation_ids))
