"use client";
import {
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Delete } from "@mui/icons-material";
import { Timestamp } from "firebase/firestore";

interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  createdBy: string;
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fungsi untuk mengambil data dari Firestore
  const fetchBlogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "blogs"));
      const blogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Blog[];
      setBlogs(blogs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs: ", error);
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error("Error deleting blog: ", error);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Blogs List
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href="/blogs/add-blog"
            >
              Add New Blog
            </Button>
          </Box>
          <Table aria-label="blog table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Title
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Created At
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Created By
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={400}>
                      {blog.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={400}>
                      {formatDate(blog.createdAt)} {/* Tampilkan timestamp */}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={400}>
                      {blog.createdBy} {/* Tampilkan siapa yang membuat blog */}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteBlog(blog.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Box>
  );
};

export default BlogList;
