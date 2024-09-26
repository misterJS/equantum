"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation"; // Untuk navigasi
import { db } from "../../../../firebase";
import jsPDF from "jspdf";
require('jspdf-autotable');

interface Inquiry {
  id: string;
  name: string;
  nomor: string;
  jenisQuotation: string;
  company: string;
  status: string;
  createdAt: any | Date;
  items: Array<{
    quantity: string;
    description: string;
    pricePerUnit: string;
    totalPrice: string;
  }>;
  terms: string[];
}

const InquiryList: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // Hook untuk navigasi

  const fetchInquiries = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "inquiries"));
      const inquiriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Inquiry[];
      setInquiries(inquiriesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching inquiries: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Fungsi untuk generate PDF menggunakan jsPDF
  const generatePDF = (inquiry: Inquiry) => {
    const doc = new jsPDF();

    // Set header PDF
    doc.setFontSize(13);
    doc.setTextColor("#0046A1");
    doc.text("PT DWI PANCA EKATAMA", 15, 20);
    doc.setFontSize(10);
    doc.setTextColor("#000");
    doc.text(
      "Flange management, Cold Cutting & Beveling, Onsite Machining, Online Leak Sealing",
      15,
      25
    );
    doc.text(
      "Bekasi | www.dwipancabolting.id | info@dwipancabolting.id | +62 882 1076 4116",
      15,
      30
    );

    doc.setFontSize(11);
    doc.text("Bekasi, 20 September 2024", 15, 50);
    doc.text(`Nomor: ${inquiry.nomor}`, 15, 55);
    doc.text(`Perihal: ${inquiry.jenisQuotation}`, 15, 60);

    doc.text(`Yth: ${inquiry.company}`, 15, 70);
    doc.text(`Attn: Bapak ${inquiry.name}`, 15, 75);

    doc.text("Dengan hormat,", 15, 90);
    doc.text(
      "Sehubungan dengan permintaan penawaran saudara maka dengan ini kami mengajukan penawaran \nharga dengan rincian sebagai berikut:",
      15,
      95
    );

    // Generate tabel menggunakan autoTable (untuk rincian harga)
    const itemData = inquiry.items.map((item, index) => [
      (index + 1).toString(),
      item.quantity,
      item.description,
      `Rp${parseInt(item.pricePerUnit).toLocaleString()}`,
      `Rp${parseInt(item.totalPrice).toLocaleString()}`,
    ]);

    const totalPrice = inquiry.items.reduce(
      (acc, item) => acc + parseInt(item.totalPrice),
      0
    );

    itemData.push(["", "", "", "Total", `Rp${totalPrice.toLocaleString()}`]);

    doc.autoTable({
      startY: 105,
      head: [["No", "Qty", "Description", "Price/Unit", "Total Price"]],
      body: itemData,
    });

    // Syarat dan ketentuan
    doc.text("Syarat dan ketentuan:", 15, doc.autoTable.previous.finalY + 10);
    inquiry.terms.forEach((term, index) => {
      const yPosition = doc.autoTable.previous.finalY + 15 + index * 5;
      console.log(yPosition);
      doc.text(`${index + 1}. ${term}`, 20, yPosition);
    });

    // Tentukan posisi vertikal (Y) terakhir dari elemen terms
    const lastYPosition =
      doc.autoTable.previous.finalY + 15 + inquiry.terms.length * 5;

    // Kontak tambahan
    console.log(lastYPosition + 20);

    doc.text(
      "Jika memerlukan informasi lainnya dapat menghubungi Bpk Dion HP. 0882 1076 4116.",
      15,
      lastYPosition + 5
    );
    doc.text(
      "Atas perhatian dan kerjasamanya kami ucapkan terimakasih.",
      15,
      lastYPosition + 10
    );

    doc.text("Hormat kami,", 15, doc.autoTable.previous.finalY + 90);
    doc.text("Aulia Rachmat Yusdion", 15, doc.autoTable.previous.finalY + 120);
    doc.text(
      "Direktur | PT Dwi Panca Ekatama",
      15,
      doc.autoTable.previous.finalY + 125
    );

    // Generate and save PDF
    doc.save(`Penawaran_${inquiry.company}.pdf`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Inquiry List
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 4 }}
        onClick={() => router.push("/inquiries/add")}
      >
        Add Inquiry
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Company
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Status
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Created At
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id}>
                <TableCell>
                  <Typography>{inquiry.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{inquiry.company}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{inquiry.status}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {inquiry.createdAt instanceof Date
                      ? new Date(inquiry.createdAt).toLocaleString()
                      : inquiry.createdAt.toDate().toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => router.push(`/inquiries/edit/${inquiry.id}`)}
                  >
                    Edit/View
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => generatePDF(inquiry)}
                  >
                    Generate PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default InquiryList;
