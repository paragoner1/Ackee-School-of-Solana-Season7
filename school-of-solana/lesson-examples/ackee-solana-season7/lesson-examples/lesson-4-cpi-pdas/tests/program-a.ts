import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProgramA } from "../target/types/program_a";

describe("program-a", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.programA as Program<ProgramA>;

  let signer = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {

    

    let [pda_address, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("ackee"), signer.publicKey.toBuffer()],
      program.programId
    );

    await airdrop(program.provider.connection, pda_address, 500_000_000_000);
    
    // Add your test here.
    const tx = await program.methods.initialize().accounts({
      pdaAccount: pda_address,
      signer: signer.publicKey,
      programB: anchor.workspace.programB.programId,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([signer]).rpc();



    console.log("Your transaction signature", tx);
  });
});

export async function airdrop(
  connection: any, 
  address: any,
  amount: number
) {
  await connection.confirmTransaction(
    await connection.requestAirdrop(address, amount),
    'confirmed'
  );
}
