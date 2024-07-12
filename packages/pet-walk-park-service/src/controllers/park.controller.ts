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
            const parks = await this.parkService.queryList();
            return { data: parks,
                code: '0',
                message: '',
                success: true,
             };
        } catch (error) {
            console.error('Error in ParkController:', error);
            // throw new Error('Internal Server Error');
            return {
                code: '-1',
                message: '出错了',
                success: false,
             };
        }
    }
}