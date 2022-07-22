import { DrinkResponse } from '../../index';
import DrinkBase from './DrinkBase';

class Controller {
    private readonly controllerName: string;
    public readonly drink: DrinkBase;
    constructor(DrinkRes: DrinkResponse) {
        if(!DrinkRes) return;
        this.controllerName = '';
        this.drink = DrinkRes.drink;
    }
}

export {
    Controller
};
