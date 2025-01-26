module itb::itb {
    use std::option;
    use sui::coin;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};

    // Name matches the module name but in UPPERCASE
    public struct ITB has drop {}

    // Module initializer is called once on module publish.
    // A treasury cap is sent to the publisher, who then controls minting and burning.
    fun init(witness: ITB, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            witness, 
            9, 
            b"ITB", 
            b"ITB", 
            b"", 
            option::some(url::new_unsafe_from_bytes(b"https://silver-blushing-woodpecker-143.mypinata.cloud/ipfs/Qmed2qynTAszs9SiZZpf58QeXcNcYgPnu6XzkD4oeLacU4")), 
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx))
    }

    public entry fun mint(
        treasury: &mut coin::TreasuryCap<ITB>, 
        amount: u64, 
        recipient: address, 
        ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury, amount, recipient, ctx)
    }

    public entry fun burn(treasury: &mut coin::TreasuryCap<ITB>,
    coin: coin::Coin<ITB>){
        coin::burn(treasury,coin);
    }
    

}