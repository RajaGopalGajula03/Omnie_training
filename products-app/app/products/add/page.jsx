"use client";
import { Box, Typography, Grid, TextField, Button, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup"

export default function AddProduct() {

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
    const formik = useFormik({
        initialValues: {
            title: '',
            description: "",
            category: '',
            price: "",
            discountPercentage: "",
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
        validationSchema: Yup.object({
            title: Yup.string().required("Title Required"),
            description: Yup.string().required("Description Required"),
            category: Yup.string().required("Category Required"),
            price: Yup.number().typeError("Must be Number").positive("Must be Positive").required("Price is Required"),
            stock: Yup.number().typeError("Must be number").min(0, "Can not be negative").required("Stock is Required"),
            brand: Yup.string().required("Brand is Required"),
            warrantyInformation: Yup.string().required("Warrenty Information Required"),
            shippingInformation: Yup.string().required("Shipping information Required"),
            availabilityStatus: Yup.string().required("Availability Status Required"),
            returnPolicy: Yup.string().required("Return policy Required"),
            rating: Yup.number().typeError("Must be number").min(0).max(5),
            discountPercentage: Yup.number().typeError("Must be number").min(0, "Min 0").max(100, "Max 100"),
            minimumOrderQuantity: Yup.number().typeError("Must be number").min(1, "Minimum 1"),
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
                const res = await fetch("https://dummyjson.com/products/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                console.log("Created Product", data);
                alert("Product Added Successfully");
                router.push("/products")
            }
            catch (error) {
                console.log(error)
            }
        }
    })

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (numberFields.includes(name)) {
            value = value.replace(/[^0-9.]/g, "");
        }

        formik.setFieldValue(name, value);
    };

    return (
        <Box maxWidth={700} mx="auto" mt={4}>
            <Typography variant="h4" mb={2}>Add New Product</Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Category"
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            helperText={formik.touched.category && formik.errors.category}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </TextField>

                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            value={formik.values.price}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Discount Percentage"
                            name="discountPercentage"
                            value={formik.values.discountPercentage}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.discountPercentage && Boolean(formik.errors.discountPercentage)}
                            helperText={formik.touched.discountPercentage && formik.errors.discountPercentage}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Stock"
                            name="stock"
                            value={formik.values.stock}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.stock && Boolean(formik.errors.stock)}
                            helperText={formik.touched.stock && formik.errors.stock}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Brand"
                            name="brand"
                            value={formik.values.brand}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.brand && Boolean(formik.errors.brand)}
                            helperText={formik.touched.brand && formik.errors.brand}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Width"
                            name="width"
                            value={formik.values.width}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.width && Boolean(formik.errors.width)}
                            helperText={formik.touched.width && formik.errors.width}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Height"
                            name="height"
                            value={formik.values.height}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.height && Boolean(formik.errors.height)}
                            helperText={formik.touched.height && formik.errors.height}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Weight"
                            name="weight"
                            value={formik.values.weight}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.weight && Boolean(formik.errors.weight)}
                            helperText={formik.touched.weight && formik.errors.weight}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Depth"
                            name="depth"
                            value={formik.values.depth}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.depth && Boolean(formik.errors.depth)}
                            helperText={formik.touched.depth && formik.errors.depth}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Warranty Info"
                            name="warrantyInformation"
                            value={formik.values.warrantyInformation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.warrantyInformation && Boolean(formik.errors.warrantyInformation)}
                            helperText={formik.touched.warrantyInformation && formik.errors.warrantyInformation}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Shipping Info"
                            name="shippingInformation"
                            value={formik.values.shippingInformation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.shippingInformation && Boolean(formik.errors.shippingInformation)}
                            helperText={formik.touched.shippingInformation && formik.errors.shippingInformation}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Availability"
                            name="availabilityStatus"
                            value={formik.values.availabilityStatus}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.availabilityStatus && Boolean(formik.errors.availabilityStatus)}
                            helperText={formik.touched.availabilityStatus && formik.errors.availabilityStatus}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Return Policy"
                            name="returnPolicy"
                            value={formik.values.returnPolicy}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.returnPolicy && Boolean(formik.errors.returnPolicy)}
                            helperText={formik.touched.returnPolicy && formik.errors.returnPolicy}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Rating"
                            name="rating"
                            value={formik.values.rating}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.rating && Boolean(formik.errors.rating)}
                            helperText={formik.touched.rating && formik.errors.rating}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Minimum Order Quantity"
                            name="minimumOrderQuantity"
                            value={formik.values.minimumOrderQuantity}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.minimumOrderQuantity && Boolean(formik.errors.minimumOrderQuantity)}
                            helperText={formik.touched.minimumOrderQuantity && formik.errors.minimumOrderQuantity}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" fullWidth>
                            Add Product
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}