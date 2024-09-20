"use client";
import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useRouter } from "next/navigation"; // Untuk navigasi
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../../firebase"; // Pastikan jalur file benar
import { Timestamp } from "firebase/firestore"; // Untuk menyimpan timestamp
import { AddCircle, RemoveCircle } from "@mui/icons-material"; // Import icons untuk menambah dan menghapus

const AddInquiry: React.FC = () => {
  const [newInquiry, setNewInquiry] = useState({
    name: "",
    company: "",
    nomor: "",
    jenisQuotation: "",
    status: "quotation",
  });

  // State untuk item pada tabel
  const [items, setItems] = useState([
    { quantity: "", description: "", pricePerUnit: "", totalPrice: "" },
  ]);

  // State untuk terms and conditions
  const [terms, setTerms] = useState([
    "DP Minimal 50%",
    "Penawaran ini berlaku 2 (dua) minggu",
  ]);

  const router = useRouter();

  // Fungsi untuk menambah inquiry baru
  const handleAddInquiry = async () => {
    try {
      const inquiryDoc = await addDoc(collection(db, "inquiries"), {
        ...newInquiry,
        items,
        terms,
        createdAt: Timestamp.now(),
      });

      setNewInquiry({
        name: "",
        company: "",
        nomor: "",
        jenisQuotation: "",
        status: "quotation",
      });
      setItems([
        { quantity: "", description: "", pricePerUnit: "", totalPrice: "" },
      ]);
      setTerms(["DP Minimal 50%", "Penawaran ini berlaku 2 (dua) minggu"]);

      router.push("/inquiries"); // Kembali ke halaman inquiry list setelah menambahkan
    } catch (error) {
      console.error("Error adding inquiry: ", error);
    }
  };

  // Fungsi untuk menambah item
  const handleAddItem = () => {
    setItems([
      ...items,
      { quantity: "", description: "", pricePerUnit: "", totalPrice: "" },
    ]);
  };

  // Fungsi untuk menghapus item
  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleItemChange = (
    index: number,
    field: keyof (typeof items)[0],
    value: string
  ) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  // Fungsi untuk menambah term
  const handleAddTerm = () => {
    setTerms([...terms, ""]);
  };

  // Fungsi untuk menghapus term
  const handleRemoveTerm = (index: number) => {
    const updatedTerms = terms.filter((_, i) => i !== index);
    setTerms(updatedTerms);
  };

  // Fungsi untuk mengupdate term
  const handleTermChange = (index: number, value: string) => {
    const updatedTerms = [...terms];
    updatedTerms[index] = value;
    setTerms(updatedTerms);
  };

  return (
    <>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Add New Inquiry
        </Typography>

        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={newInquiry.name}
          onChange={(e) =>
            setNewInquiry({ ...newInquiry, name: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Company"
          variant="outlined"
          value={newInquiry.company}
          onChange={(e) =>
            setNewInquiry({ ...newInquiry, company: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Document Number"
          variant="outlined"
          value={newInquiry.nomor}
          onChange={(e) =>
            setNewInquiry({ ...newInquiry, nomor: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        {/* Select untuk memilih jenis quotation */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Jenis Quotation</InputLabel>
          <Select
            value={newInquiry.jenisQuotation}
            label="Jenis Quotation"
            onChange={(e) =>
              setNewInquiry({ ...newInquiry, jenisQuotation: e.target.value })
            }
          >
            <MenuItem value="Rental Barang">Rental Barang</MenuItem>
            <MenuItem value="Pengadaan Barang">Pengadaan Barang</MenuItem>
            <MenuItem value="Service Barang">Service Barang</MenuItem>
            <MenuItem value="Pengerjaan Onsite">Pengerjaan Onsite</MenuItem>
          </Select>
        </FormControl>

        {/* Input untuk item di tabel */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Items
        </Typography>
        {items.map((item, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <TextField
              label="Quantity"
              variant="outlined"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              sx={{ mr: 2 }}
            />
            <TextField
              label="Description"
              variant="outlined"
              value={item.description}
              onChange={(e) =>
                handleItemChange(index, "description", e.target.value)
              }
              sx={{ mr: 2 }}
            />
            <TextField
              label="Price per Unit (Rp)"
              variant="outlined"
              value={item.pricePerUnit}
              onChange={(e) =>
                handleItemChange(index, "pricePerUnit", e.target.value)
              }
              sx={{ mr: 2 }}
            />
            <TextField
              label="Total Price (Rp)"
              variant="outlined"
              value={item.totalPrice}
              onChange={(e) =>
                handleItemChange(index, "totalPrice", e.target.value)
              }
              sx={{ mr: 2 }}
            />
            {items.length > 1 && (
              <IconButton color="error" onClick={() => handleRemoveItem(index)}>
                <RemoveCircle />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddCircle />}
          onClick={handleAddItem}
        >
          Add Item
        </Button>

        {/* Input untuk syarat dan ketentuan */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Terms and Conditions
        </Typography>
        {terms.map((term, index) => (
          <Box
            key={index}
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <TextField
              fullWidth
              label={`Term ${index + 1}`}
              variant="outlined"
              value={term}
              onChange={(e) => handleTermChange(index, e.target.value)}
            />
            {terms.length > 1 && (
              <IconButton color="error" onClick={() => handleRemoveTerm(index)}>
                <RemoveCircle />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddCircle />}
          onClick={handleAddTerm}
        >
          Add Term
        </Button>
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={{ ml: 4 }}
        onClick={handleAddInquiry}
      >
        Add Inquiry
      </Button>
    </>
  );
};

export default AddInquiry;
