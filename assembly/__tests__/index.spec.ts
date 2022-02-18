import {
  init,
  getOwner,
  getVotesAllowed,
  invest,
  vote,
  getvoteProposal,
  pause,
  getPause,
  onPause

} from "../index";

import {VMContext, u128 } from "near-sdk-as";

describe("index", () => {
  beforeEach(() => {
    init();
  });


  it('initialize contract', () => {
    init();
  });

  it('function invest', () => {
    VMContext.setAttached_deposit(u128.from("200000000000000000000000"));
    expect(invest()).toBe(true);
  });

  it("verify owner", () => {
    expect(getOwner()).toBe("bob");
  });

  it("pause", () => {
    expect(pause()).toBe(true);
    expect(getPause()).toBe(false);
  });

  it("OnPause", () => {
    expect(onPause()).toBe(true);
    expect(getPause()).toBe(true);
  });

  it("invest and vote", () => {
    VMContext.setAttached_deposit(u128.from("200000000000000000000000"));
    expect(invest()).toBe(true);
    expect(vote(1)).toBe(true);
    expect(getvoteProposal(1)).toBe(u128.from("200000000000000000000000"));
    expect(getVotesAllowed()).toBe(u128.from("0"));
  });
});
