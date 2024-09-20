"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation"; 
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../../../../../firebase"; // Import Firebase Storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage untuk upload gambar
import { Timestamp } from "firebase/firestore"; // Untuk menyimpan timestamp
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css"; // Import style untuk ReactQuill

const categories = ["Technology", "Health", "Education", "Lifestyle"]; // Contoh kategori

const AddBlog: React.FC = () => {
  const [newBlog, setNewBlog] = useState<{
    title: string;
    content: string;
    createdBy: string;
    quotes: string;
    tags: string[];
    category: string;
    imageUrl: string;
  }>({
    title: "",
    content: "",
    createdBy: "",
    quotes: "",
    tags: [],
    category: "",
    imageUrl: "",
  });

  const [user, setUser] = useState<any>(null); // State untuk menyimpan user login
  const [image, setImage] = useState<File | null>(null); // State untuk menyimpan image file
  const [isUploading, setIsUploading] = useState(false); // State untuk melacak status upload

  const router = useRouter();
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth") || "");
    if (auth) {
      setUser(auth);
      setNewBlog((prevState) => ({
        ...prevState,
        createdBy: auth.email,
      }));
    }
  }, []);

  // Fungsi untuk menambah blog baru
  const handleAddBlog = async () => {
    try {
      setIsUploading(true);
      let imageUrl = "";
      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image); // Unggah gambar ke Firebase Storage
        imageUrl = await getDownloadURL(imageRef); // Dapatkan URL unduhan gambar
      }

      // Menambahkan blog ke Firestore
      await addDoc(collection(db, "blogs"), {
        ...newBlog,
        imageUrl, // Simpan URL gambar ke Firestore
        createdAt: Timestamp.now(),
      });

      setNewBlog({
        title: "",
        content: "",
        createdBy: user.email,
        quotes: "",
        tags: [],
        category: "",
        imageUrl: "",
      });
      setImage(null); // Reset state gambar
      setIsUploading(false);
      router.push("/");
    } catch (error) {
      console.error("Error adding blog: ", error);
      setIsUploading(false);
    }
  };

  // Fungsi untuk menangani upload gambar
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file); 
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Add New Blog
      </Typography>

      <TextField
        fullWidth
        label="Title"
        variant="outlined"
        value={newBlog.title}
        onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Quotes"
        variant="outlined"
        value={newBlog.quotes}
        onChange={(e) => setNewBlog({ ...newBlog, quotes: e.target.value })}
        sx={{ mb: 2 }}
      />

      {/* WYSIWYG Editor untuk konten */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Content
      </Typography>
      <ReactQuill
        theme="snow"
        value={newBlog.content}
        onChange={(content) => setNewBlog({ ...newBlog, content })}
        style={{ height: "200px", marginBottom: "30px" }}
      />

      {/* Multiple Tags input */}
      <Autocomplete
        multiple
        id="tags-filled"
        options={[]}
        freeSolo
        value={newBlog.tags}
        onChange={(event, newValue) => {
          setNewBlog({ ...newBlog, tags: newValue });
        }}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
              key={index}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Tags"
            placeholder="Add tags"
            sx={{ mb: 2 }}
          />
        )}
      />

      {/* Pilihan kategori */}
      <TextField
        fullWidth
        select
        label="Category"
        variant="outlined"
        value={newBlog.category}
        onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
        sx={{ mb: 2 }}
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>

      {/* Upload gambar */}
      <Box sx={{ mb: 4 }}>
        <Button variant="contained" component="label" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Image"}
          <input
            type="file"
            hidden
            onChange={handleImageUpload} 
            accept="image/*"
          />
        </Button>
        {image && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Selected Image: {image.name}
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddBlog}
        disabled={isUploading}
      >
        {isUploading ? "Submitting..." : "Add Blog"}
      </Button>
    </Box>
  );
};

export default AddBlog;
