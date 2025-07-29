// app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    healthCheck(){
        console.log("Backend running")
    }
}