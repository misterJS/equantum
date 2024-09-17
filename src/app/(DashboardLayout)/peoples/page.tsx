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
} from "@mui/material";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
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

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <DashboardCard title="Tracing Klien">
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
                {/* <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Action
                  </Typography>
                </TableCell> */}
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
                  {/* <TableCell align="center">
                    Add actions if needed
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </DashboardCard>
  );
};

export default EmailManagement;
