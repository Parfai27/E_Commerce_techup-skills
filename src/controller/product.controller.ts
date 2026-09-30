import { Express } from "express";
import { products } from "../model/product.model";
import { Request ,Response } from "express";

export const getProduct=(req:Request, res:Response)=>{
    res.status(200).json(products)
}

export const  getProductById=(req:Request , res:Response)=>{
      const  id =Number(req.params.id)
      const product=products.find((product)=>product.id===id)
      if(!product){
        return res.status(404).json({message:"Product Not found"})
      }
      res.status(200).json(product)

}

export const addProduct=(req:Request ,res:Response)=>{
    const {name,category,price} = req.body
    if(!name || !category || !price){
        return res.status(400).json({message:"name , category and price are required"})
    }
     
    const  lastProduct=products.at(-1)
    const  newProduct={
        id: lastProduct ? lastProduct.id+1 :1, // auto increment
        name,
        category,
        price
    }
    products.push(newProduct)
    return res.status(201).json({message:"Product added ", product:newProduct})
}

// update   the product

export const  updateProduct= (req:Request ,res:Response)=>{
     const id = Number (req.params.id)
     const product=products.find((product)=>product.id===id)
    
     if (!product){
        return res.status(404).json({message:"product notfound"})
     }
   const {name,category,price}= req.body
    product.name=name ?? product.name
    product.category=category ?? product.category
    product.price=price ?? product.price

    res.status(200).json({message:"Product Updated successfull",product:product})
    
}


export const  deleteProduct=(req:Request , res:Response)=>{
     const id = Number(req.params.id)
     const productIndex=products.findIndex((product)=>product.id===id)

     if(productIndex===-1){
        return res.status(404).json({message:"product is not Found"})
     }
   
     const  deleteProdu=products.splice(productIndex,1)
     res.status(200).json({message:"Product delete Successfully", product:deleteProdu})

}