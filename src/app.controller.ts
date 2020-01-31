import { Controller, Get } from "@nestjs/common";
import { StateService } from "./state.service";

@Controller()
export class AppController {
  constructor(private readonly stateService: StateService) {}

  @Get("app")
  async newAppState(): Promise<string> {
    return await this.stateService.newAppState();
  }

  @Get("ledger")
  async newLedgerState(): Promise<string> {
    return await this.stateService.newLedgerState();
  }
}
