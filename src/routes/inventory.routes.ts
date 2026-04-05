import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";

const router = Router();

router.get('/',     InventoryController.list);
router.get('/:id',  InventoryController.getById);
router.post('/',    InventoryController.create);
router.put('/:id',  InventoryController.update);
router.delete('/:id', InventoryController.delete);

export default router;