import { Request, Response } from "express";
import { IProductService } from "../services/interfaces/IProductService";

export class ProductController {

constructor(private productService: IProductService) {}

getProducts = async (req: Request, res: Response) => {
    const products = await this.productService.getProducts();
    res.json(products);
};

getProduct = async (req: Request, res: Response) => {
    try {

        const id = parseInt(req.params.id as string);

        const product = await this.productService.getProduct(id);

        res.json(product);

    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

createProduct = async (req: Request, res: Response) => {
    try {

        const { name, price, stock, category_id } = req.body;

        const allowedFields = ["name", "price","stock","category_id"];
const receivedFields = Object.keys(req.body);
const invalidFields = receivedFields.filter(
    field => !allowedFields.includes(field)
);

if (invalidFields.length > 0) {
return res.status(400).json({
    error: `Campos inválidos: ${invalidFields.join(", ")}`
});
}

        const product = await this.productService.createProduct(
        name,
        price,
        stock,
        category_id
    );

        res.status(201).json(product);

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

updateProduct = async (req: Request, res: Response) => {
    try {

        const id = parseInt(req.params.id as string);
        const { name, price, stock, category_id } = req.body;

        const product = await this.productService.updateProduct(
        id,
        name,
        price,
        stock,
        category_id
    );

    res.json(product);

    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

deleteProduct = async (req: Request, res: Response) => {
    try {

        const id = parseInt(req.params.id as string);

        const product = await this.productService.deleteProduct(id);

    res.json({
        message: "Producto eliminado",
        product
    });

    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

getProductFull = async (req: Request, res: Response) => {
    try {

        const id = parseInt(req.params.id as string);

        const product = await this.productService.getProductWithExternalData(id);

        res.json(product);

    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};
}