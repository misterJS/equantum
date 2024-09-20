"use client";
import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../../firebase"; // Import Firestore
import { AddCircle, RemoveCircle } from "@mui/icons-material"; // Import icons untuk menambah dan menghapus

const EditInquiry: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [inquiry, setInquiry] = useState<any>(null);
  const [items, setItems] = useState([
    { quantity: "", description: "", pricePerUnit: "", totalPrice: "" },
  ]);
  const [terms, setTerms] = useState([
    "DP Minimal 50%",
    "Penawaran ini berlaku 2 (dua) minggu",
  ]);
  const router = useRouter();
  const { id } = useParams<any>();

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const inquiryDoc = await getDoc(doc(db, "inquiries", id));
        if (inquiryDoc.exists()) {
          const inquiryData = inquiryDoc.data();
          setInquiry(inquiryData);
          setItems(
            inquiryData.items || [
              {
                quantity: "",
                description: "",
                pricePerUnit: "",
                totalPrice: "",
              },
            ]
          );
          setTerms(
            inquiryData.terms || [
              "DP Minimal 50%",
              "Penawaran ini berlaku 2 (dua) minggu",
            ]
          );
        } else {
          console.error("Inquiry not found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inquiry: ", error);
        setLoading(false);
      }
    };
    fetchInquiry();
  }, [id]);

  // Fungsi untuk memperbarui inquiry di Firestore
  const handleUpdateInquiry = async () => {
    try {
      const inquiryRef = doc(db, "inquiries", id);
      const inquiryDoc = await getDoc(inquiryRef);

      if (inquiryDoc.data()?.status === "quotation") {
        setInquiry({ ...inquiry, status: "invoice" });
      }
      
      await updateDoc(inquiryRef, {
        ...inquiry,
        items,
        terms,
      });
      router.push("/inquiries"); // Kembali ke halaman daftar inquiry setelah update
    } catch (error) {
      console.error("Error updating inquiry: ", error);
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

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Edit Inquiry
        </Typography>

        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={inquiry.name}
          onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Company"
          variant="outlined"
          value={inquiry.company}
          onChange={(e) => setInquiry({ ...inquiry, company: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Document Number"
          variant="outlined"
          value={inquiry.nomor}
          onChange={(e) => setInquiry({ ...inquiry, nomor: e.target.value })}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Jenis Quotation</InputLabel>
          <Select
            value={inquiry.jenisQuotation}
            label="Jenis Quotation"
            onChange={(e) =>
              setInquiry({ ...inquiry, jenisQuotation: e.target.value })
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
        onClick={handleUpdateInquiry}
      >
        Save Changes
      </Button>
    </>
  );
};

export default EditInquiry;
