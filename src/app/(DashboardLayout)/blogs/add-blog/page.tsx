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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage for image upload
import { Timestamp } from "firebase/firestore"; // For storing timestamp
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css"; // Import style for ReactQuill

const categories = ["Technology", "Health", "Education", "Lifestyle"]; // Example categories

const AddBlog: React.FC = () => {
  const [newBlog, setNewBlog] = useState<{
    title: string;
    link: string;
    content: string;
    createdBy: string;
    quotes: string;
    tags: string[];
    category: string;
    imageUrl: string;
  }>({
    title: "",
    link: "",
    content: "",
    createdBy: "",
    quotes: "",
    tags: [],
    category: "",
    imageUrl: "",
  });

  const [user, setUser] = useState<any>(null); // State to store logged in user
  const [image, setImage] = useState<File | null>(null); // State to store image file
  const [isUploading, setIsUploading] = useState(false); // State for tracking upload status

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

  // Function to add a new blog
  const handleAddBlog = async () => {
    try {
      setIsUploading(true);
      let imageUrl = "";
      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image); // Upload image to Firebase Storage
        imageUrl = await getDownloadURL(imageRef); // Get download URL for image
      }

      // Add blog to Firestore
      await addDoc(collection(db, "blogs"), {
        ...newBlog,
        imageUrl, // Save image URL to Firestore
        createdAt: Timestamp.now(),
      });

      setNewBlog({
        title: "",
        link: "",
        content: "",
        createdBy: user.email,
        quotes: "",
        tags: [],
        category: "",
        imageUrl: "",
      });
      setImage(null); // Reset image state
      setIsUploading(false);
      router.push("/");
    } catch (error) {
      console.error("Error adding blog: ", error);
      setIsUploading(false);
    }
  };

  // Function to handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
    }
  };

  // ReactQuill modules configuration for custom toolbar
  const quillModules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }], // Custom Headers and Fonts
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      ["bold", "italic", "underline", "strike"], // Styling
      [{ align: [] }], // Alignment
      [{ script: "sub" }, { script: "super" }], // Subscript and Superscript
      ["blockquote", "code-block"], // Blockquotes and Code blocks
      [{ color: [] }, { background: [] }], // Text color and Background color
      ["link", "image", "video"], // Links, Images, and Videos
      ["clean"], // Remove formatting
    ],
  };

  // Supported formats in ReactQuill editor
  const quillFormats = [
    "header",
    "font",
    "list",
    "bullet",
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "script",
    "blockquote",
    "code-block",
    "color",
    "background",
    "link",
    "image",
    "video",
  ];

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
        onChange={(e) => {
          const updatedTitle = e.target.value;
          const sanitizedLink = updatedTitle.replace(/\s+/g, "-");

          setNewBlog({
            ...newBlog,
            title: updatedTitle,
            link: sanitizedLink.toLowerCase(),
          });
        }}
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

      {/* WYSIWYG Editor for content */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Content
      </Typography>
      <ReactQuill
        theme="snow"
        value={newBlog.content}
        onChange={(content) => setNewBlog({ ...newBlog, content })}
        style={{ height: "200px", marginBottom: "50px" }}
        modules={quillModules} // Set custom toolbar options
        formats={quillFormats} // Set allowed formats
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

      {/* Category selection */}
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

      {/* Image upload */}
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
