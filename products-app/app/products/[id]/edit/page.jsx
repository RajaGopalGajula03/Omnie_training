"use client";

import { Box, Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import * as Yup from "yup";


export default function EditProduct() {
    const { id } = useParams();
    const router = useRouter();

    const categories = [
        "beauty",
        "fragrances",
        "furniture",
        "groceries",
        "home-decoration",
        "kitchen-accessories",
        "laptops",
        "mens-shirts",
        "mens-shoes",
        "mens-watches",
        "mobile-accessories",
        "motorcycle",
        "skin-care", "smartphones",
        "sports-accessories",
        "sunglasses",
        "tablets",
        "tops",
        "vehicle",
        "womens-bags",
        "womens-dresses",
        "womens-jewellery",
        "womens-shoes",
        "womens-watches",
    ];
    const numberFields = [
        "price",
        "discountPercentage",
        "rating",
        "stock",
        "weight",
        "width",
        "height",
        "depth",
        "minimumOrderQuantity"
    ];

    const fields = [
        { name: "title", label: "Title" },
        { name: "description", label: "Description", fullWidth: true },
        { name: "price", label: "Price" },
        { name: "discountPercentage", label: "Discount %" },
        { name: "rating", label: "Rating" },
        { name: "stock", label: "Stock" },
        { name: "brand", label: "Brand" },
        { name: "weight", label: "Weight" },
        { name: "width", label: "Width" },
        { name: "height", label: "Height" },
        { name: "depth", label: "Depth" },
        { name: "warrantyInformation", label: "Warranty Info" },
        { name: "shippingInformation", label: "Shipping Info" },
        { name: "availabilityStatus", label: "Availability" },
        { name: "returnPolicy", label: "Return Policy" },
        { name: "minimumOrderQuantity", label: "Min Order Qty" },
    ];

    const formik = useFormik({
        initialValues: {
            title: '',
            description: "",
            category: '',
            price: "",
            discountPercentage: '',
            rating: '',
            stock: '',
            brand: '',
            weight: '',
            width: '',
            height: '',
            depth: '',
            warrantyInformation: '',
            shippingInformation: '',
            availabilityStatus: '',
            returnPolicy: '',
            minimumOrderQuantity: '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            description: Yup.string().required("Description is required"),
            category: Yup.string().required("Category Required"),
            price: Yup.number().typeError("Price must be number").required("Price required"),
            stock: Yup.number().typeError("Stock must be number").required("Stock required"),
            brand: Yup.string().required("Brand Required"),
            warrantyInformation: Yup.string().required("Warrenty details required"),
            shippingInformation: Yup.string().required("Shipping Details Required"),
            returnPolicy: Yup.string().required("Return Details Required"),
        }),
        onSubmit: async (values) => {
            const payload = {
                ...values,
                dimensions: {
                    width: Number(values.width),
                    height: Number(values.height),
                    depth: Number(values.depth),
                }
            };

            try {
                await fetch(`https://dummyjson.com/products/${id}`, {
                    method: "PUT",
                    headers: { 'Content-Type': "application/json" },
                    body: JSON.stringify(payload),
                })

                router.push("/products");
            }
            catch (error) {
                console.log(error)
            }
        }
    })

    useEffect(() => {
        if (!id) return;

        const fetchProducts = async () => {
            try {
                const res = await fetch(`https://dummyjson.com/products/${id}`);
                const data = await res.json();

                console.log(data);
                formik.setValues({
                    title: data.title || '',
                    description: data.description || '',
                    category: data.category || "",
                    price: data.price || "",
                    discountPercentage: data.discountPercentage || '',
                    rating: data.rating || '',
                    stock: data.stock || '',
                    brand: data.brand || '',
                    weight: data.weight || '',
                    width: data.dimensions?.width || '',
                    height: data.dimensions?.height || '',
                    depth: data.dimensions?.depth || '',
                    warrantyInformation: data.warrantyInformation || '',
                    shippingInformation: data.shippingInformation || '',
                    availabilityStatus: data.availabilityStatus || '',
                    returnPolicy: data.returnPolicy || '',
                    minimumOrderQuantity: data.minimumOrderQuantity || '',
                })
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchProducts();
    }, [id]);

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (numberFields.includes(name)) {
            value = value.replace(/[^0-9.]/g, "");
        }
        formik.setFieldValue(name, value);
    }

    const renderField = (field) => {
        const isNumber = numberFields.includes(field.name);

        return (
            <Grid item xs={field.fullWidth ? 12 : 6} key={field.name}>
                <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    value={formik.values[field.name]}
                    onChange={isNumber ? handleChange : formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                    helperText={formik.touched[field.name] && formik.errors[field.name]}
                ></TextField>
            </Grid>
        )
    }
    return (
        <Box maxWidth={700} mx="auto" mt={4}>
            <Typography variant="h4" mb={2}>Edit Product Details</Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Category"
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.category &&Boolean(formik.errors.category)}
                            helperText={formik.touched.category &&formik.errors.category}
                        >
                            {categories.map((cat)=>(
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    {fields.map(renderField)}
                    <Grid item xs={12}>
                        <Button variant="contained" type="submit" fullWidth>Update Product</Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}