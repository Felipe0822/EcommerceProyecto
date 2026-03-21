import { Request, Response } from "express";
import { ICategoryService } from "../services/interfaces/ICategoryService";

export class CategoryController {

constructor(
    private readonly categoryService: ICategoryService
    ){ }


getCategories = async (req: Request, res: Response) => {
    const categories = await this.categoryService.getCategories();
    res.json(categories);
};

getCategory = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
            }   

        const category = await this.categoryService.getCategory(id);

        res.json(category);

    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

createCategory = async (req: Request, res: Response) => {
    try {
    const { name, description } = req.body;

const allowedFields = ["name", "description"];
const receivedFields = Object.keys(req.body);
const invalidFields = receivedFields.filter(
    field => !allowedFields.includes(field)
);

if (invalidFields.length > 0) {
return res.status(400).json({
    error: `Campos inválidos: ${invalidFields.join(", ")}`
});
}

    const category = await this.categoryService.createCategory(name, description);

    res.status(201).json(category);

    } catch (error: any) {
    res.status(400).json({ error: error.message });
    }
};

updateCategory = async (req: Request, res: Response) => {
    try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
}
    const { name, description } = req.body;

    const category = await this.categoryService.updateCategory(id, name, description);

    res.json(category);

    } catch (error: any) {
    res.status(404).json({ error: error.message });
    }
};

deleteCategory = async (req: Request, res: Response) => {
    try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
}

    const category = await this.categoryService.deleteCategory(id);

    res.json({
        message: "Categoría eliminada",
        category
    });

    } catch (error: any) {
    res.status(404).json({ error: error.message });
    }
};
}