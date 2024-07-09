/**
 * 公园 controller
 */
import { Controller, Get } from "routing-controllers";
import { ParkService } from "../services/park.service";

@Controller('/park')
export class ParkController {
    parkService
    constructor() {
        this.parkService = new ParkService();
    }

    @Get('/queryList')
    queryList() {
        return this.parkService.queryList();
    }
}