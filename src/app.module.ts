import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { StateService } from "./state.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { XState } from "./xstate.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "misha",
      database: "xstate",
      entities: [XState],
      synchronize: true
    }),
    TypeOrmModule.forFeature([XState])
  ],
  controllers: [AppController],
  providers: [StateService]
})
export class AppModule {}
