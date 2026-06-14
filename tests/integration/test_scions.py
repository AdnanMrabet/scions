from gltest import get_contract_factory
from gltest.assertions import tx_execution_succeeded

ELEMENTS = ["EMBER", "TIDE", "GALE", "STONE", "SPARK", "SHADE", "BLOOM", "FROST"]
OUTCOMES = ("DOMINANT_A", "DOMINANT_B", "HYBRID", "MUTATION")


def test_breed_consensus():
    factory = get_contract_factory("Scions")
    contract = factory.deploy(args=[])

    # Two gen-0 primordials (deterministic, no AI).
    assert tx_execution_succeeded(contract.conjure(args=["Emberdrake"]).transact())
    assert tx_execution_succeeded(contract.conjure(args=["Tideserpent"]).transact())

    scions = contract.get_scions(args=[0]).call()
    assert len(scions) == 2
    ids = [s["id"] for s in scions]
    for s in scions:
        assert s["element"] in ELEMENTS
        assert int(s["generation"]) == 0
        assert int(s["power"]) > 0

    # Breed the two parents (the AI consensus write): the Geneticist rules the
    # cross outcome and the child's traits are derived deterministically.
    rc = contract.breed(args=[ids[0], ids[1]]).transact()
    assert tx_execution_succeeded(rc)

    after = contract.get_scions(args=[0]).call()
    assert len(after) == 3
    child = after[0]  # newest first
    assert child["outcome"] in OUTCOMES
    assert child["element"] in ELEMENTS
    assert int(child["power"]) > 0
    assert int(child["generation"]) == 1
    assert child["parent_a"] in ids and child["parent_b"] in ids

    stats = contract.get_stats(args=[]).call()
    assert int(stats["scions"]) == 3
    assert int(stats["broods"]) == 1
