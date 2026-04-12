import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { CreateItemDto, UpdateItemDto, PaginationQuery } from '../schemas/inventory.schema';

export const InventoryController = {
    list: async (req: Request, res: Response, next: NextFunction): Promise <void> => {
        try {
            const items = await InventoryService.getItems(req.query as any as PaginationQuery);
            res.json({data: items});
        } catch (err) {
            next(err);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction): Promise <void> => {
        try {
            const item = await InventoryService.getItem(Number(req.params.id));
            res.json({data: item})
        } catch (err) {
            next(err);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction): Promise <void> => {
        try {
            const item = await InventoryService.createItem((req.body as CreateItemDto));
            res.status(201).json({data: item});
        } catch (err) {
            next(err);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction): Promise <void> => {
        try {
            const item = await InventoryService.updateItem(Number(req.params.id), (req.body as UpdateItemDto));
            res.json({data: item})
        } catch (err) {
            next(err);
        }
    },

    remove: async (req: Request, res: Response, next: NextFunction): Promise <void>  => {
        try{
            await InventoryService.deleteItem(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}