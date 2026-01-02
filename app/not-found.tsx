import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center p-4">
      <Box className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-[#75c24c] mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <Typography className="text-gray-600 mb-6">
            The page you are looking for doesn't exist or has been moved.
          </Typography>
        </div>

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button
              variant="contained"
              className="bg-[#75c24c] hover:bg-[#5fa83a] text-white w-full py-2"
            >
              Go to Homepage
            </Button>
          </Link>
        </div>
      </Box>
    </div>
  );
}
