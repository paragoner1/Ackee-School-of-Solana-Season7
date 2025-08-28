# Lesson 6: Frontend for Solana Apps Quick Reference

## Tools
- create-solana-dapp: Init full-stack project.
- Codama: Generate client from IDL; fix program ID/seeds.

## Backend Quick Ref
- Accounts: Event (name, desc, price, avail, organizer, start), Ticket (event, buyer, price).
- Instructions: initialize (validate/create event), buy_ticket (check/transfer/update/create), withdraw (transfer funds).

## Frontend Quick Ref
- Components: CreateEvent (form), EventList (fetch/display), BuyTicket/Withdraw buttons.
- Integration: Use Wallet UI for signer/client; build/sign/send tx.

## Deployment
- Update Anchor.toml to Devnet.
- Airdrop: `solana airdrop` or faucet.
- Deploy: `anchor deploy`.

## Resources
- GitHub Repo: https://github.com/Ackee-Blockchain/school-of-solana/tree/master/6.lesson (examples)
