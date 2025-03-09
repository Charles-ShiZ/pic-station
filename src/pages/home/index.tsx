import React, { useState } from "react";
import ImageWaterfallFlow from "../../components/ImageWaterfallFlow";
import { UploadPsd } from "@/components/UploadPsd";
import { psdData } from "@/const";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleClose = () => {
    setDialogOpen(false);
  };
  return (
    <div>
      <UploadPsd></UploadPsd>
      <Button
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        打开
      </Button>
      <Dialog
        container={document.querySelector("#microApp")?.querySelector("#root")}
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <ImageWaterfallFlow imageItems={psdData} />
    </div>
  );
}
