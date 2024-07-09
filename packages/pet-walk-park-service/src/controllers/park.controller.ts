/**
 * 公园 controller
 */
import { Controller, Get } from "routing-controllers";
import { ParkService } from "../services/park.service";

@Controller('/park')
export class ParkController {
    private readonly parkService: ParkService;
    
    constructor() {
        this.parkService = new ParkService();
    }

    @Get('/queryList')
    async queryList() {
        try {
            return await this.parkService.queryList();
        } catch (error) {
            console.error('Error in ParkController:', error);
            throw new Error('Internal Server Error');
        }
    }
}