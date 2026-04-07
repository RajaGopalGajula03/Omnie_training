"use client";

import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, CardMedia, Grid, TextField, Typography, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";


export default function Products() {

    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(8);
    const [sortBy, setSortBy] = useState("");
    const [order, setOrder] = useState("");
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");


    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await fetch("https://dummyjson.com/products/categories");
                const data = await res.json();
                console.log(data);
                setCategories(data);
            }
            catch (error) {
                console.log(error)
            }
        }
        getCategories();
    }, [])


    useEffect(() => {
        const getProducts = async () => {
            const skip = page * limit;

            let baseUrl = "https://dummyjson.com/products";


            if (search) {
                baseUrl = `https://dummyjson.com/products/search?q=${search}`
            }
            else if (category) {
                baseUrl = `https://dummyjson.com/products/category/${category}`;
            }



            const separator = baseUrl.includes("?") ? "&" : "?";

            let url = `${baseUrl}${separator}limit=${limit}&skip=${skip}&select=title,price,description,images`

            if (sortBy && order) {
                url += `&sortBy=${sortBy}&order=${order}`;
            }

            console.log("final URL", url);

            const res = await fetch(url);
            const data = await res.json();

            console.log(data.products);
            setProducts(data.products);
            setTotal(data.total);
        }
        getProducts();
    }, [search, page, limit, sortBy, order, category])

    const handleDelete = async(id)=>{
        try{
            const res = await fetch(`https://dummyjson.com/products/${id}`,{
                method:'DELETE',
            });
            const data = await res.json();
            console.log("Deleted : ",data);
            setProducts((prev)=> prev.filter((p)=>p.id !== id));
        }
        catch(err)
        {
            console.log(err);
        }
    }

    return (
        <Box maxWidth="100%" p={2}>
            <Box display="flex" justifyContent="space-between" height="40px" mb={2}>
                <Typography variant="h4" mb={2}>Products</Typography>
                <Button variant="contained" size="small" onClick={() => router.push("/products/add")}>Add Product</Button>
            </Box>
            <TextField
                fullWidth
                label="Search Products..."
                variant="outlined"
                margin="normal"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            >
            </TextField>
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    select
                    label="Sort By"
                    value={sortBy}
                    onChange={(e) => {
                        setSortBy(e.target.value);
                        setPage(0);
                    }}
                    size="small"
                    sx={{ width: 150 }}
                >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="price">Price</MenuItem>
                </TextField>
                <TextField
                    select
                    label="Order"
                    value={order}
                    onChange={(e) => {
                        setOrder(e.target.value);
                        setPage(0);
                    }}
                    size="small"
                    sx={{ width: 150 }}
                >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                </TextField>
                <TextField
                    select
                    label="Select Category"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(0);
                    }}
                    size="small"
                    sx={{ width: 180 }}
                >
                    <MenuItem value="">All</MenuItem>
                    {categories.map((cat) => (
                        <MenuItem key={cat.slug} value={cat.slug} >{cat.name}</MenuItem>
                    ))}
                </TextField>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography>Rows per page:</Typography>

                <TextField
                    select
                    value={limit}
                    onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(0); //
                    }}
                    size="small"
                    sx={{ width: 120 }}
                >
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={12}>12</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                </TextField>
            </Box>
            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={3} key={product.id} display="flex">
                        <Card sx={{ width: '100%', display: "flex", flexDirection: 'column' }}>
                            <CardMedia
                                sx={{ height: 150, width: 200 }}
                                image={product.images[0]}
                                title={product.title}
                            >
                            </CardMedia>
                            <CardContent>
                                <Typography variant="h5">Title : {product.title}</Typography>
                                <Typography>Price : <span style={{ color: 'green', fontWeight: 'bold' }}>${product.price}</span></Typography>
                                <Typography variant="body2"
                                    sx={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word"
                                    }}
                                > {product.description}</Typography>
                            </CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto' }} mb={1} gap={2}>
                                <Button variant="contained" onClick={() => { router.push(`/products/${product.id}`) }}>View</Button>
                                <Button variant="contained" color="warning" onClick={() => { router.push(`/products/${product.id}/edit`) }}>Edit</Button>
                                <Button variant="contained" color="error" onClick={() => handleDelete(product.id)}>Delete</Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box display="flex" justifyContent="center" gap={2} mt={3}>
                <Button variant="contained" disabled={page === 0} onClick={() => setPage((prev) => prev - 1)}>Previous</Button>
                <Typography alignSelf="center">Page : {page + 1}</Typography>
                <Button variant="contained" disabled={(page + 1) * limit >= total} onClick={() => setPage((prev) => prev + 1)}>Next</Button>
            </Box>
        </Box>
    )
}