import { useState, useEffect } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function Home() {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    fetch("https:auth-rg69.onrender.com/api/products/private/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleClick(id) {
    const isDelate = confirm(
      "Rostdan ham ushbu ma'lumotni o'chirmoqchimisiz ?"
    );
    if (isDelate) {
      setIsloading(true)
      fetch(`https:auth-rg69.onrender.com/api/products/private/all${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setIsloading(false)
          if (
            data.message == "Mahsulot muvaffaqiyatli o'chirildi" ||
            data.message == "Mahsulot topilmadi"
          ) {
            let copied = JSON.parse(JSON.stringify(products));
            copied = copied.filter((pr) => {
              return pr.id != id;
            });
            setProducts(copied);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {product.name}
              </TableCell>
              <TableCell align="right">{product.price}</TableCell>
              <TableCell align="right">{product.status}</TableCell>
              <TableCell align="right">{product.description}</TableCell>
              <TableCell align="right">
                {isLoading && <p>{"O'chirilmoqda"}</p>}
                {!isLoading && (
                  <>
                    <ModeEditIcon></ModeEditIcon>
                    <DeleteOutlineIcon
                      onclick={()=>{handleClick(product.description)}}
                    ></DeleteOutlineIcon>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Home;
