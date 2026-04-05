import { Router } from "express";
import { InventoryService } from "../services/inventory.service";
import { validate } from "../middleware/validate";
import { CreateItemSchema, PaginationSchema, UpdateItemSchema } from "../schemas/inventory.schema";

const router = Router();

router.get('/', validate(PaginationSchema, 'query'), InventoryService.getItems)
router.get('/:id', InventoryService.getItem)
router.post('/', validate(CreateItemSchema), InventoryService.createItem)
router.put('/:id', validate(UpdateItemSchema), InventoryService.deleteItem)

export default router;