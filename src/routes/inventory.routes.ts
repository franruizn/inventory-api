import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";
import { authenticateToken } from "../middleware/authenticate";

const router = Router();

router.get('/', authenticateToken, InventoryController.list);
router.get('/:id', authenticateToken, InventoryController.getById);
router.post('/', authenticateToken, InventoryController.create);
router.put('/:id', authenticateToken, InventoryController.update);
router.delete('/:id', authenticateToken, InventoryController.remove);

export default router;