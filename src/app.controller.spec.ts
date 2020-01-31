import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { StateService } from "./state.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [StateService]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Hello World!"', () => {
      expect(appController.newState()).toBe("Hello World!");
    });
  });
});
