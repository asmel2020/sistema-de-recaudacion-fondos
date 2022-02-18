import { storage, logging, PersistentMap, context, u128 } from "near-sdk-as";

const votesAllowed = new PersistentMap<string, u128>("a:");
const registeredUser = new PersistentMap<string, bool>("b:");
const proposals = new PersistentMap<u8, string>("c:");
const voteProposal = new PersistentMap<u8, u128>("d:");
const MinDeposit = u128.from("1000000000000000000000000");
const MaxDeposit = u128.from("10000000000000000000000000");

//@dev constructor del contrato
export function init(): bool {
  assert(storage.get<string>("init") == null, "contract already initialized");

  const initialOwner = context.sender;
  storage.set("owner", initialOwner);

  proposals.set(1,"buy an NFT");
  proposals.set(2,"buy bitcoin");
  proposals.set(3,"buy near");
  proposals.set(4,"donate to an ONG");
  onPause();
  logging.log("initialOwner: " + initialOwner);
  storage.set("init", "done");
  return true;
}


//@dev funciona para compra de votos
export function invest(): bool {
  assert(storage.getSome<bool>("pause") == true, "investment time is over");

  const user = registeredUser.contains(context.sender)
    ? registeredUser.getSome(context.sender)
    : false;

  assert(user == false, "user already invested");

  const Deposit: u128 = context.attachedDeposit;

  assert(Deposit <= MaxDeposit, "exceed the maximum deposit amount");
  assert(Deposit >= MinDeposit, "wrong amount sent");

  votesAllowed.set(context.sender, Deposit);
  registeredUser.set(context.sender, true);
  return true;
}

//@dev funciona para votar por una propuestas
//@param _vato:u8 este parametro es para indicar a que propuesta el usuario dara su voto
export function vote(_voto:u8): bool{

  const getVote=getVotesAllowed();

  assert(getVote > u128.from("0"), "does not have enough votes");
  assert(_voto >= 1, "wrong choice");
  assert(_voto <= 4, "wrong choice");

  const NumberOfVotes=getvoteProposal(_voto);

  voteProposal.set(_voto, u128.add(getVote, NumberOfVotes));
  votesAllowed.set(context.sender,u128.from("0"));

  return true;

}

//@dev funciona para consultar al Owner del contrato
export function getOwner(): string {
  return storage.contains("owner")
    ? storage.getSome<string>("owner")
    : "owner does not exist";
}

//@dev funciona para consultar ça cantidad de votos que el usuario posee
export function getVotesAllowed(): u128 {
  return votesAllowed.contains(context.sender)
    ? votesAllowed.getSome(context.sender)
    : u128.from("0");
}

//@dev funciona para consultar la cantidad de votos que la propuesta posee
export function getvoteProposal(_voto:u8): u128 {
  return voteProposal.contains(_voto)
    ? voteProposal.getSome(_voto)
    : u128.from("0");
}

//@dev consultar si el contrato esta pausado
export function getPause(): bool{
  return storage.getSome<bool>("pause");
}

//@dev pausar el contrato
export function pause(): bool{
  assert(context.sender==getOwner(),"access denied");
  storage.set("pause",false);
  return true;
}

//@dev despausar el contrato
export function onPause(): bool{
  assert(context.sender==getOwner(),"access denied");
  storage.set("pause",true);
  return true;
}