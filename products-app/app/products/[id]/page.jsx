"use client";

import { Avatar, Box, Button, Card, CardContent, Grid, Typography, Rating, Divider } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Product() {

    const router = useRouter();
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const getProduct = async () => {
            const res = await fetch(`https://dummyjson.com/products/${id}`);
            const data = await res.json();

            setProduct(data);
            console.log(data);
        }
        getProduct();
    }, [id])

    if (!product) {
        return (
            <div>Loading....</div>
        )
    }

    return (
        <Box sx={{ height: 450, }} mx="auto">
            <Typography>Product Details</Typography>
            <Card>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar src={product.images?.[0]} sx={{ width: 140, height: 100 }}></Avatar>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5">Title : {product.title}</Typography>
                            <Typography><strong>Price : </strong> $ {product.price}</Typography>
                            <Typography><strong>Description : </strong> {product.description}</Typography>
                            <Typography><strong>Category : </strong>  {product.category}</Typography>
                            <Typography><strong>Rating</strong></Typography>
                            <Rating name="read-only" value={product.rating} precision={0.1} readOnly />
                            <Typography><strong>Stock : </strong>{product.stock}</Typography>
                            <Typography><strong>Return Policy : </strong>{product.returnPolicy}</Typography>
                            <Typography><strong>Minimum Order : </strong>{product.minimumOrderQuantity}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }}></Divider>
                    <Typography variant="h6">Dimensions</Typography>
                    <Typography><strong>Width : </strong>{product.dimensions.width}</Typography>
                    <Typography><strong>Height : </strong>{product.dimensions.height}</Typography>
                    <Typography><strong>Depth : </strong>{product.dimensions.depth}</Typography>
                    <Typography><strong>Warranty : </strong>{product.warrantyInformation}</Typography>
                    <Typography><strong>Shipping : </strong>{product.shippingInformation}</Typography>
                    <Typography><strong>Availability : </strong>{product.availabilityStatus}</Typography>
                    <Divider sx={{ my: 2 }}></Divider>
                    <Box mt={3}>
                        <Typography variant="h6">
                            Reviews
                        </Typography>
                        {product?.reviews?.map((review, index) => (
                            <Card key={index} sx={{ mt: 2, p: 2 }}>
                                <Typography variant="subtitle1">
                                    {review.reviewerName}
                                </Typography>
                                <Rating value={review.rating} readOnly size="small" precision={0.1}></Rating>
                                <Typography variant="body2">{review.comment}</Typography>
                                <Typography variant="caption" color="text.secondary">{new Date(review.date).toLocaleDateString()}</Typography>
                            </Card>
                        ))}
                    </Box>
                </CardContent>
            </Card>
            <Button variant="contained" sx={{ mt: 2, mb: 2, ml: 10 }} onClick={() => { router.push('/products') }}>Products</Button>
        </Box>
    )
}