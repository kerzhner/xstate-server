import { Injectable } from "@nestjs/common";
import { interpret, Machine } from "xstate";
import { InjectRepository } from "@nestjs/typeorm";
import { XState } from "./xstate.entity";
import { Repository } from "typeorm";

@Injectable()
export class StateService {
  static ledgerFundingStates = {
    initial: "ledgerPrefund",
    states: {
      ledgerPrefund: {
        on: {
          NEW_LEDGER_STATE: "ledgerPostfund"
        }
      },
      ledgerPostfund: {}
    }
  };

  static appChannelMachine = Machine({
    key: "appChannel",
    initial: "appPrefund",
    states: {
      appPrefund: {
        on: {
          NEW_APP_STATE: "ledgerOpen"
        }
      },
      ledgerOpen: {
        on: {
          NEW_APP_STATE: "appPostfund"
        },
        ...StateService.ledgerFundingStates
      },
      appPostfund: {}
    }
  });

  /*static stateService = interpret(StateService.appChannelMachine)
    .onTransition(state => console.log(state.value))
    .start();*/

  constructor(
    @InjectRepository(XState)
    private readonly xstateRepository: Repository<XState>
  ) {}

  async newState(event: string): Promise<string> {
    const sStoredState:
      | {
          state: string;
          id: number;
        }
      | undefined = await this.xstateRepository
      .createQueryBuilder()
      .select(["state", "MAX(id)"])
      .groupBy("state")
      .getRawOne();
    let storedState = undefined;
    if (sStoredState) {
      storedState = JSON.parse(sStoredState.state);
    }
    console.log(storedState);

    const stateService = interpret(StateService.appChannelMachine)
      .onTransition(state => console.log(state.value))
      .start(storedState);
    const latestState = stateService.send(event);
    const xStateEntity = new XState();
    xStateEntity.state = JSON.stringify(latestState);
    await this.xstateRepository.save(xStateEntity);
    return JSON.stringify(latestState);
  }

  async newAppState(): Promise<string> {
    return this.newState("NEW_APP_STATE");
  }

  async newLedgerState(): Promise<string> {
    return this.newState("NEW_LEDGER_STATE");
  }
}
