"use client";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface Project {
  id: string;
  name: string;
  email: string;
  phone: string;
  comments: string;
}

const EmailManagement: React.FC = () => {
  const [emailData, setEmailData] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fungsi untuk mengambil data dari Firestore
  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projects = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setEmailData(projects);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects: ", error);
      setLoading(false);
    }
  };

  // Fungsi untuk menghapus data dari Firestore
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "projects", id));
      setEmailData(emailData.filter((project) => project.id !== id));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    } finally {
      setOpenDialog(false);
    }
  };

  // Buka modal konfirmasi
  const openConfirmationDialog = (id: string) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  // Tutup modal konfirmasi
  const closeConfirmationDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <DashboardCard title="Tracing Klien">
      <>
        <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Table
              aria-label="email table"
              sx={{
                whiteSpace: "nowrap",
                mt: 2,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Email
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Phone
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Comments
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
                {emailData.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={400}>
                        {data.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={400}>
                        {data.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={400}>
                        {data.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={400}>
                        {data.comments}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => openConfirmationDialog(data.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>

        {/* Modal Konfirmasi Hapus */}
        <Dialog
          open={openDialog}
          onClose={closeConfirmationDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete this message?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={closeConfirmationDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => selectedId && handleDelete(selectedId)}
              color="error"
              autoFocus
            >
              Yes, Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </DashboardCard>
  );
};

export default EmailManagement;
