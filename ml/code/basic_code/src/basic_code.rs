/// A contract that holds the number 8 and allows for its increase.
#[multiversx_sc::contract]
pub trait BasicCode {
    #[storage_mapper("number")]
    fn number(&self) -> SingleValueMapper<u32>;

    #[init]
    fn init(&self) {
        self.number().set(8);
    }

    /// Increases the stored number by a given amount.
    #[endpoint]
    fn increase_number(&self, amount: u32) {
        self.number().update(|num| *num += amount);
    }
}