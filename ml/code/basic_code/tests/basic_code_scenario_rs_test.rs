use multiversx_sc_scenario::*;

fn world() -> ScenarioWorld {
    let mut blockchain = ScenarioWorld::new();
    // blockchain.set_current_dir_from_workspace("relative path to your workspace, if applicable");

    blockchain.register_contract("file:output/basic_code.wasm", basic_code::ContractBuilder);
    blockchain
}

#[test]
fn empty_rs() {
    world().run("scenarios/basic_code.scen.json");
}