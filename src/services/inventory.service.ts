import { InventoryRepository } from "../repositories/inventory.repository";
import { CreateItemDto, PaginationQuery, UpdateItemDto } from "../schemas/inventory.schema";
import { AppError } from "../errors/AppError";


export const InventoryService = {
    getItems: async (pagination: PaginationQuery) => {
        const items = await InventoryRepository.findAll(pagination);

        return {
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                count: items.length
            },
            items,
        }
    },     

    getItem: async (id: number) => {
        const result = await InventoryRepository.findById(id);

        if(!result) {
            throw new AppError(404, 'Item not found');
        }
        return  result
    },

    createItem: async (data: CreateItemDto) => {
        const existingItem = await InventoryRepository.findBySku(data.sku)

        if(existingItem) { throw new AppError(409, `SKU ${data.sku} already exists`)};

        const insertId = await InventoryRepository.create(data);

        const result = await InventoryRepository.findById(insertId);

        return result
    },

    updateItem: async (id: number, data: UpdateItemDto) => {
        await InventoryService.getItem(id);

        await InventoryRepository.update(id, data);

        const result = await InventoryRepository.findById(id);

        return result
    },

    deleteItem: async (id: number) => {
        await InventoryService.getItem(id);

        await InventoryRepository.softDelete(id);
    }
}