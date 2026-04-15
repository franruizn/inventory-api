import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";
import { authenticateToken } from "../middleware/authenticate";
import { CreateItemSchema, PaginationSchema, UpdateItemSchema } from "../schemas/inventory.schema";
import { validate } from "../middleware/validate";

const router = Router();

router.get('/', authenticateToken, validate(PaginationSchema, 'query'), InventoryController.list);
router.get('/:id', authenticateToken, InventoryController.getById);
router.post('/', authenticateToken, validate(CreateItemSchema), InventoryController.create);
router.put('/:id', authenticateToken, validate(UpdateItemSchema), InventoryController.update);
router.delete('/:id', authenticateToken, InventoryController.remove);

export default router;